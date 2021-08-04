
from django.core.files.storage import FileSystemStorage
import os
import time
import paramiko
import logging
import pandas as pd
import numpy as np
from .models import LogisticFile, LogisticFileInfo, FileExcelContent
logger = logging.getLogger('django')

def removeLogisticFileFromServer(fileName):
    django_directory = os.getcwd()
    os.chdir("media/files")
    os.remove(fileName)
    os.chdir(django_directory)


def traceLogisticFileInDB(fileName, typeLogisticFile):
    logisticFileObject = LogisticFile(logisticFile=fileName, logisticFileType=typeLogisticFile)
    logisticFileObject.save()


def logisticFileTypeExistInSftpServer(sftp_client,typeLogisticFile):
    sftp_client.chdir('.')
    logisticClientFolders = ['ARCHIVE', 'IN', 'OUT']
    for logisticClientFolder in logisticClientFolders:
        if logisticClientFolder not in sftp_client.listdir():
            sftp_client.mkdir(logisticClientFolder)
    sftp_client.chdir("/IN")
    typeLogistFileExist = False
    for logisticFile in sftp_client.listdir():
        fileType = logisticFile[0:5]
        if (fileType == typeLogisticFile):
            typeLogistFileExist = True
    return typeLogistFileExist




def saveUploadedLogisticFile(request_file):
    fs = FileSystemStorage()
    logistic_file_name = request_file.name
    timestr = time.strftime("%d%m%Y")
    extension = get_extension(logistic_file_name)
    logisticFile = fs.save(logistic_file_name, request_file)
    path = "media/files/"
    pathLogisticFile = path + logisticFile
    dataFrameLogisticFile = pd.read_excel(pathLogisticFile)
    typeLogisticFile = dataFrameLogisticFile["OP_CODE"].values[0]
    fileName = typeLogisticFile + timestr + extension
    os.rename(r'media/files/{}'.format(logisticFile), r'media/files/{}'.format(fileName))
    sftp_client = connect()
    if logisticFileTypeExistInSftpServer(sftp_client,typeLogisticFile):
        removeLogisticFileFromServer(fileName)
        return False
    else:
        uploadLogisticFileInSFtpServer(sftp_client,fileName)
        traceLogisticFileInDB(fileName, typeLogisticFile)
        return True

def get_extension(filename):
    basename = os.path.basename(filename)  # os independent
    ext = '.'.join(basename.split('.')[1:])
    return '.' + ext if ext else None

def uploadLogisticFileInSFtpServer(sftp_client,fileName):
    django_directory = os.getcwd()
    os.chdir("media/files")
    sftp_client.put(fileName, sftp_client.getcwd() +"/" + fileName)
    os.remove(fileName)
    os.chdir(django_directory)

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
                                 clientName= logisticFileDB.clientName, archived = logisticFileDB.archived)
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
                                            clientName=logisticFileDB.clientName,
                                            archived = logisticFileDB.archived)
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
    for column in columns:
        if (excelfile[column].dtype == np.dtype('datetime64[ns]')):
            excelfile[column] = excelfile[column].dt.strftime("%d/%m/%Y")
    rows = excelfile.values.tolist()
    os.remove(logisticFileName)
    responseObject = FileExcelContent(columns, rows)
    os.chdir(django_directory)
    logger.info("current working directory après remove & os.chdir(django_directory) " + os.getcwd())
    return responseObject


