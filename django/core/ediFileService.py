from django.utils import timezone
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


schema_view = get_swagger_view(title='TEST API')

logger = logging.getLogger('django')

path_racine_input = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/"
path_racine_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/"

def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp

    # le format de reponse : liste des objets
    # [
    #     {
    #      'expediteur': , string
    #      'code_client': string,
    #      'numr_ligne': array of int,
    #      'archive': boolean,
    #      'existe': boolean
    #      }
    # ]
def saveUploadedEdiFile(request_file):
    fs = FileSystemStorage()
    file_name = request_file.name
    timestr = time.strftime("%Y-%m-%d-%H-%M-%S")
    extension = get_extension(file_name)
    path = "media/files/"
    file = fs.save(file_name, request_file)
    path_file = path + file
    df = pd.read_excel(path_file)
    df = df.fillna(value={'Expediteur': ''})
    os.remove(path_file)
    logger.info('upload fichier EDI avec succes !')
    # ************************ on travaille maintenant avec un dataFrame ***********************
    list_expediteur_unique = df.Expediteur.unique()
    resultat_groupBy = df.groupby(['Expediteur'])
    df_clients = pd.DataFrame(list(Client.objects.all().values()))

    response = []
    for expediteur in list_expediteur_unique:
        logger.info('début traitement pour l''expéditeur' + expediteur)
        dataFrameExpediteur = resultat_groupBy.get_group(expediteur)
        Expediteur = dataFrameExpediteur["Expediteur"].values[0]
        resultat_regex = re.search(r'C[0-9]{3}', Expediteur)
        if resultat_regex:  # code_client exist dans le champs expediteur.
            code_client = resultat_regex.group(0)
            dataFrameExpediteur.insert(0, 'code_client', code_client)
            df3 = pd.merge(dataFrameExpediteur, df_clients, left_on="code_client", right_on="code_client")  # jointure
            if df3.empty == False:  # client existe dans la base de données.
                client_archived = df3["archived"].values[0]
                if (client_archived):  # client existe et archivé
                    response.append(
                        {'expediteur': expediteur,
                         'code_client': code_client,
                         'numr_ligne': dataFrameExpediteur.index.values + 2,
                         'archive': True,
                         'existe': True})
                else:  # client existe et non archivé
                    name = re.sub(r'C[0-9]{3}-', '', Expediteur)
                    fileName = "EDI_" + name + "_" + timestr + extension
                    nom_client = name + '.xlsx'
                    # Delete using drop()
                    dataFrameExpediteur.drop(['code_client'], axis=1).to_excel(path + nom_client, index=False)
                    filename = [f for f in listdir(path) if isfile(join(path, f))][0]
                    os.rename(r'media/files/{}'.format(filename), r'{}'.format(fileName))
                    response.append(
                        {
                            'expediteur': expediteur,
                            'code_client': code_client,
                            'numr_ligne': dataFrameExpediteur.index.values + 2,
                            'archive': False,
                            'existe': True
                        })
                    client_id = df3["id"].values[0]
                    # dans le cas ou le client existe et non archivé, on va ajouté le fichier EDI du client dans le serveur FTP
                    uploadFileInFtpServer(fileName, code_client)
                    updateDB(fileName, client_id)
            else:  # client n'existe pas dans la base de données.
                response.append(
                    {
                        'expediteur': expediteur,
                        'code_client': code_client,
                        'numr_ligne': dataFrameExpediteur.index.values + 2,
                        'archive': False,
                        'existe': False
                    })
        else:  # code client n'existe pas dans le champs expediteur.
            df4 = pd.merge(dataFrameExpediteur, df_clients, left_on="Expediteur", right_on="nom_client")  # jointure
            if df4.empty == False:  # client existe dans la base de données.
                client_archived = df4["archived"].values[0]
                if (client_archived):  # client existe et archivé
                    response.append(
                        {
                            'expediteur': expediteur,
                            'code_client': df4["code_client"].values[0],
                            'numr_ligne': dataFrameExpediteur.index.values + 2,
                            'archive': True,
                            'existe': True
                        })
                else:  # client existe et non archivé
                    fileName = "EDI_" + Expediteur + "_" + timestr + extension
                    nom_client = Expediteur + '.xlsx'
                    dataFrameExpediteur.to_excel(path + nom_client, index=False)
                    filename = [f for f in listdir(path) if isfile(join(path, f))][0]
                    os.rename(r'media/files/{}'.format(filename), r'{}'.format(fileName))
                    response.append(
                        {
                            'expediteur': expediteur,
                            'code_client': df4["code_client"].values[0],
                            'numr_ligne': dataFrameExpediteur.index.values + 2,
                            'archive': False,
                            'existe': True
                        })
                    code_client = df4["code_client"].values[0]
                    client_id = df4["id"].values[0]
                    # dans le cas ou le client existe et non archivé, on va ajouté le fichier EDI du client dans le serveur FTP
                    uploadFileInFtpServer(fileName, code_client)
                    updateDB(fileName, client_id)
            else:  # client n'existe pas dans la base de données
                response.append(
                    {
                        'expediteur': expediteur,
                        'code_client': '',
                        'numr_ligne': dataFrameExpediteur.index.values + 2,
                        'archive': False,
                        'existe': False
                    })
        logger.info('fin traitement pour l\'expéditeur ' + expediteur)

    logger.info('fin web service : génération automatique des fichiers EDI ')
    return response

def uploadFileInFtpServer(fileName, code_client):
    ftp = connect()
    path_client_input = path_racine_input + code_client
    path_filesToDiagnostic = path_client_input + "/FILES_TO_DIAGNOSTIC_DEV"
    ftp.cwd(path_racine_output)
    if code_client not in ftp.nlst():
        ftp.mkd(code_client)
    ftp.cwd(path_racine_input)
    if code_client not in ftp.nlst():
        ftp.mkd(code_client)
    ftp.cwd(path_client_input)
    if "FILES_TO_DIAGNOSTIC_DEV" not in ftp.nlst():
        ftp.mkd("FILES_TO_DIAGNOSTIC_DEV")
    ftp.cwd(path_filesToDiagnostic)
    file = open(fileName, 'rb')
    ftp.storbinary('STOR ' + os.path.basename(fileName), file)
    file.close()
    os.remove(fileName)


def updateDB(fileName, client_id):
    ediFileObject = EDIfile(file=fileName, client_id=client_id)
    ediFileObject.save()

def get_extension(filename):
    basename = os.path.basename(filename)  # os independent
    ext = '.'.join(basename.split('.')[1:])
    return '.' + ext if ext else None


def getAllFileEdiData():
    files = EDIfile.objects.select_related('client').filter(archived=False).order_by('-created_at')
    listFiles = list()
    for fileDB in files:
        clientDB = fileDB.client
        clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                                 email=clientDB.email, archived=clientDB.archived)
        fileReponse = FileInfo(idFile=fileDB.id, fileName=fileDB.file.name, createdAt=fileDB.created_at,
                               status=fileDB.status, wrongCommands=fileDB.wrong_commands,
                               validatedOrders=fileDB.validated_orders, archived=fileDB.archived,
                               cliqued=fileDB.cliqued, contact=clientResponse,
                               number_correct_commands=fileDB.number_correct_commands,
                               number_wrong_commands=fileDB.number_wrong_commands, sendedToUrbantz=fileDB.sendedToUrbantz)
        listFiles.append(fileReponse)
    return listFiles

def getAllArchivedFileEdiData():
    files = EDIfile.objects.select_related('client').filter(archived=True).order_by('-created_at')
    listFiles = list()
    for fileDB in files:
        clientDB = fileDB.client
        clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                                 email=clientDB.email, archived=clientDB.archived)
        fileReponse = FileInfo(idFile=fileDB.id, fileName=fileDB.file.name, createdAt=fileDB.created_at,
                               status=fileDB.status, wrongCommands=fileDB.wrong_commands,
                               validatedOrders=fileDB.validated_orders, archived=fileDB.archived,
                               cliqued=fileDB.cliqued, contact=clientResponse,
                               number_correct_commands=fileDB.number_correct_commands,
                               number_wrong_commands=fileDB.number_wrong_commands, sendedToUrbantz=fileDB.sendedToUrbantz)
        listFiles.append(fileReponse)
    return listFiles

def getFilesEdiByClient(clientCode):
    files = EDIfile.objects.select_related('client').filter(archived=False).filter(client__code_client=clientCode).order_by(
        '-created_at')
    listFiles = list()
    for fileDB in files:
        clientDB = fileDB.client
        clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                                 email=clientDB.email, archived=clientDB.archived)
        fileReponse = FileInfo(idFile=fileDB.id, fileName=fileDB.file.name, createdAt=fileDB.created_at,
                               status=fileDB.status, wrongCommands=fileDB.wrong_commands,
                               validatedOrders=fileDB.validated_orders, archived=fileDB.archived,
                               cliqued=fileDB.cliqued, contact=clientResponse,
                               number_correct_commands=fileDB.number_correct_commands,
                               number_wrong_commands=fileDB.number_wrong_commands, sendedToUrbantz=fileDB.sendedToUrbantz)
        listFiles.append(fileReponse)
    return listFiles

def getSingleEdiFileDetail(key):
    fileDB = EDIfile.objects.select_related('client').get(pk=key)
    clientDB = fileDB.client
    clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                             email=clientDB.email, archived=clientDB.archived)
    fileReponse = FileInfo(idFile=fileDB.id, fileName=fileDB.file.name, createdAt=fileDB.created_at,
                           status=fileDB.status, wrongCommands=fileDB.wrong_commands,
                           validatedOrders=fileDB.validated_orders, archived=fileDB.archived, cliqued=fileDB.cliqued,
                           contact=clientResponse, number_wrong_commands=fileDB.number_wrong_commands,
                           number_correct_commands=fileDB.number_correct_commands,
                           sendedToUrbantz=fileDB.sendedToUrbantz)
    return fileReponse

def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp


def seeFileContentEdi(fileName,clientCode):
    ftp = connect()
    path_racine = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"
    path_client = path_racine + '/' + clientCode
    ftp.cwd(path_client)
    for name in ftp.nlst():
        if name == fileName:
            with open(name, "wb") as file:
                commande = "RETR " + name
                ftp.retrbinary(commande, file.write)
            break
    excelfile = pd.read_excel(fileName)
    excelfile = excelfile.fillna('')
    columns = list(excelfile.columns)

    if "Remarque_id" in columns:
        annuaireAnomalies = pd.DataFrame(list(AnomaliesEdiFileAnnuaire.objects.all().values()))
        annuaireAnomaliesColumnName = annuaireAnomalies.rename(
            columns={"id_anomalie": "Remarque_id", "label": "Remarque"})
        excelfile = pd.merge(excelfile, annuaireAnomaliesColumnName, on="Remarque_id")
        columns = list(excelfile.columns)
        columns.remove("selected")
        columns.insert(0, "selected")
        columns.remove("Remarque")
        columns.insert(0, "Remarque")
        excelfile = excelfile.reindex(columns=columns)

    excelfile.insert(loc=len(excelfile.columns), column='rowId', value=np.arange(len(excelfile)))
    columns = list(excelfile.columns)
    rows = excelfile.values.tolist()
    os.remove(fileName)
    responseObject = FileExcelContent(columns, rows)
    return responseObject


def createFileFromColumnAndRowsAndUpdateCore(columns, rows, fileId):
    fileDB = EDIfile.objects.select_related('client').get(pk=fileId)
    clientDB = fileDB.client
    fileName = fileDB.file.name
    fileDB.status = "En attente"
    fileDB.save()
    createFileEdiFromColumnAndRows(columns, rows, fileId , "edi")
    data = [{"filePath": fileName, "ClientOwner": clientDB.code_client, "fileId": fileDB.id}]
    #startEngineOnEdiFilesWithData(data)
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)

def createFileEdiFromColumnAndRows(columns, rows, fileId , fileType):
    fileDB = EDIfile.objects.select_related('client').get(pk=fileId)

    clientDB = fileDB.client
    df = pd.DataFrame(rows, columns=columns)
    fileName : str
    if fileType == "correct" :
        fileName = fileDB.validated_orders
        path = path_racine_output + clientDB.code_client
        fileDB.number_correct_commands = len(rows)
        fileDB.save()
        # if fileDB.wrong_commands != "_":
        #     #response = seeFileContentEdi(fileDB.wrong_commands,clientDB.code_client)
        #     ftp = connect()
        #     ftp.cwd(path)
        #     for name in ftp.nlst():
        #         if name == fileDB.wrong_commands:
        #             with open(name, "wb") as file:
        #                 commande = "RETR " + name
        #                 ftp.retrbinary(commande, file.write)
        #             break

        #     df1 = pd.DataFrame(rows, columns=columns)
        #     df1 = df1.append(pd.read_excel(fileDB.wrong_commands), ignore_index=True)
        #     df1.to_excel(fileDB.file.name, index=False)
        #     ftp.cwd(path_racine_input + clientDB.code_client)
        #     file = open(fileDB.file.name, 'rb')
        #     print(os.path.basename(fileDB.file.name))
        #     ftp.storbinary('STOR ' + os.path.basename(fileDB.file.name), file)
        #     file.close()
        #     ftp.close()
        #     os.remove(fileDB.file.name)


    elif fileType == "error" :
        fileName = fileDB.wrong_commands
        path = path_racine_output + clientDB.code_client
        fileDB.number_wrong_commands = len(rows)
        fileDB.save()
        # if fileDB.validated_orders != "_":
        #     #response = seeFileContentEdi(fileDB.wrong_commands,clientDB.code_client)
        #     ftp1 = connect()
        #     ftp1.cwd(path)
        #     for name in ftp1.nlst():
        #         if name == fileDB.validated_orders:
        #             with open(name, "wb") as file:
        #                 commande = "RETR " + name
        #                 ftp1.retrbinary(commande, file.write)
        #             break

        #     df1 = pd.DataFrame(rows, columns=columns)
        #     df1 = df1.append(pd.read_excel(fileDB.validated_orders), ignore_index=True) 
        #     df1.to_excel(fileDB.file.name, index=False)
        #     ftp1.cwd(path_racine_input + clientDB.code_client)
        #     file = open(fileDB.file.name, 'rb')
        #     print(os.path.basename(fileDB.file.name))
        #     ftp1.storbinary('STOR ' + os.path.basename(fileDB.file.name), file)
        #     file.close()
        #     ftp1.close()
        #     os.remove(fileDB.file.name)

    else :
        fileName = fileDB.file.name
        path = path_racine_input + clientDB.code_client + "/FILES_TO_DIAGNOSTIC_DEV"

    df.to_excel(fileName, index=False)
    ftp = connect()
    ftp.cwd(path)
    file = open(fileName, 'rb')
    print(os.path.basename(fileName))
    ftp.storbinary('STOR ' + os.path.basename(fileName), file)
    file.close()
    os.remove(fileName)

def updateHistoryOfAnnomalies(prestations, fileId):
    listOfAllRemarqueId =[]
    for prestation in prestations:
        listOfAllRemarqueId.append(prestation[28])
    for remarqueId in list(set(listOfAllRemarqueId)):
        remarqueIdOccurance = listOfAllRemarqueId.count(remarqueId)
        HistoryAnomaliesEdiFiles.objects.filter(edi_file_id=fileId,anomalie_id=remarqueId).update(number_of_anomalies=remarqueIdOccurance, execution_time=timezone.now())
    listOfAllHistoryOfAnnomalies = HistoryAnomaliesEdiFiles.objects.filter(edi_file_id=fileId)
    for historyAnnomalie in listOfAllHistoryOfAnnomalies:
        if historyAnnomalie.anomalie_id not in list(set(listOfAllRemarqueId)):
            HistoryAnomaliesEdiFiles.objects.filter(edi_file_id=fileId, anomalie_id=historyAnnomalie.anomalie_id).delete()

def updateMetaDataFileInTableCoreEDIFile(ediFileName, ediFileStatus):
    ediFile = EDIfile.objects.get(file=ediFileName)
    ediFile.status = ediFileStatus
    ediFile.save()

