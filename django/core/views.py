from django.http import JsonResponse
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
from .models import FileExcelContent
import jsonpickle

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
@api_view([ 'PUT'])
def archive_client(request, pk):
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return JsonResponse({'message': 'le client n''existe pas !'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        client_data = JSONParser().parse(request)
        files = EDIfile.objects.filter(client = client_data['id']).update(archived = True)
        ftp = connect()
        client_name = client_data['nom_client']
        os.mkdir(client_name)
        storetodir = client_name
        os.chdir(storetodir)

        path = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
        path_archive = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/archive"
        path_client = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput" + "/" + client_name
        ftp.cwd(path_client)

        for fileName in ftp.nlst():
            with open(fileName, "wb") as file:
                commande = "RETR " + fileName
                ftp.retrbinary(commande, file.write)
                ftp.delete(fileName)
        os.chdir("..")
        shutil.make_archive(client_name, 'zip', client_name)
        ftp.cwd(path_archive)
        name = client_name + '.zip'
        file = open(name, 'rb')
        ftp.storbinary('STOR ' + name, file)
        file.close()
        ftp.cwd(path)
        ftp.rmd(client_name)
        shutil.rmtree(client_name)
        os.remove(name)

        os.mkdir(client_name)
        storetodir = client_name
        os.chdir(storetodir)

        path = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput"
        path_archive = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput/archive"
        path_client = "/Preprod/IN/POC_ON_DEMAND/OUTPUT/TalendOutput" + "/" + client_name
        ftp.cwd(path_client)

        for fileName in ftp.nlst():
            with open(fileName, "wb") as file:
                commande = "RETR " + fileName
                ftp.retrbinary(commande, file.write)
                ftp.delete(fileName)
        os.chdir("..")
        shutil.make_archive(client_name, 'zip', client_name)
        ftp.cwd(path_archive)
        name = client_name + '.zip'
        file = open(name, 'rb')
        ftp.storbinary('STOR ' + name, file)
        file.close()
        ftp.cwd(path)
        ftp.rmd(client_name)
        shutil.rmtree(client_name)
        os.remove(name)
        # ftp = connect()
        # path = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
        # client_name = client_data['nom_client']
        # path_archive = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/archive"
        # ftp.cwd(path_archive)
        # ftp.mkd(client_name)
        # path_client = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput" +"/"+ client_name
        # ftp.cwd(path_client)
        # for file in ftp.nlst():
        #     ftp.rename(path_client +"/"+ file, path_archive +"/"+ client_name+"/"+ file)
        #     ftp.cwd(path_client)
        # ftp.cwd(path)
        # if client_name in ftp.nlst():
        #     ftp.rmd(client_name)
        client_data['archived'] = True;
        client_serializer = ClientSerializer(client, data=client_data)
        if client_serializer.is_valid():
            client_serializer.save()
            return JsonResponse(client_serializer.data)
        return JsonResponse(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
                           contact=clientResponse)

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
        # code_client = request.data['client']
        timestr = time.strftime("%Y-%m-%d-%H-%M-%S")
        if(request.data['file'] == ''):
            return Response({ "message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        ext = get_extension(request.data['file'].name)
        clientCode = Client.objects.get(pk=request.data['client']).code_client
        clientName = Client.objects.get(pk=request.data['client']).nom_client

        # clientName = Contact.objects.get(code_client=code_client).last_name
        fileName = "EDI_"+ clientName + "_" + timestr + ext
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
            ftp = connect()
            path_racine = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
            path_client = path_racine + '/' + clientCode
            if clientCode not in ftp.nlst():
                ftp.mkd(clientCode)
            ftp.cwd(path_client)
            filename = [f for f in listdir(path) if isfile(join(path, f))][0]
            os.rename(r'media/files/{}'.format(filename), r'{}'.format(fileName))
            file = open(fileName, 'rb')
            print(os.path.basename(fileName))
            ftp.storbinary('STOR ' + os.path.basename(fileName), file)
            file.close()
            os.remove(fileName)
            ediFile = EDIfile.objects.last()
            ediFile.file = fileName
            ediFile.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def fileList(request):
    files = EDIfile.objects.select_related('client').filter(archived = False).order_by('-id')
    listFiles = list()
    for fileDB  in files :
        clientDB = fileDB.client
        clientResponse = Contact(idContact=clientDB.id , codeClient=clientDB.code_client , nomClient=clientDB.nom_client, email=clientDB.email ,archived=clientDB.archived)
        fileReponse = FileInfo(idFile= fileDB.id,fileName=fileDB.file.name,createdAt=fileDB.created_at,status=fileDB.status ,wrongCommands=fileDB.wrong_commands,validatedOrders=fileDB.validated_orders,archived=fileDB.archived,cliqued=fileDB.cliqued,contact=clientResponse)
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
    result = []
    for client in serializer_class.data:
        data= {}
        data['label'] = client['nom_client']
        data['value'] = len(client['files'])
        result.append(data)
    json_data = JSONRenderer().render(result)
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



