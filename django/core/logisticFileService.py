
from django.core.files.storage import FileSystemStorage
import os
import time
import paramiko
import logging
import pandas as pd
from .models import LogisticFile, LogisticFileInfo, FileExcelContent
logger = logging.getLogger('django')

def removeLogisticFileFromServer(fileName):
    os.remove(fileName)


def traceLogisticFileInDB(fileName, typeLogisticFile):
    logisticFileObject = LogisticFile(logisticFile=fileName, logisticFileType=typeLogisticFile)
    logisticFileObject.save()


def saveUploadedLogisticFile(request_file, typeLogisticFile):
    fs = FileSystemStorage()
    logistic_file_name = request_file.name
    timestr = time.strftime("%d%m%Y")
    extension = get_extension(logistic_file_name)
    fileName = typeLogisticFile + timestr + extension
    file = fs.save(fileName, request_file)
    logger.info('fin upload Logistic File in Server & rename logistic File ')
    uploadLogisticFileInSFtpServer(fileName)
    #removeLogisticFileFromServer(fileName)
    traceLogisticFileInDB(fileName, typeLogisticFile)

def get_extension(filename):
    basename = os.path.basename(filename)  # os independent
    ext = '.'.join(basename.split('.')[1:])
    return '.' + ext if ext else None

def uploadLogisticFileInSFtpServer(fileName):
    logger.info('current working directory avant django directory ' + os.getcwd())
    django_directory = os.getcwd()
    logger.info('current working directory après django directory ' + os.getcwd())
    sftp_client = connect()
    logger.info('fin connect to SFTP server')
    sftp_client.chdir('.')
    logger.info('change directory to '+ sftp_client.getcwd())
    logisticClientFolders = ['ARCHIVE', 'IN', 'OUT']
    for logisticClientFolder in logisticClientFolders:
        logger.info( logisticClientFolder + "exist")
        if logisticClientFolder not in sftp_client.listdir():
            logger.info('fin creation folder '+ logisticClientFolder)
            sftp_client.mkdir(logisticClientFolder)
    logger.info('fin verification de l''existance des 3 dossiers ARCHIVE, IN et OUT')
    sftp_client.chdir("/IN")
    logger.info('change directory to ' + sftp_client.getcwd())
    logger.info('current working directory avant qu''on entre dans le media/files ' + os.getcwd())
    os.chdir("media/files")
    logger.info('current working directory après qu''on entre dans le media/files' + os.getcwd())
    sftp_client.put(fileName, sftp_client.getcwd() +"/" + fileName)
    logger.info('fin upload logistic file ' + fileName + " in sftp server")
    os.remove(fileName)
    os.chdir(django_directory)
    logger.info("current working directory après remove & os.chdir(django_directory) " + os.getcwd())

def connect():
    ssh = paramiko.SSHClient()

    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh.connect(hostname='talend.ecolotrans.net', username='REDLEAN_T', password='rV53PjKsu6JEJ22m', port='2022')

    sftp_client = ssh.open_sftp()
    return  sftp_client

def getAllLogisticFileList():
    logisticFiles = LogisticFile.objects.all().order_by('-created_at')
    listLogisticFiles= list()
    for logisticFileDB in logisticFiles:
        logisticFileResponse= LogisticFileInfo(idLogisticFile=logisticFileDB.id, logisticFileName=logisticFileDB.logisticFile,
                                 createdAt=logisticFileDB.created_at, logisticFileType=logisticFileDB.logisticFileType,
                                 status=logisticFileDB.status, number_annomalies=logisticFileDB.number_annomalies,
                                 clientName= logisticFileDB.clientName)
        listLogisticFiles.append(logisticFileResponse)
    return listLogisticFiles

def getSingleLogisticFileDetail(key):
    logisticFileDB = LogisticFile.objects.get(pk=key)
    logisticFileResponse = LogisticFileInfo(idLogisticFile=logisticFileDB.id,
                                            logisticFileName=logisticFileDB.logisticFile,
                                            createdAt=logisticFileDB.created_at,
                                            logisticFileType=logisticFileDB.logisticFileType,
                                            status=logisticFileDB.status,
                                            number_annomalies=logisticFileDB.number_annomalies,
                                            clientName=logisticFileDB.clientName)
    return logisticFileResponse

def seeContentLogisticFile(logisticFileName):
    django_directory = os.getcwd()
    logger.info('current directory in server ' + django_directory)
    sftp_client = connect()
    logger.info('fin connect to SFTP server')
    sftp_client.chdir('.')
    logger.info('SFTP server directory : '+ sftp_client.getcwd())
    sftp_client.chdir("/IN")
    logger.info('change SFTP directory : ' + sftp_client.getcwd())
    for name in sftp_client.listdir():
        if name == logisticFileName:
            os.chdir("media/files")
            sftp_client.get(sftp_client.getcwd() + "/" + name,os.getcwd() + "/" + name)
            logger.info(name + ' downloaded successufuly')
            break
    excelLogisticFile = pd.read_excel(logisticFileName)
    excelfile = excelLogisticFile.fillna('')
    columns = list(excelfile.columns)
    rows = excelfile.values.tolist()
    os.remove(logisticFileName)
    responseObject = FileExcelContent(columns, rows)
    os.chdir(django_directory)
    logger.info("current working directory après remove & os.chdir(django_directory) " + os.getcwd())
    return responseObject


