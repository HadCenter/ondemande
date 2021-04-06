from django.http import JsonResponse, HttpRequest
from rest_framework.decorators import api_view
from .serializers import ClientSerializer, FileSerializer,ClientTestSerialize
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Client, FileInfo,Contact
from .serializers import FileSerializer
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

from talendEsb.views import startEngineWithData

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
    files = EDIfile.objects.filter(client=client).update(archived=True)

    archiveDirectoryOfClientFromInto(client,path_racine_input , path_racine_input+"archive")
    archiveDirectoryOfClientFromInto(client,path_racine_output , path_racine_output+"archive")

    client.archived = True
    client.save()

def archiveDirectoryOfClientFromInto(client: Client ,pathFilesAreFromFrom, pathToArchiveTo):
    ftp = connect()
    client_Code = client.code_client

    print(os.getcwd())
    os.chdir("media")
    os.chdir("files")
    os.mkdir(client_Code)
    storetodir = client_Code
    os.chdir(storetodir)


    ftp.cwd(pathFilesAreFromFrom +client_Code)

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
            ftp = connect()
            path_racine = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
            ftp.cwd(path_racine)
            ftp.rename(client.nom_client, client_data['nom_client'])
            path_racine = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"
            ftp.cwd(path_racine)
            ftp.rename(client.nom_client, client_data['nom_client'])
            print("ancien nom " + client.nom_client)
            print("nouveau nom " + client_data['nom_client'])
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
    clients = Client.objects.filter(archived = False).order_by('-id')
    listClients = list()
    for clientDB in clients :
        clientResponse = Contact(idContact=clientDB.id , codeClient=clientDB.code_client , nomClient=clientDB.nom_client, email=clientDB.email ,archived=clientDB.archived)
        listClients.append(clientResponse)
    #serializer = ClientSerializer(clients, many= True)
    return HttpResponse(jsonpickle.encode(listClients,unpicklable=False),content_type="application/json")
class fileCreate(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request, format=None):
        timestr = time.strftime("%Y-%m-%d-%H-%M-%S")
        if(request.data['file'] == ''):
            return Response({ "message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        extension = get_extension(request.data['file'].name)
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            path = "media/files/"
            if (os.path.isdir(path) == True):
                shutil.rmtree('media')
            if (os.path.isdir(path) == False):
                os.mkdir("media")
                os.chdir("media")
                os.mkdir(("files"))
                os.chdir("..")
            serializer.save()
            EDIfile.objects.last().delete()
            path_file = path + os.listdir(path)[0]
            df = pd.read_excel(path_file) # dataFrame of imported file
            os.remove(path_file) # delete imported file
            list_expediteur_unique = df.Expediteur.unique() # list des expediteurs uniques
            resultat_groupBy = df.groupby(['Expediteur']) # groupBy
            df_clients = pd.DataFrame(list(Client.objects.all().values()))
            response = [] # [{},{}] le resultat du web service: une liste des objets (expediteur,numr_ligne) au cas
            # ou le fichier contient des clients qui n'existent pas dans la base ( ne sont pas importés depuis salesforce ).
            ftp = connect()
            for expediteur in list_expediteur_unique:
                dataFrameExpediteur = resultat_groupBy.get_group(expediteur)
                Expediteur = dataFrameExpediteur["Expediteur"].values[0]
                resultat_regex = re.search(r'C[0-9]{3}', Expediteur)
                if resultat_regex: # code_client exist
                    code_client = resultat_regex.group(0)
                    dataFrameExpediteur.insert(0, 'code_client', code_client)
                    df3 = pd.merge(dataFrameExpediteur, df_clients, left_on="code_client", right_on="code_client")
                    if df3.empty == False:
                        name= re.sub(r'C[0-9]{3}-', '', Expediteur)
                        fileName = "EDI_"+ name + "_" + timestr + extension
                        nom_client = name + '.xlsx'
                        dataFrameExpediteur.to_excel(path + nom_client, index=False)
                        filename = [f for f in listdir(path) if isfile(join(path, f))][0]
                        os.rename(r'media/files/{}'.format(filename), r'{}'.format(fileName))

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
                        b = EDIfile(file=fileName, client_id=df3["id"].values[0])
                        b.save()
                    else:
                        response.append({'expediteur':expediteur, 'numr_ligne': dataFrameExpediteur.index.values +2})
                else: # code_client n'existe pas
                    df4 = pd.merge(dataFrameExpediteur, df_clients, left_on="Expediteur", right_on="nom_client")
                    if df4.empty == False:
                        fileName = "EDI_" + Expediteur + "_" + timestr + extension
                        nom_client = Expediteur + '.xlsx'
                        dataFrameExpediteur.to_excel(path + nom_client, index=False)
                        filename = [f for f in listdir(path) if isfile(join(path, f))][0]
                        os.rename(r'media/files/{}'.format(filename), r'{}'.format(fileName))

                        code_client = df4["code_client"].values[0]
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
                        b = EDIfile(file=fileName, client_id=df4["id"].values[0])
                        b.save()
                    else:
                        response.append({'expediteur':expediteur, 'numr_ligne': dataFrameExpediteur.index.values +2})
            json_data = JSONRenderer().render(response)
            return HttpResponse(json_data,content_type='application/json')
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    queryset = Client.objects.all()
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
    startEngineWithData(data)
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)