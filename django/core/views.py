from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from .serializers import ClientSerializer,ClientTestSerialize
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Client, FileInfo,Contact
from .serializers import FileSerializer
from .models import Client ,AnomaliesEdiFileAnnuaire , HistoryAnomaliesEdiFiles
from .models import FileInfo,Contact,kpi3SchemaSingleAnomalie ,getNumberOfAnomaliesPerDateDTO
from .models import Client
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
import shutil
from .models import EDIfile
import ftplib
import time
import os
from os import listdir
from os.path import isfile, join
from django.core import mail
import pandas as pd
import re
from .models import FileExcelContent
import jsonpickle
from talendEsb.views import startEngineOnEdiFilesWithData
from sftpConnectionToExecutionServer.views import  sftp

from talendEsb.models import TransactionsLivraison

import logging,traceback
from typing import Optional
from rest_framework_swagger.views import get_swagger_view
from rest_framework.renderers import CoreJSONRenderer
import numpy as np
schema_view = get_swagger_view(title='TEST API')

logger = logging.getLogger('django')

path_racine_input = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/"
path_racine_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/"

@api_view(['GET'])
def testCreate(request):
    print("ahmed")
    email = 'ahmed.belaiba@redlean.io'
    email_subject = 'Création de mot de passe'
    email_body = 'Test body'
    # email = EmailMessage(
    #     email_subject,
    #     email_body,
    #     'ahmedbelaiba19952018@gmail.com',
    #     [email],
    # )
    # email.send(fail_silently=False)
    with mail.get_connection() as connection:
        mail.EmailMessage(
            email_subject,
            email_body,
            'ahmedbelaiba19952018@gmail.com',
            [email],
            connection=connection,
        ).send()
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)
def archive_client(client: Client):
    client.archived = True
    client.save()

    files = EDIfile.objects.filter(client=client).update(archived=True)

    archiveDirectoryOfClientFromInto(client,path_racine_input , path_racine_input+"archive")
    archiveDirectoryOfClientFromInto(client,path_racine_output , path_racine_output+"archive")
def archiveDirectoryOfClientFromInto(client: Client ,pathFilesAreFromFrom, pathToArchiveTo):
    ftp = connect()
    client_Code = client.code_client
    osDefaultPath = os.getcwd()
    try:

        ftp.cwd(pathFilesAreFromFrom + client_Code)
        os.chdir("media")
        os.chdir("files")
        os.mkdir(client_Code)
        storetodir = client_Code
        os.chdir(storetodir)




        for fileName in ftp.nlst():
            with open(fileName, "wb") as file:
                commande = "RETR " + fileName
                ftp.retrbinary(commande, file.write)
                ftp.delete(fileName)
        os.chdir("..")
        shutil.make_archive(client_Code, 'zip', client_Code)
        ftp.cwd(pathToArchiveTo)
        name = client_Code + '.zip'
        file = open(name, 'rb')
        ftp.storbinary('STOR ' + name, file)
        file.close()
        ftp.cwd(pathFilesAreFromFrom)
        ftp.rmd(client_Code)
        shutil.rmtree(client_Code)
        os.remove(name)
        os.chdir("..")
        os.chdir("..")
    except:
        print('WARNING path : ' + pathFilesAreFromFrom + client_Code + ' is not existant while archiving')
        os.chdir(osDefaultPath)
@api_view(['GET', 'PUT'])
def client_detail(request, pk):
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return JsonResponse({'message': 'le client n''existe pas !'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        client_serializer = ClientSerializer(client)
        return JsonResponse(client_serializer.data)
    elif request.method == 'PUT':
        client_data = JSONParser().parse(request)
        client_serializer = ClientSerializer(client, data=client_data)
        if client_serializer.is_valid():
            client_serializer.save()
            return JsonResponse(client_serializer.data)
        return JsonResponse(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def file_detail(request, pk):
    fileDB = EDIfile.objects.select_related('client').get(pk=pk)
    clientDB = fileDB.client
    clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                             email=clientDB.email, archived=clientDB.archived)
    fileReponse = FileInfo(idFile=fileDB.id, fileName=fileDB.file.name, createdAt=fileDB.created_at,
                           status=fileDB.status, wrongCommands=fileDB.wrong_commands,
                           validatedOrders=fileDB.validated_orders, archived=fileDB.archived, cliqued=fileDB.cliqued,
                           contact=clientResponse , number_wrong_commands=fileDB.number_wrong_commands , number_correct_commands= fileDB.number_correct_commands)

    return HttpResponse(jsonpickle.encode(fileReponse,unpicklable=False),content_type="application/json")
@api_view(['POST'])
def clientCreate(request):
    name = request.data['nom_client']
    serializer = ClientSerializer(data = request.data)
    if serializer.is_valid():
        ftp = connect()
        path_racine = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
        ftp.cwd(path_racine)
        if name not in ftp.nlst():
            ftp.mkd(name)
        path_output = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"
        ftp.cwd(path_output)
        if name not in ftp.nlst():
            ftp.mkd(name)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def clientList(request):
    clients = Client.objects.all().order_by('-id')
    listClients = list()
    for clientDB in clients :
        clientResponse = Contact(idContact=clientDB.id , codeClient=clientDB.code_client , nomClient=clientDB.nom_client, email=clientDB.email ,archived=clientDB.archived)
        listClients.append(clientResponse)
    #serializer = ClientSerializer(clients, many= True)
    return HttpResponse(jsonpickle.encode(listClients,unpicklable=False),content_type="application/json")


def uploadFileInFtpServer(fileName, code_client):
    ftp = connect()
    path_client_input = path_racine_input + code_client
    ftp.cwd(path_racine_output)
    if code_client not in ftp.nlst():
        ftp.mkd(code_client)
    ftp.cwd(path_racine_input)
    if code_client not in ftp.nlst():
        ftp.mkd(code_client)
    ftp.cwd(path_client_input)
    file = open(fileName, 'rb')
    ftp.storbinary('STOR ' + os.path.basename(fileName), file)
    file.close()
    os.remove(fileName)


def updateDB(fileName, client_id):
    ediFileObject = EDIfile(file=fileName, client_id=client_id)
    ediFileObject.save()


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def fileCreate(request,format=None):
    logger.info('début web service : génération automatique des fichiers EDI !')
    request_file = request.FILES['file']
    fs = FileSystemStorage()
    file_name = request_file.name
    timestr = time.strftime("%Y-%m-%d-%H-%M-%S")
    extension = get_extension(file_name)
    path = "media/files/"
    file = fs.save(file_name, request_file)
    path_file = path + os.listdir(path)[0]
    df = pd.read_excel(path_file)
    df = df.fillna(value={'Expediteur': ''})
    os.remove(path_file)
    logger.info('upload fichier EDI avec succes !')
    #************************ on travaille maintenant avec un dataFrame ***********************
    list_expediteur_unique = df.Expediteur.unique()
    resultat_groupBy = df.groupby(['Expediteur'])
    df_clients = pd.DataFrame(list(Client.objects.all().values()))
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
    response = []
    for expediteur in list_expediteur_unique:
        logger.info('début traitement pour l''expéditeur'+ expediteur)
        dataFrameExpediteur = resultat_groupBy.get_group(expediteur)
        Expediteur = dataFrameExpediteur["Expediteur"].values[0]
        resultat_regex = re.search(r'C[0-9]{3}', Expediteur)
        if resultat_regex:  # code_client exist dans le champs expediteur.
            code_client = resultat_regex.group(0)
            dataFrameExpediteur.insert(0, 'code_client', code_client)
            df3 = pd.merge(dataFrameExpediteur, df_clients, left_on="code_client", right_on="code_client") # jointure
            if df3.empty == False: # client existe dans la base de données.
                client_archived = df3["archived"].values[0]
                if (client_archived): # client existe et archivé
                    response.append(
                        {'expediteur': expediteur,
                         'code_client' : code_client,
                         'numr_ligne': dataFrameExpediteur.index.values + 2,
                         'archive': True,
                         'existe': True})
                else: # client existe et non archivé
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
                            'code_client': code_client ,
                            'numr_ligne': dataFrameExpediteur.index.values + 2,
                            'archive': False,
                            'existe': True
                        })
                    client_id = df3["id"].values[0]
                    # dans le cas ou le client existe et non archivé, on va ajouté le fichier EDI du client dans le serveur FTP
                    uploadFileInFtpServer(fileName,code_client)
                    updateDB(fileName,client_id)
            else: # client n'existe pas dans la base de données.
                response.append(
                    {
                        'expediteur': expediteur,
                        'code_client': code_client,
                        'numr_ligne': dataFrameExpediteur.index.values + 2,
                        'archive': False,
                        'existe': False
                    })
        else: # code client n'existe pas dans le champs expediteur.
            df4 = pd.merge(dataFrameExpediteur, df_clients, left_on="Expediteur", right_on="nom_client") #jointure
            if df4.empty == False: # client existe dans la base de données.
                client_archived = df4["archived"].values[0]
                if (client_archived): # client existe et archivé
                    response.append(
                        {
                            'expediteur': expediteur,
                            'code_client': df4["code_client"].values[0],
                            'numr_ligne': dataFrameExpediteur.index.values + 2,
                            'archive': True,
                            'existe': True
                        })
                else: # client existe et non archivé
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
                    uploadFileInFtpServer(fileName,code_client)
                    updateDB(fileName,client_id)
            else: # client n'existe pas dans la base de données
                response.append(
                    {
                        'expediteur': expediteur,
                        'code_client': '',
                        'numr_ligne': dataFrameExpediteur.index.values + 2,
                        'archive': False,
                        'existe': False
                    })
        logger.info('fin traitement pour l\'expéditeur ' + expediteur)
    json_data = JSONRenderer().render(response)
    logger.info('fin web service : génération automatique des fichiers EDI ')
    return HttpResponse(json_data, content_type='application/json')

@api_view(['GET'])
def fileList(request):
    files = EDIfile.objects.select_related('client').filter(archived = False).order_by('-id')
    listFiles = list()
    for fileDB  in files :
        clientDB = fileDB.client
        clientResponse = Contact(idContact=clientDB.id , codeClient=clientDB.code_client , nomClient=clientDB.nom_client, email=clientDB.email ,archived=clientDB.archived)
        fileReponse = FileInfo(idFile= fileDB.id,fileName=fileDB.file.name,createdAt=fileDB.created_at,status=fileDB.status ,wrongCommands=fileDB.wrong_commands,validatedOrders=fileDB.validated_orders,archived=fileDB.archived,cliqued=fileDB.cliqued,contact=clientResponse , number_correct_commands= fileDB.number_correct_commands , number_wrong_commands= fileDB.number_wrong_commands )
        listFiles.append(fileReponse)
  #  serializer = FileSerializer(files, many= True)
 #   return Response(serializer.data)

    return HttpResponse( jsonpickle.encode(listFiles,unpicklable=False),content_type="application/json")
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
        ftp = connect()
        path_racine = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"
        path_client = path_racine + '/' + request.data['clientCode']
        ftp.cwd(path_client)
        for name in ftp.nlst():
            if name == request.data['fileName']:
                with open(name, "wb") as file:
                    commande = "RETR " + name
                    ftp.retrbinary(commande, file.write)
                break
        excelfile = pd.read_excel(request.data['fileName'])
        excelfile = excelfile.fillna('')
        columns = list(excelfile.columns)

        if "Remarque_id" in columns :
            annuaireAnomalies = pd.DataFrame(list(AnomaliesEdiFileAnnuaire.objects.all().values()))
            annuaireAnomaliesColumnName = annuaireAnomalies.rename(columns={"id_anomalie": "Remarque_id" , "label" : "Remarque"})
            excelfile = pd.merge(excelfile, annuaireAnomaliesColumnName, on="Remarque_id" )

        excelfile.insert(loc =len(excelfile.columns) , column='rowId', value=np.arange(len(excelfile)))
        columns = list(excelfile.columns)
        rows = excelfile.values.tolist()
        os.remove(name)
        responseObject = FileExcelContent(columns,rows)
        responseObjectText = jsonpickle.encode(responseObject,unpicklable=False)
        print (responseObjectText)
        return HttpResponse(responseObjectText, content_type="application/json")
@api_view(['POST'])
def downloadFileoutputName(request):
    fileName = request.data['fileName']
    clientCode = request.data['clientCode']
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
    with open(fileName, 'rb') as f:
        file = f.read()
    response = HttpResponse(file, content_type="application/xls")
    response['Content-Disposition'] = "attachment; filename={0}".format(fileName)
    response['Content-Length'] = os.path.getsize(fileName)
    os.remove(fileName)
    return response
@api_view(['GET'])
def numberOfFilesPerClient(request):
    queryset = Client.objects.filter(archived = False)
    serializer_class = ClientTestSerialize(queryset,many=True)
    json_data = JSONRenderer().render(serializer_class.data)
    return HttpResponse(json_data,content_type='application/json')
def connect():
    FTP_HOST = "talend.ecolotrans.net"
    FTP_USER = "talend"
    FTP_PASS = "Rand069845"
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    ftp.encoding = "utf-8"
    return ftp
def get_extension(filename):
    basename = os.path.basename(filename)  # os independent
    ext = '.'.join(basename.split('.')[1:])
    return '.' + ext if ext else None
@api_view(['POST'])
def createFileFromColumnAndRowsAndUpdate(request):
    columns = request.data['columns']
    rows = request.data['rows']
    fileId = request.data['fileId']
    fileDB = EDIfile.objects.select_related('client').get(pk = fileId)
    clientDB = fileDB.client
    df = pd.DataFrame(rows, columns = columns)
    fileName = fileDB.file.name
    df.to_excel(fileName , index= False)
    ftp = connect()
    ftp.cwd(path_racine_input + clientDB.code_client)
    file = open(fileName, 'rb')
    print(os.path.basename(fileName))
    ftp.storbinary('STOR ' + os.path.basename(fileName), file)
    file.close()
    os.remove(fileName)
    fileDB.validated_orders = "_"
    fileDB.wrong_commands = "_"
    fileDB.status = "En attente"
    fileDB.number_correct_commands = 0
    fileDB.number_wrong_commands = 0
    fileDB.save()
    data = [{"filePath":fileName,"ClientOwner":clientDB.code_client,"fileId":fileDB.id}]
    startEngineOnEdiFilesWithData(data)
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)
def desarchive_client(client: Client):
    client.archived = False
    client.save()

    files = EDIfile.objects.filter(client=client).update(archived=False)

    desarchiveDirectoryOfClientFromInto(client,path_racine_input , path_racine_input+"archive")
    desarchiveDirectoryOfClientFromInto(client,path_racine_output , path_racine_output+"archive")
def desarchiveDirectoryOfClientFromInto(client: Client ,pathFilesAreFromFrom, pathToArchiveTo):
    ftp = connect()
    client_Code = client.code_client
    osDefaultPath = os.getcwd()
    try:

        os.chdir("media")
        os.chdir("files")
        if client_Code not in os.listdir() :
            os.mkdir(client_Code)
        os.chdir(client_Code)

        ftp.cwd(pathToArchiveTo)
        fileNameZiped = client_Code+".zip"
        if fileNameZiped in ftp.nlst():
            file = open(fileNameZiped, "wb")
            commande = "RETR " + fileNameZiped
            ftp.retrbinary(commande, file.write)
            file.close()
            ftp.delete(fileNameZiped)



        shutil.unpack_archive(fileNameZiped)
        os.remove(fileNameZiped)

        ftp.cwd(pathFilesAreFromFrom)
        if client_Code not in ftp.nlst():
            ftp.mkd(client_Code)
        ftp.cwd(client_Code)

        for fileNameInOs in os.listdir() :
            file = open(fileNameInOs, 'rb')
            ftp.storbinary('STOR ' + os.path.basename(fileNameInOs), file)
            file.close()
            os.remove(fileNameInOs)

        os.chdir("..")
        os.rmdir(client_Code)


        os.chdir("..")
        os.chdir("..")
    except:
        print('WARNING path : ' + pathToArchiveTo + '/' + client_Code + '.zip is not existant while desarchiving')
        os.chdir(osDefaultPath)


@api_view(['GET'])
def kpi3(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    listAnomaliesToReturn = []
    for anomaly in historyanomalies :
        listAnomaliesToReturn.append(kpi3SchemaSingleAnomalie(anomalie_id=anomaly.id,number_of_anomalies= anomaly.number_of_anomalies,execution_time = anomaly.execution_time,edi_file_id =anomaly.edi_file.id ,client_id = anomaly.edi_file.client.id,client_name = anomaly.edi_file.client.nom_client,client_code = anomaly.edi_file.client.code_client , edi_file_name= anomaly.edi_file.file.name, anomalie_name=anomaly.anomalie.label))
    return HttpResponse(jsonpickle.encode(listAnomaliesToReturn,unpicklable=False),content_type='applicaiton/json')

@api_view(['POST'])
def seeFileContentMADFile(request):
    osOriginalPath = os.getcwd()
    fileType = request.data['fileType']
    transaction_id = request.data['transaction_id']
    try :
        os.chdir("media/files/UrbantzToHub/")
        transaction = TransactionsLivraison.objects.get(id=transaction_id)
        remotefilePath = ""
        fileName = ""
        if fileType == "livraison" :
            remotefilePath=  transaction.fichier_livraison_sftp
            fileName = "Livraisons.xlsx"
        elif fileType == "exception" :
            remotefilePath = transaction.fichier_exception_sftp
            fileName = "Livraisons_Exception.xlsx"
        elif fileType == "metadata" :
            remotefilePath = transaction.fichier_metadata_sftp
            fileName = "ExceptionFacturationValue_Livraisons.xlsx"
        elif fileType == "mad" :
            remotefilePath = transaction.fichier_mad_sftp
            fileName = "ToVerifyQTE_MAD_Livraisons.xlsx"
        else :
            raise Exception("fileType not supported by server")
        sftp.get(remotepath= remotefilePath,localpath= os.getcwd() + '/'+ fileName)

        excelfile =pd.read_excel(fileName)
        excelfile = excelfile.fillna('')
        columns = list(excelfile.columns)
        rows = excelfile.values.tolist()
        os.remove(fileName)
        responseObject = FileExcelContent(columns, rows)
        responseObjectText = jsonpickle.encode(responseObject, unpicklable=False)

        os.chdir(osOriginalPath)
        return HttpResponse(responseObjectText, content_type="application/json")
    except Exception as e :
        os.chdir(osOriginalPath)
        print(e)
        return JsonResponse({'message': 'internal error'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def getNumberOfAnomaliesPerDate(request):
    dateToFilter = request.data['date']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(execution_time = dateToFilter).prefetch_related("anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal+= anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(dateToFilter,numberOfAnomaliestotal),unpicklable=False),content_type='applicaiton/json')

@api_view(['GET'])
def getNumberOfAnomaliesPerDateAll(request):

    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S") not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] = 0

        mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies,unpicklable=False),content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfAnomaliesPerId(request):
    anomalie_id = request.data['anomalie_id']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(anomalie = anomalie_id).prefetch_related("anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal+= anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(anomalie_id,numberOfAnomaliestotal),unpicklable=False),content_type='applicaiton/json')

@api_view(['GET'])
def getNumberOfAnomaliesPerIdAll(request):

    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.anomalie_id not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.anomalie_id] = 0

        mapDateToNumberOfAnomalies[anomaly.anomalie_id] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies,unpicklable=False),content_type='applicaiton/json')
