import datetime
import ftplib
import logging
import os
import re
import shutil
import time
from os import listdir
from os.path import isfile, join

import jsonpickle
import numpy as np
import pandas as pd
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework_swagger.views import get_swagger_view
from sftpConnectionToExecutionServer.views import sftp
from talendEsb.models import TransactionsLivraison
from talendEsb.views import startEngineOnEdiFilesWithData

from .models import AnomaliesEdiFileAnnuaire, HistoryAnomaliesEdiFiles
from .models import Client, AllMadFileContent, InterventionAdmin, kpi4WithFiltersDto, kpi2WithFiltersDto
from .models import EDIfile
from .models import FileExcelContent
from .models import FileInfo, Contact, kpi3SchemaSingleAnomalie, getNumberOfAnomaliesPerDateDTO, \
    getNumberOfAnomaliesWithFiltersDTO
from .serializers import ClientSerializer, ClientTestSerialize

from core.clientService import getAllClientList , getClientInfo
from core.ediFileService import saveUploadedEdiFile , getAllFileEdiData , getFilesEdiByClient , getSingleEdiFileDetail , seeFileContentEdi , createFileFromColumnAndRowsAndUpdateCore

schema_view = get_swagger_view(title='TEST API')

logger = logging.getLogger('django')

path_racine_input = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/"
path_racine_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/"





@api_view(['GET'])
def client_detail(request, pk):

    client = getClientInfo(pk)
    client_serializer = ClientSerializer(client)
    return JsonResponse(client_serializer.data)



@api_view(['GET'])
def file_detail(request, pk):

    fileReponse = getSingleEdiFileDetail(pk)

    return HttpResponse(jsonpickle.encode(fileReponse, unpicklable=False), content_type="application/json")



@api_view(['GET'])
def clientList(request):

    listClients = getAllClientList()

    return HttpResponse(jsonpickle.encode(listClients, unpicklable=False), content_type="application/json")





@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def fileCreate(request, format=None):
    logger.info('début web service : génération automatique des fichiers EDI !')
    request_file = request.FILES['file']
    response = saveUploadedEdiFile(request_file)
    json_data = JSONRenderer().render(response)
    logger.info('fin web service : génération automatique des fichiers EDI ')
    return HttpResponse(json_data, content_type='application/json')


@api_view(['GET'])
def fileList(request):

    listFiles = getAllFileEdiData()

    return HttpResponse(jsonpickle.encode(listFiles, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def getFilesByClient(request):
    clientCode = request.data['client_code']

    listFiles = getFilesEdiByClient(clientCode)

    return HttpResponse(jsonpickle.encode(listFiles, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def downloadFileName(request):
    fileName = request.data['fileName']
    clientCode = request.data['clientCode']
    ftp = connect()
    path_racine = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
    path_client = path_racine + '/' + clientCode
    ftp.cwd(path_client)
    for name in ftp.nlst():
        if name == fileName:
            with open(name, "wb") as file:
                commande = "RETR " + name
                ftp.retrbinary(commande, file.write)
            break
    with open(fileName, 'rb') as f:
        file = f.read()
    response = HttpResponse(file, content_type="application/xls")
    response['Content-Disposition'] = "attachment; filename={0}".format(fileName)
    response['Content-Length'] = os.path.getsize(fileName)
    os.remove(fileName)
    return response


@api_view(['POST'])
def seeFileContent(request):
    filename = request.data['fileName']
    clientCode = request.data['clientCode']

    responseObject = seeFileContentEdi(filename,clientCode)
    responseObjectText = jsonpickle.encode(responseObject, unpicklable=False)
    print(responseObjectText)
    return HttpResponse(responseObjectText, content_type="application/json")





@api_view(['GET'])
def numberOfFilesPerClient(request):
    queryset = Client.objects.filter(archived=False)
    serializer_class = ClientTestSerialize(queryset, many=True)
    json_data = JSONRenderer().render(serializer_class.data)
    return HttpResponse(json_data, content_type='application/json')


def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp





@api_view(['POST'])
def createFileFromColumnAndRowsAndUpdate(request):
    columns = request.data['columns']
    rows = request.data['rows']
    fileId = request.data['fileId']
    response = createFileFromColumnAndRowsAndUpdateCore(columns, rows, fileId)
    return response




@api_view(['GET'])
def kpi3(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    listAnomaliesToReturn = []
    for anomaly in historyanomalies:
        listAnomaliesToReturn.append(
            kpi3SchemaSingleAnomalie(anomalie_id=anomaly.id, number_of_anomalies=anomaly.number_of_anomalies,
                                     execution_time=anomaly.execution_time, edi_file_id=anomaly.edi_file.id,
                                     client_id=anomaly.edi_file.client.id,
                                     client_name=anomaly.edi_file.client.nom_client,
                                     client_code=anomaly.edi_file.client.code_client,
                                     edi_file_name=anomaly.edi_file.file.name, anomalie_name=anomaly.anomalie.label))
    return HttpResponse(jsonpickle.encode(listAnomaliesToReturn, unpicklable=False), content_type='applicaiton/json')


def seeFileContentMADFileCore(fileType, transaction_id):
    osOriginalPath = os.getcwd()
    try:
        osCreateMediaFiles(os)
        os.chdir("media/files/UrbantzToHub/")

        transaction = TransactionsLivraison.objects.get(id=transaction_id)
        remotefilePath = ""
        fileName = ""
        if fileType == "livraison":
            remotefilePath = transaction.fichier_livraison_sftp
            fileName = "Livraisons.xlsx"
        elif fileType == "exception":
            remotefilePath = transaction.fichier_exception_sftp
            fileName = "Livraisons_Exception.xlsx"
        elif fileType == "metadata":
            remotefilePath = transaction.fichier_metadata_sftp
            fileName = "ExceptionFacturationValue_Livraisons.xlsx"
        elif fileType == "mad":
            remotefilePath = transaction.fichier_mad_sftp
            fileName = "ToVerifyQTE_MAD_Livraisons.xlsx"
        else:
            raise Exception("fileType not supported by server")
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)

        excelfile = pd.read_excel(fileName)
        excelfile = excelfile.fillna('')
        columns = list(excelfile.columns)
        rows = excelfile.values.tolist()
        os.remove(fileName)
        responseObject = FileExcelContent(columns, rows)

        os.chdir(osOriginalPath)
        return responseObject
    except Exception as e:
        os.chdir(osOriginalPath)
        print(e)


@api_view(['POST'])
def seeFileContentMADFile(request):
    fileType = request.data['fileType']
    transaction_id = request.data['transaction_id']
    try:
        responseObject = seeFileContentMADFileCore(fileType, transaction_id)
        responseObjectText = jsonpickle.encode(responseObject, unpicklable=False)
        return HttpResponse(responseObjectText, content_type="application/json")
    except Exception as e:
        return JsonResponse({'message': 'internal error'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def getNumberOfAnomaliesPerDate(request):
    dateToFilter = request.data['date']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(execution_time=dateToFilter).prefetch_related(
        "anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(dateToFilter, numberOfAnomaliestotal), unpicklable=False),
        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfAnomaliesPerDateAll(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S") not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] = 0

        mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfInterventionsPerDateAll(request):
    interventionAdmin = InterventionAdmin.objects.order_by('execution_time').prefetch_related(
        "id_admin").prefetch_related("id_file_edi")
    mapDateToNumberOfInterventions = {}
    for intervention in interventionAdmin:
        if intervention.execution_time.strftime("%m-%d-%Y") not in mapDateToNumberOfInterventions.keys():
            mapDateToNumberOfInterventions[intervention.execution_time.strftime("%m-%d-%Y")] = 0

        mapDateToNumberOfInterventions[intervention.execution_time.strftime("%m-%d-%Y")] += 1

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfInterventions, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfFilesPerDateAll(request):
    ediFiles = EDIfile.objects.order_by('created_at').prefetch_related("client")
    mapDateToNumberOfFiles = {}
    for edifile in ediFiles:
        if edifile.created_at.strftime("%m-%d-%Y") not in mapDateToNumberOfFiles.keys():
            mapDateToNumberOfFiles[edifile.created_at.strftime("%m-%d-%Y")] = 0

        mapDateToNumberOfFiles[edifile.created_at.strftime("%m-%d-%Y")] += 1

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfFiles, unpicklable=False), content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfAnomaliesPerId(request):
    anomalie_id = request.data['anomalie_id']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(anomalie=anomalie_id).prefetch_related(
        "anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(anomalie_id, numberOfAnomaliestotal), unpicklable=False),
        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfAnomaliesPerIdAll(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.anomalie.label not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.anomalie.label] = 0

        mapDateToNumberOfAnomalies[anomaly.anomalie.label] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfAnomaliesWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]
    anomalieFilter = request.data["anomalieFilter"]
    fileFilter = request.data["fileFilter"]

    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related(
        "edi_file").prefetch_related("edi_file__client")

    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            historyanomalies = historyanomalies.filter(execution_time__gte=startDate)
        if endDate != None:
            historyanomalies = historyanomalies.filter(execution_time__lte=endDate)
    if (clientFilter != None) and (len(clientFilter) > 0):
        historyanomalies = historyanomalies.filter(edi_file__client__nom_client__in=clientFilter)
    if (fileFilter != None) and (len(fileFilter) > 0):
        historyanomalies = historyanomalies.filter(edi_file__file__in=fileFilter)
    if (anomalieFilter != None) and (len(anomalieFilter) > 0):
        historyanomalies = historyanomalies.filter(anomalie__label__in=anomalieFilter)
    mapDateToNumberOfAnomalies = {}
    mapIdToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.anomalie.label not in mapIdToNumberOfAnomalies.keys():
            mapIdToNumberOfAnomalies[anomaly.anomalie.label] = 0
        if anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S") not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] = 0

        mapIdToNumberOfAnomalies[anomaly.anomalie.label] += anomaly.number_of_anomalies
        mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesWithFiltersDTO(mapIdToNumberOfAnomalies, mapDateToNumberOfAnomalies),
                          unpicklable=False), content_type='applicaiton/json')


def osCreateMediaFiles(os):
    osOriginalPath = os.getcwd()
    if "media" not in os.listdir():
        os.mkdir("media")
    os.chdir("media")
    if "files" not in os.listdir():
        os.mkdir("files")
    os.chdir("files")
    if "UrbantzToHub" not in os.listdir():
        os.mkdir("UrbantzToHub")
    os.chdir("UrbantzToHub")

    os.chdir(osOriginalPath)


@api_view(['POST'])
def seeAllFileContentMADFile(request):
    transaction_id = request.data['transaction_id']
    livraison = seeFileContentMADFileCore("livraison", transaction_id)
    exception = seeFileContentMADFileCore("exception", transaction_id)
    metadata = seeFileContentMADFileCore("metadata", transaction_id)
    mad = seeFileContentMADFileCore("mad", transaction_id)
    return HttpResponse(jsonpickle.encode(AllMadFileContent(livraison, exception, metadata, mad), unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['POST'])
def DoInterventionAsAdminForEdiFileAndCorrectFile(request):
    id_admin = request.data['account_id']
    columns = request.data['columns']
    rows = request.data['rows']
    fileId = request.data['fileId']

    interventionToSave = InterventionAdmin()
    interventionToSave.id_admin_id = id_admin
    interventionToSave.id_file_edi_id = fileId
    interventionToSave.save()

    return createFileFromColumnAndRowsAndUpdateCore(columns, rows, fileId)


@api_view(['POST'])
def getNumberOfInterventionsWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]

    interventionAdmin = InterventionAdmin.objects.all().prefetch_related("id_admin").prefetch_related(
        "id_file_edi").prefetch_related("id_file_edi__client")

    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            interventionAdmin = interventionAdmin.filter(execution_time__gte=startDate)
        if endDate != None:
            interventionAdmin = interventionAdmin.filter(execution_time__lte=endDate)
    if (clientFilter != None) and (len(clientFilter) > 0):
        interventionAdmin = interventionAdmin.filter(id_file_edi__client__nom_client__in=clientFilter)

    result = []
    for intervention in interventionAdmin:
        execution_time = intervention.execution_time.strftime("%m-%d-%Y")
        adminUserName = intervention.id_admin.username
        fileName = intervention.id_file_edi.file.name
        clientName = intervention.id_file_edi.client.nom_client
        item = kpi4WithFiltersDto(date=execution_time, fileName=fileName, clientName=clientName,
                                  AdminName=adminUserName)
        result.append(item)
    return HttpResponse(jsonpickle.encode(result, unpicklable=False), content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfFilesWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]

    ediFiles = EDIfile.objects.order_by('created_at').prefetch_related("client")
    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            ediFiles = ediFiles.filter(created_at__gte=startDate)
        if endDate != None:
            ediFiles = ediFiles.filter(created_at__lte=endDate)
    if (clientFilter != None) and (len(clientFilter) > 0):
        ediFiles = ediFiles.filter(client__nom_client__in=clientFilter)

    result = []
    for edifile in ediFiles:
        execution_time = edifile.created_at.strftime("%m-%d-%Y")
        fileName = edifile.file.name
        clientName = edifile.client.nom_client
        item = kpi2WithFiltersDto(date=execution_time, fileName=fileName, clientName=clientName)
        result.append(item)
    return HttpResponse(jsonpickle.encode(result, unpicklable=False), content_type='applicaiton/json')
