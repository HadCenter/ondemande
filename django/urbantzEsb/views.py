import ftplib

from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
# import pdb
from rest_framework.response import Response
from rest_framework import status
from .models import UrbantzTask, TaskItem, Metadata, ContactUrbantz, BuildingInfoUrbantz, LocationUrbantz, \
	TimeWindowUrbantz
from django.core import serializers
import jsonpickle
import json
import pandas as pd
from core.models import Client

from core.models import EDIfile

urbantzUrl = "https://api.urbantz.com/v2/task"
path_racine_talend_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"


@api_view(['POST'])

def SendFromFileToUrbantzAsTasks(request):
	try:
		ftp = connect()

		path_client = path_racine_talend_output + '/' + request.data['clientCode']
		ftp.cwd(path_client)
		for name in ftp.nlst():
			if name == request.data['fileName']:
				with open(name, "wb") as file:
					commande = "RETR " + name
					ftp.retrbinary(commande, file.write)
				break
		excelfile = pd.read_excel(request.data['fileName'])

		clientDB = Client.objects.get(code_client=request.data['clientCode'])
		headers = {
			'x-api-key': clientDB.token_for_flux,
			'x-api-secret': clientDB.token,
			'Content-Type': 'application/json'
		}
		excelfile = excelfile.fillna('')

		taskList = []

		for row in excelfile.itertuples():

			typeService: str
			if row.Type == "ENLEVEMENT":
				typeService = "pickup"
			elif row.Type == "LIVRAISON":
				typeService = "delivery"
			else:
				typeService = "service"

			hasElevator = (row.Etage != "")
			hasInterphone = (row.CODE_interphone != "")
			timewindowStart = row.Date_livraison + "T" + row.Start
			timewindowStop = row.Date_livraison + "T" + row.End
			rueNumber = ""
			rueNumberList = [int(s) for s in row.rue.split() if s.isdigit()]
			if len(rueNumberList) > 0:
				rueNumber = rueNumberList[0]

			rue = ''.join([i for i in row.rue if not i.isdigit()])

			timewindow = TimeWindowUrbantz(start=timewindowStart, stop=timewindowStop)
			buildingInfo = BuildingInfoUrbantz(interphoneCode=row.CODE_interphone, floor=row.Etage, digicode2=row.Tel2,
											   hasElevator=hasElevator, hasInterphone=hasInterphone)
			contact = ContactUrbantz(name=row.Nom_destinataire, phone=row.Telephone, email=row.email,
									 buildingInfo=buildingInfo)
			metadata = Metadata(CodeArticle=row.CodeArticle, Porte=row.Porte, Instructions=row.Instructions,
								Tel3=row.Tel3)
			location = LocationUrbantz(number=rueNumber, street=rue, city=row.ville, zip=row.CP, address=row.Adresse2)
			item = TaskItem(type=row.Labels, description=row.Labels, quantity=row.Quantite, name=row.Ref2,
							reference=row.Ref3, barcodeEncoding=row.Code_barres)
			items = []
			items.append(item)
			task = UrbantzTask(taskId=row.RefClient, client=row.Expediteur, type=typeService, date=row.Date_livraison,
							   taskReference=row.Ref_commande, contact=contact, metadata=metadata, address=location,
							   timeWindow=timewindow, timeWindow2=timewindow, items=items)
			taskList.append(task)

		jsonString = jsonpickle.encode(taskList, unpicklable=False)

		response = requests.post(urbantzUrl, jsonString, headers=headers)

		# reponseAllTasks = requests.get(urbantzUrl,headers = headers)
		EDIfile.objects.filter(pk=request.data["fileId"]).update(sendedToUrbantz=True)
		return Response({"message": "ok"}, status=status.HTTP_200_OK)
	except:
		return Response({"message" : "erreur"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp