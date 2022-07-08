import datetime
import ftplib
import logging
import os
import re
import shutil
import time
from os import listdir
from os.path import isfile, join
from API.settings import SECRET_KEY
import jwt

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
from sftpConnectionToExecutionServer.views import sftp, connect as connect_sftp
from talendEsb.models import TransactionsLivraison
from talendEsb.views import startEngineOnEdiFilesWithData

from .models import AnomaliesEdiFileAnnuaire, HistoryAnomaliesEdiFiles
from .models import Client, AllMadFileContent, InterventionAdmin, kpi4WithFiltersDto, kpi2WithFiltersDto
from .models import EDIfile
from .models import FileExcelContent
from .models import FileInfo, Contact, kpi3SchemaSingleAnomalie, getNumberOfAnomaliesPerDateDTO, \
    getNumberOfAnomaliesWithFiltersDTO
from .models import transactionFileColumnsException , transactionFileColumnsLivraison,transactionFileColumnsMetadata, transactionFileColumnsMad , TransactionFileContentAndOptions
from .serializers import ClientSerializer, ClientTestSerialize

from core.clientService import getAllClientList , getClientInfo
from core.ediFileService import saveUploadedEdiFile, getAllFileEdiData, getAllArchivedFileEdiData , getFilesEdiByClient , getSingleEdiFileDetail , seeFileContentEdi , createFileFromColumnAndRowsAndUpdateCore , createFileEdiFromColumnAndRows, updateHistoryOfAnnomalies, updateMetaDataFileInTableCoreEDIFile
from core.logisticFileService import validateAndReplaceLogisticFile, createFileLogisticFromColumnAndRows, saveUploadedLogisticFile, getAllLogisticFileList, getSingleLogisticFileDetail, seeContentLogisticFile, validateLogisticFile, downloadImportedLogisticFile, deleteNotValidateLogisticFile, updateMetaDataFileInTableCoreLogisticFile

schema_view = get_swagger_view(title='TEST API')

logger = logging.getLogger('django')

path_racine_input = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/"
path_racine_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/"

CLIENT_TEST = "REDLEAN_T"

KEY_TEST ="rV53PjKsu6JEJ22m"




@api_view([ 'POST'])
def delete_fileEDI(request):
    print("request",request.data)
    idFile = request.data['idFile']
    fileName = request.data['fileName']
    clientCode = request.data['clientCode']
    validated_orders = request.data['validated_orders']
    wrong_commands = request.data['wrong_commands']
    EDIfile.objects.filter(pk=idFile).delete()
    ftp = connect()
    path_client_input = path_racine_input + '/' + clientCode
    ftp.cwd(path_client_input)
    for name in ftp.nlst():
        if name == fileName:
            ftp.delete(fileName)
    path_client_output = path_racine_output + '/' + clientCode
    ftp.cwd(path_client_output)
    for name in ftp.nlst():
        if name == validated_orders or name == wrong_commands:
            ftp.delete(name)
    return Response({"message": "ok"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def client_detail(request, pk):

    client = getClientInfo(pk)
    client_serializer = ClientSerializer(client)
    return JsonResponse(client_serializer.data)

@api_view(['GET'])
def logistic_file_detail(request, pk):

    logisticFileReponse = getSingleLogisticFileDetail(pk)

    return HttpResponse(jsonpickle.encode(logisticFileReponse, unpicklable=False), content_type="application/json")



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
magistorLogger = logging.getLogger('magistor')

@api_view(['GET'])
def logisticFileList(request):

    listLogisticFiles = getAllLogisticFileList()

    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])
    magistorLogger.info(" GET /logisticFileList by user : {}".format(idUser))

    return HttpResponse(jsonpickle.encode(listLogisticFiles, unpicklable=False), content_type="application/json")



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def fileCreate(request, format=None):
    logger.info('début web service : génération automatique des fichiers EDI !')
    request_file = request.FILES['file']
    response = saveUploadedEdiFile(request_file)
    json_data = JSONRenderer().render(response)
    logger.info('fin web service : génération automatique des fichiers EDI ')
    return HttpResponse(json_data, content_type='application/json')

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def LogisticFileCreate(request, format=None):
    clientName = CLIENT_TEST
    logisticFile = request.FILES['logisticFile']
    key = KEY_TEST
    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])

    logisticFileSaved,msg = saveUploadedLogisticFile(logisticFile)


    if(logisticFileSaved):
        magistorLogger.info("Magistor File imported successfully by {} ".format(idUser))
        return JsonResponse({'message': 'file saved successfully'}, status=status.HTTP_201_CREATED)
    else:
        magistorLogger.warning("Magistor import File echec by {} ".format(idUser))
        return JsonResponse({'message': msg}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def validateLogisticFileWS(request):
    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])

    logisticFilename = request.data['logisticFileName']
    folderLogisticFile = request.data['folderLogisticFile']
    typeLogisticFile = request.data['typeLogisticFile']
    logisticFileValidated = validateLogisticFile(logisticFilename, folderLogisticFile, typeLogisticFile)
    if(logisticFileValidated):
        magistorLogger.info("Magistor : success on validate File {} with id {} by user {} ".format(logisticFilename, folderLogisticFile, idUser))
        return JsonResponse({'message': 'file validated successfully'}, status=status.HTTP_200_OK)
    else:
        magistorLogger.warning("Magistor: ECHEC validate File {} with id {} by user {} ".format(logisticFilename, folderLogisticFile, idUser))
        return JsonResponse({'message': 'file validated echec'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def fileList(request):

    listFiles = getAllFileEdiData()

    print("entred")
    return HttpResponse(jsonpickle.encode(listFiles, unpicklable=False), content_type="application/json")

@api_view(['GET'])
def archivedFileList(request):

    listFiles = getAllArchivedFileEdiData()

    return HttpResponse(jsonpickle.encode(listFiles, unpicklable=False), content_type="application/json")


@api_view(['GET'])
def getFilesByClient(request,pk):


    listFiles = getFilesEdiByClient(pk)

    return HttpResponse(jsonpickle.encode(listFiles, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def downloadFileName(request):
    fileName = request.data['fileName']
    clientCode = request.data['clientCode']
    print(fileName)
    ediFile = EDIfile.objects.get(file=fileName)
    print(ediFile.number_wrong_commands == 0)
    entred1 : bool = False
    entred2:bool = False
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
    

    path_client2 = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/" + clientCode
    ftp.cwd(path_client2)
    for name in ftp.nlst():
        if name == "error_"+fileName and (ediFile.number_wrong_commands != 0):
            with open(name, "wb") as file2:
                commande = "RETR " + name
                ftp.retrbinary(commande, file2.write)
                entred2 = True
            break
    for name in ftp.nlst():
        if name == "correct_"+fileName and (ediFile.number_correct_commands != 0):
            with open(name, "wb") as file1:
                commande = "RETR " + name
                ftp.retrbinary(commande, file1.write)
                entred1 = True
            break
    if entred1:
        df1 = pd.read_excel("correct_"+fileName)
        #df1 = df1.append(pd.read_excel("error_"+fileName), ignore_index=True) 
        df1.to_excel(fileName, index=False)
        file1.close()
        os.remove("correct_"+fileName)

    if entred2:
        df2 = pd.read_excel("error_"+fileName)
        #df1 = df1.append(pd.read_excel("error_"+fileName), ignore_index=True)
        df2.drop('Remarque_id', axis=1, inplace=True) 
        df2.to_excel(fileName, index=False)
        file2.close()
        os.remove("error_"+fileName)

    if entred1 and entred2:
        df3 = df1.append(df2, ignore_index=True) 
        df3.to_excel(fileName, index=False)

    ftp.cwd(path_client + "/FILES_TO_DIAGNOSTIC_DEV")
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

@api_view(['POST'])
def seeLogisticFileContent(request):
    logisticFilename = request.data['logisticFileName']
    folderLogisticFile = request.data['folderLogisticFile']
    logisticSheetName = request.data['logisticSheetName']
    responseObject = seeContentLogisticFile(logisticFilename, folderLogisticFile, logisticSheetName)
    responseObjectText = jsonpickle.encode(responseObject, unpicklable=False)
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
    fileType = request.data['fileType']
    createFileEdiFromColumnAndRows(columns, rows, fileId,fileType)
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)


def reading_list_transactionFileColumnsException(df: pd.DataFrame) -> TransactionFileContentAndOptions:
    fileContentObjects = list()
    options = transactionFileColumnsException(set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set(),set())
    for x in df.values.tolist():
        fileContentObjects.append(transactionFileColumnsException(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8],x[9],x[10],x[11],x[12],x[13],x[14],x[15],x[16],x[17],x[18]))
        options.Tournee.add(x[0])
        options.taskId.add(x[1])
        options.itemId.add(x[2])
        options.Date.add(x[3])
        options.Expediteur.add(x[4])
        options.Activite.add(x[5])
        options.Categorie.add(x[6])
        options.Type_de_Service.add(x[7])
        options.ID_de_la_tache.add(x[8])
        options.Item___Nom.add(x[9])
        options.Item___Type.add(x[10])
        options.Item___Quantite.add(x[11])
        options.Code_postal.add(x[12])
        options.Round_Name.add(x[13])
        options.Express.add(x[14])
        options.Remarque.add(x[15])
        options.isDeleted.add(x[16])
        options.Contact.add(x[17])
        options.billingRoundName.add(x[18])
    return TransactionFileContentAndOptions(fileContent = fileContentObjects , options = options )

def reading_list_transactionFileColumnsLivraison(df: pd.DataFrame) -> TransactionFileContentAndOptions:
    fileContentObjects = list()
    options = transactionFileColumnsLivraison(set(), set(), set(), set(), set(), set(), set(), set(), set(), set(),
                                              set(), set(), set(), set(), set(), set(), set(), set(),set(),set())
    for x in df.values.tolist():
        fileContentObjects.append(
            transactionFileColumnsLivraison(x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], x[8], x[9], x[10], x[11],
                                            x[12], x[13], x[14], x[15], x[16], x[17],x[18],x[19]))
        options.Tournee.add(x[0])
        options.taskId.add(x[1])
        options.itemId.add(x[2])
        options.Date.add(x[3])
        options.Expediteur.add(x[4])
        options.Activite.add(x[5])
        options.Categorie.add(x[6])
        options.Type_de_Service.add(x[7])
        options.ID_de_la_tache.add(x[8])
        options.Item___Nom_sous_categorie.add(x[9])
        options.Item___Type_unite_manutention.add(x[10])
        options.Item___Quantite.add(x[11])
        options.Code_postal.add(x[12])
        options.total_price.add(x[13])
        options.Round_Name.add(x[14])
        options.sourceHubName.add(x[15])
        options.isExpress.add(x[16])
        options.toDelete.add(x[17])
        options.Contact.add(x[18])
        options.billingRoundName.add(x[19])

    return TransactionFileContentAndOptions(fileContent=fileContentObjects, options=options)


def reading_list_transactionFileColumnsMetadata(df: pd.DataFrame) -> TransactionFileContentAndOptions:
    fileContentObjects = list()
    options = transactionFileColumnsMetadata(set(), set(), set(), set(), set(), set(), set(), set(), set(), set(),
                                              set(), set(), set(), set(), set(), set(),set(),set(),set())
    for x in df.values.tolist():
        fileContentObjects.append(
            transactionFileColumnsMetadata(x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], x[8], x[9], x[10], x[11],
                                            x[12], x[13], x[14], x[15],x[16],x[17],x[18]))
        options.Tournee.add(x[0])
        options.taskId.add(x[1])
        options.itemId.add(x[2])
        options.Date.add(x[3])
        options.Expediteur.add(x[4])
        options.Activite.add(x[5])
        options.Categorie.add(x[6])
        options.Type_de_Service.add(x[7])
        options.ID_de_la_tache.add(x[8])
        options.Item___Nom_sous_categorie.add(x[9])
        options.Item___Type_unite_manutention.add(x[10])
        options.Item___Quantite.add(x[11])
        options.Code_postal.add(x[12])
        options.sourceHubName.add(x[13])
        options.Round_Name.add(x[14])
        options.sourceClosureDate.add(x[15])
        options.realInfoHasPrepared.add(x[16])
        options.status.add(x[17])
        options.metadataFACTURATION.add(x[18])

    return TransactionFileContentAndOptions(fileContent=fileContentObjects, options=options)


def reading_list_transactionFileColumnsMad(df: pd.DataFrame) -> TransactionFileContentAndOptions:
    fileContentObjects = list()
    options = transactionFileColumnsMad(set(), set(), set(), set(), set(), set(), set(), set(), set(), set(),
                                              set(), set(), set(), set(), set(), set(), set(),set())
    for x in df.values.tolist():
        fileContentObjects.append(transactionFileColumnsMad(x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], x[8], x[9], x[10], x[11],x[12], x[13], x[14], x[15], x[16],x[17]))
        options.Tournee.add(x[0])
        options.taskId.add(x[1])
        options.itemId.add(x[2])
        options.Date.add(x[3])
        options.Expediteur.add(x[4])
        options.Activite.add(x[5])
        options.Categorie.add(x[6])
        options.Type_de_Service.add(x[7])
        options.ID_de_la_tache.add(x[8])
        options.Item___Nom_sous_categorie.add(x[9])
        options.Item___Type_unite_manutention.add(x[10])
        options.Item___Quantite.add(x[11])
        options.Code_postal.add(x[12])
        options.sourceHubName.add(x[13])
        options.Round_Name.add(x[14])
        options.toDelete.add(x[15])
        options.StartTime.add(x[16])
        options.ClousureTime.add(x[17])

    return TransactionFileContentAndOptions(fileContent=fileContentObjects, options=options)


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
        try:
            sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)
        except Exception as e:
            connect_sftp()
            sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)

        excelfile = pd.read_excel(fileName)
        excelfile = excelfile.fillna('')

        # columns = list(excelfile.columns)
        # rows = excelfile.values.tolist()
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

    if (fileType == "error"):
        updateHistoryOfAnnomalies(prestations= rows, fileId= fileId)
    return JsonResponse({'message': 'done'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def downloadImportedLogisticFileWS(request):
    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])
    logisticFileName = request.data['logisticFileName']
    folderLogisticFile = request.data['folderLogisticFile']
    logisticFile = downloadImportedLogisticFile(logisticFileName,folderLogisticFile)
    response = HttpResponse(logisticFile, content_type="application/xls")
    response['Content-Disposition'] = "attachment; filename={0}".format(logisticFileName)
    response['Content-Length'] = os.path.getsize(logisticFileName)
    os.remove(logisticFileName)
    magistorLogger.info("Magistor : download File {} with id {} by user {} ".format(logisticFileName, folderLogisticFile, idUser))

    return response

@api_view(['POST'])
def deleteNotValidateLogisticFileWS(request):
    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])

    logisticFileName = request.data['logisticFileName']
    idLogisticFile = request.data['idLogisticFile']
    logisticFileDeleted = deleteNotValidateLogisticFile(logisticFileName, idLogisticFile)
    magistorLogger.info("Magistor invalidate File {} with id {} by user {} ".format(logisticFileName, idLogisticFile, idUser))

    if(logisticFileDeleted):
        return JsonResponse({'message': 'file deleted successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'message': 'file not found'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def updateMetaDataFileInTableCoreEDIFileWS(request):
    ediFileName = request.data['ediFileName']
    ediFileStatus =  request.data['ediFileStatus']

    updateMetaDataFileInTableCoreEDIFile(ediFileName=ediFileName, ediFileStatus=ediFileStatus)
    return JsonResponse({'message': 'done'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def updateMetaDataFileInTableCoreLogisticFileWS(request):
    logisticFileId = request.data['logisticFileId']
    logisticFileStatus = request.data['logisticFileStatus']

    updateMetaDataFileInTableCoreLogisticFile(logisticFileId=logisticFileId, logisticFileStatus=logisticFileStatus)
    return JsonResponse({'message': 'done'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def createLogisticFileFromColumnAndRows(request):
    idUser = getIdFromAuthToken(request.META['HTTP_AUTHORIZATION'])

    columns1 = request.data['columns1']
    rows1 = request.data['rows1error']
    columns2 = request.data['columns2']
    rows2 = request.data['rows2error']

    fileId = request.data['fileId']
    createFileLogisticFromColumnAndRows(fileId, columns1, rows1, columns2, rows2)
    magistorLogger.info("Magistor: correct on File with id {} by user {} ".format(fileId, idUser))

    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def createLogisticFileAndValidateFile(request):
    columns1 = request.data['columns1']
    rows1 = request.data['rows1error']
    columns2 = request.data['columns2']
    rows2 = request.data['rows2error']

    fileId = request.data['fileId']
    logisticFilename = createFileLogisticFromColumnAndRows(fileId, columns1, rows1, columns2, rows2)

    logisticFileValidated = validateAndReplaceLogisticFile(logisticFilename, fileId)
    if(logisticFileValidated):
        return JsonResponse({'message': 'file validated successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'message': 'file validated echec'}, status=status.HTTP_200_OK)


def getIdFromAuthToken(token):
    token = token.replace("Bearer ","")
    response = jwt.decode(token,SECRET_KEY,algorithms="HS256")
    return response['id']
