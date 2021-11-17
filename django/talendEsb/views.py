from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
# import pdb
from rest_framework.response import Response
from rest_framework import status
from core.models import EDIfile
from sftpConnectionToExecutionServer.views import sftp
from .transactionFileService import sendTransactionParamsToExecutionServerInCsvFile, updateMetaDataFileInTableTransactionsLivraison
from django.http import JsonResponse

# talendUrl = 'https://webhooks.eu.cloud.talend.com/onDemandESB/e6cb39ecec634b44b99b40ab36eda213'
# talendUrl = 'https://webhooks.eu.cloud.talend.com/OnDemand/d9454150cb0641658e132131bf6d585d'
from .models import SendMadPostProcessPostObject , TransactionsLivraison , TransactionsLivraisonMadDto, RabbitMqMessagesForJobToStart
import pandas as pd
import jsonpickle
import os
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from core.logisticFileService import updateMetaDataFileInTableCoreLogisticFile
#talendUrlEDIFileWebHook ='https://webhooks.eu.cloud.talend.com/ondemandEdiWebHookDev2/b3059ca807ff4e1c99825fb81716a81c'
#talendUrlEDIFileWebHook ='https://webhooks.eu.cloud.talend.com/WebHookEdiDevV2/abf4dae483424aee9577ebc0aac9b81d'
talendUrlEDIFileWebHook ='https://webhooks.eu.cloud.talend.com/WebHookDiagnosticFileEdiV3/076247bbdec34a8391c77a5b2159b591'

#talendUrlMADFileWebHookOLD ='https://webhooks.eu.cloud.talend.com/ondemandUrbantzToHubWebHookDev/0920e59cd9e54e43b0b11ca072a02850'
#talendUrlMADFileWebHook = 'https://webhooks.eu.cloud.talend.com/ondemandUrbantzToHubWebHookDevV2/f8e6c58d240a4248b8f1a06e63621fae'
talendUrlMADFileWebHook = 'https://webhooks.eu.cloud.talend.com/ondemandUrbantzToHubWebHookDevV3/9c89751b78d3403e9d30c77775a373ce'
#talendUrlMagistorWebHook = 'https://webhooks.eu.cloud.talend.com/WMS_ONDEMAND_FWH/9162c61d321d44eb81a528107e726e57'
talendUrlMagistorWebHook = 'https://webhooks.eu.cloud.talend.com/ondemand_webhouk/810dff0fb12748fcbd308ddea901598f'
@api_view(['POST'])
def startEngineOnMagistorFiles(request):
	print("request.data for magistor",request.data);
	return startEngineWithLinkAndData(talendUrlMagistorWebHook,request.data)

@api_view(['POST'])
def startEngineOnEdiFiles(request):
	return startEngineOnEdiFilesWithData(request.data)

def startEngineOnEdiFilesWithData(data):

	EDIfile.objects.filter(pk=data[0]["fileId"]).update(cliqued=True)
	from rabbitMQ.views import sendMessageRabbitMqToStartJob
	#requests.post(talendUrlEDIFileWebHook, json=data)
	from websocket.consumers import ChatConsumer
	ChatConsumer.state['Running_Jobs'].append("Talend Job Edi " + str(data[0]["fileId"]))
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		'notifications_room_group',
		{
			'type': 'send_message_to_frontend',
			'message': ChatConsumer.state
		}
	)
	messageMQ= RabbitMqMessagesForJobToStart(webhook= talendUrlEDIFileWebHook , payloadToSendToTalend= data , environnement= "dev")
	sendMessageRabbitMqToStartJob(jsonpickle.encode(messageMQ,unpicklable=False))
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


def startEngineWithLinkAndData(link:str,data):

	updateMetaDataFileInTableCoreLogisticFile(logisticFileId=data[0]['Magistor_File_Id'], logisticFileStatus="En cours")
	requests.post(link, json=data)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


madPlanJobList = ["ECOLOTRANS_URBANTZ_TO_HUB_SANS_MAD_OTHERS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_TO_HUB_SANS_MAD_RUNGIS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_TO_HUB_MAD_DB_ONDEMAND",
				  "ECOLOTRANS_ROUND_CALCULATE_NEW_RULE_QUANTITY_ONDEMAND",
				  "ROUND_ECOLOTRANS_DIAGNOSTIC_LIVRAISON_QUANTITY_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_CORRECTION_EXCEPTIONS_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_CORRECTION_FACTURATION_VALUES_ONDEMAND",
				  "ECOLOTRANS_URBANTZ_TO_HUB_MAD_CORRECTION",
				  "ECOLOTRANS_URBANTZ_LIVRAISON_FILE_CORRECTION" ]

@api_view(['POST'])
def integrerMADFile(request):
	transaction_id = request.data['transaction_id']
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	jobs_to_start = []
	jobs_to_start.append(madPlanJobList[0])
	jobs_to_start.append(madPlanJobList[1])
	jobs_to_start.append(madPlanJobList[2])
	jobs_to_start.append(madPlanJobList[3])
	jobs_to_start.append(madPlanJobList[4])

	madObjectToPost = SendMadPostProcessPostObject(transaction_id = transaction.id,end_date_plus_one = transaction.end_date.strftime("%Y/%m/%d"),start_date = transaction.start_date.strftime("%Y/%m/%d"),jobs_to_start =jobs_to_start)
	startEngineOnMadFiles(madObjectToPost)
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def genererMADFile(request):
	transactionToInsert = TransactionsLivraison(start_date= request.data['start_date'] , end_date =request.data['end_date'] , statut="En attente")
	transactionToInsert.save()
	jobs_to_start = []
	jobs_to_start.append(madPlanJobList[0])
	jobs_to_start.append(madPlanJobList[1])
	jobs_to_start.append(madPlanJobList[2])
	jobs_to_start.append(madPlanJobList[3])
	jobs_to_start.append(madPlanJobList[4])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transactionToInsert.id, jobs_to_start =jobs_to_start,destination_folder="to_generate")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def correctExceptionFile(request):
	transaction_id = request.data['transaction_id']
	fileReplacement = request.data['fileReplacement']
	fileName = "Livraisons_Exception.xlsx"
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	df.to_excel(fileName, index=False)
	sftp.put(localpath =  fileName ,remotepath= transaction.fichier_exception_sftp )

	jobs_to_start = []
	jobs_to_start.append(madPlanJobList[5])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transaction.id, jobs_to_start =jobs_to_start,destination_folder="to_correct")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def correctMetadataFile(request):
	transaction_id = request.data['transaction_id']
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	fileReplacement = request.data['fileReplacement']
	fileName = "ExceptionFacturationValue_Livraisons.xlsx"
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])

	df.to_excel(fileName, index=False)
	sftp.put(localpath=fileName, remotepath=transaction.fichier_metadata_sftp)



	jobs_to_start = []
	jobs_to_start.append(madPlanJobList[6])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transaction.id, jobs_to_start =jobs_to_start,destination_folder="to_correct")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def correctMADFile(request):
	transaction_id = request.data['transaction_id']
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	fileReplacement = request.data['fileReplacement']
	fileName = "ToVerifyQTE_MAD_Livraisons.xlsx"
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])

	df.to_excel(fileName, index=False)
	sftp.put(localpath=fileName, remotepath=transaction.fichier_mad_sftp)



	jobs_to_start = []
	jobs_to_start.append(madPlanJobList[7])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transaction.id, jobs_to_start =jobs_to_start,destination_folder="to_correct")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def correctLivraisonFile(request):
	transaction_id = request.data['transaction_id']
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	fileReplacement = request.data['fileReplacement']
	fileName = "Livraisons.xlsx"
	df = pd.DataFrame(fileReplacement['rows'], columns=fileReplacement['columns'])

	df.to_excel(fileName, index=False)
	sftp.put(localpath=fileName, remotepath=transaction.fichier_livraison_sftp)



	jobs_to_start = []

	jobs_to_start.append(madPlanJobList[8])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transaction.id, jobs_to_start =jobs_to_start,destination_folder="to_correct")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)



@api_view(['POST'])
def correctAllFiles(request):
	transaction_id = request.data['transaction_id']
	transaction = TransactionsLivraison.objects.get(id=transaction_id)
	transaction.statut = "En attente"
	transaction.save()
	fileReplacementLivraison = request.data['fileReplacementLivraison']
	fileReplacementMAD = request.data['fileReplacementMAD']
	fileReplacementMetadata = request.data['fileReplacementMetadata']
	fileReplacementException = request.data['fileReplacementException']

	fileNameLivraison = "Livraisons.xlsx"
	fileNameMAD = "ToVerifyQTE_MAD_Livraisons.xlsx"
	fileNameMetadata = "ExceptionFacturationValue_Livraisons.xlsx"
	fileNameException = "Livraisons_Exception.xlsx"
	jobs_to_start = []

	if fileReplacementLivraison != None :
		df = pd.DataFrame(fileReplacementLivraison['rows'], columns=fileReplacementLivraison['columns'])

		df.to_excel(fileNameLivraison, index=False)
		sftp.put(localpath=fileNameLivraison, remotepath=transaction.fichier_livraison_sftp)
		jobs_to_start.append(madPlanJobList[8])

	if fileReplacementMAD != None :
		df = pd.DataFrame(fileReplacementMAD['rows'], columns=fileReplacementMAD['columns'])

		df.to_excel(fileNameMAD, index=False)
		sftp.put(localpath=fileNameMAD, remotepath=transaction.fichier_mad_sftp)
		jobs_to_start.append(madPlanJobList[7])

	if fileReplacementMetadata != None :
		df = pd.DataFrame(fileReplacementMetadata['rows'], columns=fileReplacementMetadata['columns'])

		df.to_excel(fileNameMetadata, index=False)
		sftp.put(localpath=fileNameMetadata, remotepath=transaction.fichier_metadata_sftp)
		jobs_to_start.append(madPlanJobList[6])

	if fileReplacementException != None :
		df = pd.DataFrame(fileReplacementException['rows'], columns=fileReplacementException['columns'])

		df.to_excel(fileNameException, index=False)
		sftp.put(localpath=fileNameException, remotepath=transaction.fichier_exception_sftp)
		jobs_to_start.append(madPlanJobList[5])

	jobs_to_start.append(madPlanJobList[0])
	jobs_to_start.append(madPlanJobList[1])
	jobs_to_start.append(madPlanJobList[2])
	jobs_to_start.append(madPlanJobList[3])
	jobs_to_start.append(madPlanJobList[4])

	sendTransactionParamsToExecutionServerInCsvFile(transaction_id=transaction.id,jobs_to_start =jobs_to_start,destination_folder="to_correct")

	return Response({"message": "ok"}, status=status.HTTP_200_OK)

def startEngineOnMadFiles(madObjectToPost :  SendMadPostProcessPostObject):
	from rabbitMQ.views import sendMessageRabbitMqToStartJob
	# requests.post(talendUrlEDIFileWebHook, json=data)
	from websocket.consumers import ChatConsumer
	ChatConsumer.stateTransaction['Running_Jobs'].append("Talend Job Mad Transaction " + str(madObjectToPost.transaction_id))
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		'notifications_room_group',
		{
			'type': 'send_message_to_frontend',
			'message': ChatConsumer.stateTransaction
		}
	)
	messageMQ = RabbitMqMessagesForJobToStart(webhook=talendUrlMADFileWebHook, payloadToSendToTalend=madObjectToPost,
											  environnement="dev")
	sendMessageRabbitMqToStartJob(jsonpickle.encode(messageMQ, unpicklable=False))
	return Response({"message": "ok"}, status=status.HTTP_200_OK)


@api_view(['get'])
def getAllTransactionMadLivraison (request):
	response = []
	for transactionDB in TransactionsLivraison.objects.all().order_by('-created_at') :
		t = TransactionsLivraisonMadDto(transaction_id = transactionDB.id ,start_date = transactionDB.start_date,end_date = transactionDB.end_date,statut = transactionDB.statut,fichier_livraison_sftp = transactionDB.fichier_livraison_sftp,fichier_exception_sftp = transactionDB.fichier_exception_sftp,fichier_metadata_sftp = transactionDB.fichier_metadata_sftp,fichier_mad_sftp = transactionDB.fichier_mad_sftp,created_at = transactionDB.created_at)
		response.append(t)
	return HttpResponse(jsonpickle.encode(response,unpicklable=False), content_type="application/json")



@api_view(['get'])
def getSingleTransactionMadLivraison (request,pk):

	transactionDB =  TransactionsLivraison.objects.get(id = pk)
	t = TransactionsLivraisonMadDto(transaction_id = transactionDB.id ,start_date = transactionDB.start_date,end_date = transactionDB.end_date,statut = transactionDB.statut,fichier_livraison_sftp = transactionDB.fichier_livraison_sftp,fichier_exception_sftp = transactionDB.fichier_exception_sftp,fichier_metadata_sftp = transactionDB.fichier_metadata_sftp,fichier_mad_sftp = transactionDB.fichier_mad_sftp,created_at = transactionDB.created_at)

	return HttpResponse(jsonpickle.encode(t,unpicklable=False), content_type="application/json")

@api_view(['POST'])
def updateMetaDataFileInTableTransactionsLivraisonWS(request):
    transactionId = request.data['transactionId']
    transactionStatus =  request.data['transactionStatus']

    updateMetaDataFileInTableTransactionsLivraison(transactionId=transactionId, transactionStatus=transactionStatus)
    return JsonResponse({'message': 'done'}, status=status.HTTP_200_OK)

