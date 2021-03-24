import ftplib

from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
# import pdb
from rest_framework.response import Response
from rest_framework import status
from .models import UrbantzTask,TaskItem , Metadata, ContactUrbantz , BuildingInfoUrbantz ,LocationUrbantz
from django.core import serializers
import jsonpickle
import json
import pandas as pd

urbantzUrl = "https://api.urbantz.com/v2/task"
path_racine_talend_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"


@api_view(['POST'])

def SendFromFileToUrbantzAsTasks(request):


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

	headers = {
		'x-api-key' : '0OCDfeE0zXfOjWYnV9rBaXepnJFnoPJngNLGSaGhhBCpCU6U',
		'x-api-secret' : 'E_K709uo00TO3X1Glqm4A7NOyQ88PBRwRv',
		'Content-Type' : 'application/json'
				}
	excelfile = excelfile.fillna('')

	taskList = []

	#START END Adresse2 Porte Instruction NOT MAPPED
	#Tel3 is not used
	for row in excelfile.itertuples() :
		buildingInfo = BuildingInfoUrbantz(interphoneCode= row.CODE_interphone , floor=row.Etage,digicode2=row.Tel2)
		contact = ContactUrbantz(name = row.Nom_destinataire,phone = row.Telephone ,email= row.email,buildingInfo = buildingInfo)
		metadata = Metadata(codeArticle= row.codeArticle)
		location = LocationUrbantz(street= row.rue , city= row.ville , zip= row.CP)
		item = TaskItem(type = row.Labels, description= row.Labels,quantity= row.Quantite ,name =row.Ref2,reference=row.Ref3,barcodeEncoding=row.Code_barres )
		items=[]
		items.append(item)
		task = UrbantzTask(taskId=row.RefClient,client=row.Expediteur,type = row.Type, date= row.Date_livraison , taskReference=row.Ref_commande, contact = contact,metadata = metadata, location = location)

	taskList.append(task)


	jsonString = jsonpickle.encode(taskList , unpicklable= False)



	response =requests.post(urbantzUrl, jsonString,headers = headers)

	#reponseAllTasks = requests.get(urbantzUrl,headers = headers)

	return Response({"message" : "ok"}, status=status.HTTP_200_OK)



def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp