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
from .models import transactionFileColumnsException , transactionFileColumnsLivraison,transactionFileColumnsMetadata, transactionFileColumnsMad
from .serializers import ClientSerializer, ClientTestSerialize

from core.clientService import getAllClientList , getClientInfo
from core.ediFileService import saveUploadedEdiFile , getAllFileEdiData , getFilesEdiByClient , getSingleEdiFileDetail , seeFileContentEdi , createFileFromColumnAndRowsAndUpdateCore , createFileEdiFromColumnAndRows

schema_view = get_swagger_view(title='TEST API')

logger = logging.getLogger('django')

path_racine_input = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/"
path_racine_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/"





@api_view(['GET'])
def client_detail(request, pk):

    client = getClientInfo(pk)
    client_serializer = ClientSerializer(client)
    return JsonResponse(client_serializer.data)

@api_view(['PUT'])
def client_detail_update(request, pk):


    client = getClientInfo(pk)
    client.token = request.data['token']
    client.token_for_flux = request.data['token_for_flux']
    client.save()
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


@api_view(['GET'])
def getFilesByClient(request,pk):


    listFiles = getFilesEdiByClient(pk)

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

@api_view(['POST'])
def createFileFromColumnAndRows(request):
    columns = request.data['columns']
    rows = request.data['rows']
    fileId = request.data['fileId']
    response = createFileEdiFromColumnAndRows(columns, rows, fileId)
    return response


def reading_list_transactionFileColumnsException(df: pd.DataFrame) -> list:
    return list(map(lambda x: transactionFileColumnsException(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8],x[9],x[10],x[11],x[12],x[13],x[14],x[15]), df.values.tolist()))

def reading_list_transactionFileColumnsLivraison(df: pd.DataFrame) -> list:
    return list(map(lambda x: transactionFileColumnsLivraison(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8],x[9],x[10],x[11],x[12],x[13],x[14]), df.values.tolist()))

def reading_list_transactionFileColumnsMetadata(df: pd.DataFrame) -> list:
    return list(map(lambda x: transactionFileColumnsMetadata(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8],x[9],x[10],x[11],x[12],x[13],x[14],x[15],x[16],x[17],x[18]), df.values.tolist()))

def reading_list_transactionFileColumnsMad(df: pd.DataFrame) -> list:
    return list(map(lambda x: transactionFileColumnsMad(x[0]), df.values.tolist()))

def seeFileContentMADFileCore(fileType, transaction_id):
    osOriginalPath = os.getcwd()
    try:
        osCreateMediaFiles(os)
        os.chdir("media/files/UrbantzToHub/")
        transaction = TransactionsLivraison.objects.get(id=transaction_id)
        remotefilePath = ""
        fileName = ""
        functionToUse= None
        if fileType == "livraison":
            remotefilePath = transaction.fichier_livraison_sftp
            fileName = "Livraisons.xlsx"
            functionToUse = reading_list_transactionFileColumnsLivraison
        elif fileType == "exception":
            remotefilePath = transaction.fichier_exception_sftp
            fileName = "Livraisons_Exception.xlsx"
            functionToUse = reading_list_transactionFileColumnsException
        elif fileType == "metadata":
            remotefilePath = transaction.fichier_metadata_sftp
            fileName = "ExceptionFacturationValue_Livraisons.xlsx"
            functionToUse = reading_list_transactionFileColumnsMetadata
        elif fileType == "mad":
            remotefilePath = transaction.fichier_mad_sftp
            fileName = "ToVerifyQTE_MAD_Livraisons.xlsx"
            functionToUse = reading_list_transactionFileColumnsMad
        else:
            raise Exception("fileType not supported by server")
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)

        excelfile = pd.read_excel(fileName)
        excelfile = excelfile.fillna('')


        #columns = list(excelfile.columns)
        #rows = excelfile.values.tolist()
        os.remove(fileName)
        responseObject = functionToUse(excelfile)

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
def DoInterventionAsAdminForEdiFileAndChangeFile(request):
    id_admin = request.data['account_id']
    columns = request.data['columns']
    rows = request.data['rows']
    fileId = request.data['fileId']

    fileType = request.data['fileType']

    interventionToSave = InterventionAdmin()
    interventionToSave.id_admin_id = id_admin
    interventionToSave.id_file_edi_id = fileId
    interventionToSave.save()

    createFileEdiFromColumnAndRows(columns, rows, fileId ,fileType)
    return JsonResponse({'message': 'done'}, status=status.HTTP_200_OK)

