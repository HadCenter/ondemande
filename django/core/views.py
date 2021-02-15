from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import ClientSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Client
from .serializers import FileSerializer
from rest_framework.parsers import JSONParser

from .models import EDIfile
import ftplib
import time
import os
from os import listdir
from os.path import isfile, join
# Create your views here.
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
        path = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
        client_name = client_data['nom_client']
        path_archive = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput/archive"
        ftp.cwd(path_archive)
        ftp.mkd(client_name)
        path_client = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput" +"/"+ client_name
        ftp.cwd(path_client)
        for file in ftp.nlst():
            ftp.rename(path_client +"/"+ file, path_archive +"/"+ client_name+"/"+ file)
            ftp.cwd(path_client)
        ftp.cwd(path)
        if client_name in ftp.nlst():
            ftp.rmd(client_name)
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
            print("ancien nom " + client.nom_client)
            print("nouveau nom " + client_data['nom_client'])
            client_serializer.save()
            return JsonResponse(client_serializer.data)
        return JsonResponse(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    serializer = ClientSerializer(clients, many= True)
    return Response(serializer.data)

class fileCreate(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        '''print(request.data['file'].name)
        print(request.data['client'])'''
        timestr = time.strftime("%Y-%m-%d-%H-%M-%S")
        if(request.data['file'] == ''):
            return Response({ "message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        ext = get_extension(request.data['file'].name)
        fileName = os.path.basename(request.data['file'].name).split('.')[0] + "_" + timestr + ext
        '''print(fileName)'''
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            clientName = Client.objects.get(pk=request.data['client']).nom_client
            ftp = connect()
            path_racine = "/Preprod/IN/POC_ON_DEMAND/INPUT/ClientInput"
            path_client = path_racine + '/' + clientName
            ftp.cwd(path_client)
            path = "media/files/"
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
    files = EDIfile.objects.filter(archived = False).order_by('-id')
    serializer = FileSerializer(files, many= True)
    return Response(serializer.data)

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



