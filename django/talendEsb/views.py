from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
# import pdb
from rest_framework.response import Response
from rest_framework import status
from core.models import EDIfile
from sftpConnectionToExecutionServer.views import sftp
# talendUrl = 'https://webhooks.eu.cloud.talend.com/onDemandESB/e6cb39ecec634b44b99b40ab36eda213'
# talendUrl = 'https://webhooks.eu.cloud.talend.com/OnDemand/d9454150cb0641658e132131bf6d585d'
from .models import SendMadPostProcessPostObject , TransactionsLivraison
import pandas as pd

talendUrlEDIFileWebHook ='https://webhooks.eu.cloud.talend.com/onDemandPipeline/f370e80809334a5499c2b7bc8d58a746'
#TODO REPLACE LINK WITH CORRECT LINK FOR MAD
talendUrlMADFileWebHook ='https://webhooks.eu.cloud.talend.com/onDemandPipeline/f370e80809334a5499c2b7bc8d58a746'


@api_view(['POST'])
def startEngineOnEdiFiles(request):
	return startEngineOnEdiFilesWithData(request.data)

def startEngineOnEdiFilesWithData(data):
	fileEdi = EDIfile.objects.get(pk=data[0]["fileId"])
	fileEdi.cliqued = True
	fileEdi.save()
	requests.post(talendUrlEDIFileWebHook, json=data)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)



madPlanJobList = ["ECOLOTRANS_URBANTZ_TO_HUB_SANS_MAD_OTHERS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_TO_HUB_SANS_MAD_RUNGIS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_TO_HUB_MAD_DB_ONDEMAND",
				  "ECOLOTRANS_ROUND_CALCULATE_NEW_RULE_QUANTITY_ONDEMAND",
				  "ROUND_ECOLOTRANS_DIAGNOSTIC_LIVRAISON_QUANTITY_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_CORRECTION_EXCEPTIONS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_CORRECTION_FACTURATION_VALUES_ONDEMAND"]
@api_view(['POST'])
def integrerMADFile(request):
	transactionToDo = request.data['transactionToDo']
	jobs_to_start = []
	if transactionToDo == "integrer":
		jobs_to_start.append(madPlanJobList[0])
		jobs_to_start.append(madPlanJobList[1])
		jobs_to_start.append(madPlanJobList[2])
		jobs_to_start.append(madPlanJobList[3])
		jobs_to_start.append(madPlanJobList[4])
	madObjectToPost = SendMadPostProcessPostObject(transaction_id = request.data['transaction_id'],end_date_plus_one = request.data['end_date_plus_one'],start_date = request.data['start_date'],jobs_to_start =jobs_to_start)
	startEngineOnMadFiles(madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def genererMADFile(request):
	#TODO HANDLE DATABASE
	transactionToDo = request.data['transactionToDo']
	jobs_to_start = []
	if transactionToDo == "generer":
		jobs_to_start.append(madPlanJobList[0])
		jobs_to_start.append(madPlanJobList[1])
		jobs_to_start.append(madPlanJobList[2])
		jobs_to_start.append(madPlanJobList[3])
		jobs_to_start.append(madPlanJobList[4])
		#TODO transaction id to get from DB after line creation
	madObjectToPost = SendMadPostProcessPostObject(transaction_id = request.data['transaction_id'],end_date_plus_one = request.data['end_date_plus_one'],start_date = request.data['start_date'],jobs_to_start =jobs_to_start)
	startEngineOnMadFiles(madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def correctExceptionFile(request):
	transaction_id = request.data['transaction_id']
	fileReplacement = request.data['fileReplacement']
	# TODO FILE NAME FROM TALEND
	fileName = request.data['fileName']
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	df.to_excel(fileName, index=False)
	sftp.put(localpath =  fileName ,remotepath= transaction.fichier_exception_sftp )



	transactionToDo = request.data['transactionToDo']
	jobs_to_start = []
	if transactionToDo == "correction exceptionFile":
		jobs_to_start.append(madPlanJobList[5])

	madObjectToPost = SendMadPostProcessPostObject(transaction_id = request.data['transaction_id'],end_date_plus_one = request.data['end_date_plus_one'],start_date = request.data['start_date'],jobs_to_start =jobs_to_start)
	startEngineOnMadFiles(madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def correctMetadataFile(request):
	transaction_id = request.data['transaction_id']
	fileReplacement = request.data['fileReplacement']
	# TODO FILE NAME FROM TALEND
	fileName = request.data['fileName']
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	df.to_excel(fileName, index=False)
	sftp.put(localpath=fileName, remotepath=transaction.fichier_metadata_sftp)



	transactionToDo = request.data['transactionToDo']
	jobs_to_start = []
	if transactionToDo == "correction metadataFile":
		jobs_to_start.append(madPlanJobList[6])

	madObjectToPost = SendMadPostProcessPostObject(transaction_id=request.data['transaction_id'],
												   end_date_plus_one=request.data['end_date_plus_one'],
												   start_date=request.data['start_date'], jobs_to_start=jobs_to_start)
	startEngineOnMadFiles(madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


def startEngineOnMadFiles(madObjectToPost :  SendMadPostProcessPostObject):
	requests.post(talendUrlMADFileWebHook, json=madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


#TODO FIND ALL TRANSACTIONS FROM DB