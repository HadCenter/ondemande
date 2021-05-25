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


def archive_client(client: Client):
    client.archived = True
    client.save()

    EDIfile.objects.filter(client=client).update(archived=True)

    archiveDirectoryOfClientFromInto(client, path_racine_input, path_racine_input + "archive")
    archiveDirectoryOfClientFromInto(client, path_racine_output, path_racine_output + "archive")


def archiveDirectoryOfClientFromInto(client: Client, pathFilesAreFromFrom, pathToArchiveTo):
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

    def desarchive_client(client: Client):
        client.archived = False
        client.save()

        files = EDIfile.objects.filter(client=client).update(archived=False)

        desarchiveDirectoryOfClientFromInto(client, path_racine_input, path_racine_input + "archive")
        desarchiveDirectoryOfClientFromInto(client, path_racine_output, path_racine_output + "archive")

    def desarchiveDirectoryOfClientFromInto(client: Client, pathFilesAreFromFrom, pathToArchiveTo):
        ftp = connect()
        client_Code = client.code_client
        osDefaultPath = os.getcwd()
        try:

            os.chdir("media")
            os.chdir("files")
            if client_Code not in os.listdir():
                os.mkdir(client_Code)
            os.chdir(client_Code)

            ftp.cwd(pathToArchiveTo)
            fileNameZiped = client_Code + ".zip"
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

            for fileNameInOs in os.listdir():
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


def desarchive_client(client: Client):
    client.archived = False
    client.save()

    files = EDIfile.objects.filter(client=client).update(archived=False)

    desarchiveDirectoryOfClientFromInto(client, path_racine_input, path_racine_input + "archive")
    desarchiveDirectoryOfClientFromInto(client, path_racine_output, path_racine_output + "archive")


def desarchiveDirectoryOfClientFromInto(client: Client, pathFilesAreFromFrom, pathToArchiveTo):
    ftp = connect()
    client_Code = client.code_client
    osDefaultPath = os.getcwd()
    try:

        os.chdir("media")
        os.chdir("files")
        if client_Code not in os.listdir():
            os.mkdir(client_Code)
        os.chdir(client_Code)

        ftp.cwd(pathToArchiveTo)
        fileNameZiped = client_Code + ".zip"
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

        for fileNameInOs in os.listdir():
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


def getAllClientList():
    clients = Client.objects.all().order_by('-id')
    listClients = list()
    for clientDB in clients:
        clientResponse = Contact(idContact=clientDB.id, codeClient=clientDB.code_client, nomClient=clientDB.nom_client,
                                 email=clientDB.email, archived=clientDB.archived)
        listClients.append(clientResponse)
    return listClients

def getClientInfo(key):
    try:
        Client.objects.get(pk=key)
    except Client.DoesNotExist:
        print( " le client with key "+ key +" n'existe pas !")
    return Client.objects.get(pk=key)