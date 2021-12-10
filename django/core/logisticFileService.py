
from django.core.files.storage import FileSystemStorage
import os
import time
import paramiko
import logging
import pandas as pd
import numpy as np
from .models import LogisticFile, LogisticFileInfo, FileExcelContent
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR
logger = logging.getLogger('django')

FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES = "TransMagistorDev"

def removeLogisticFileFromServer(fileName):
    os.chdir(DJANGO_DIRECTORY)
    os.chdir("media/files")
    os.remove(fileName)
    os.chdir(DJANGO_DIRECTORY)

def traceLogisticFileInDB(fileName, typeLogisticFile):
    logisticFileObject = LogisticFile(logisticFile=fileName, logisticFileType=typeLogisticFile)
    logisticFileObject.save()
    idFileInDB = logisticFileObject.id
    return idFileInDB
def copyLogisticFileFromMagistorTransToLocalHost(sftp_client,logisticFileName,source):
    os.chdir(DJANGO_DIRECTORY)
    sftp_client.get(source + "/" + logisticFileName, os.getcwd() + "/" + logisticFileName )
    os.chdir(DJANGO_DIRECTORY)
def copyLogisticFileFromMagistorTransToIN(sftp_client,logisticFileName,source,destination):
    os.chdir(DJANGO_DIRECTORY)
    os.chdir("media/files")
    sftp_client.get(source +  "/" + logisticFileName, os.getcwd() + "/" + logisticFileName)
    sftp_client.put(logisticFileName, destination + "/" + logisticFileName)
    os.remove(logisticFileName)
    os.chdir(DJANGO_DIRECTORY)

def logisticFileTypeExistInSftpServer(sftp_client,typeLogisticFile):
    INFolderPath = "/IN"
    sftp_client.chdir(INFolderPath)
    typeLogistFileExist = False
    for logisticFile in sftp_client.listdir():
        fileType = logisticFile[0:5]
        if (fileType == typeLogisticFile):
            typeLogistFileExist = True
    return typeLogistFileExist

def saveUploadedLogisticFile(request_file):
    os.chdir(DJANGO_DIRECTORY)
    fs = FileSystemStorage()
    logistic_file_name = request_file.name
    timestr = time.strftime("%d%m%Y")
    extension = get_extension(logistic_file_name)
    logisticFile = fs.save(logistic_file_name, request_file)
    path = "media/files/"
    pathLogisticFile = path + logisticFile
    dataFrameLogisticFile = pd.read_excel(pathLogisticFile)
    if ( "OP_CODE" not in dataFrameLogisticFile.columns):
        os.remove(pathLogisticFile)
        return False
    else:
        typeLogisticFile = dataFrameLogisticFile["OP_CODE"].values[0]
        fileName = typeLogisticFile + timestr + extension
        os.rename(r'media/files/{}'.format(logisticFile), r'media/files/{}'.format(fileName))
        idFileInDB = traceLogisticFileInDB(fileName, typeLogisticFile)
        sftp_client = connect()
        uploadLogisticFileInSFtpServer(sftp_client, fileName, idFileInDB)
        return True

def get_extension(filename):
    basename = os.path.basename(filename)  # os independent
    ext = '.'.join(basename.split('.')[1:])
    return '.' + ext if ext else None

def createFolderIfNotExist(sftp_client, folderName, placementPath):
    sftp_client.chdir(placementPath)
    if folderName not in sftp_client.listdir():
        folderName = "{}".format(folderName)
        sftp_client.mkdir(folderName)
        sftp_client.chown(folderName, 5500,5500)
    if(placementPath == "/"):
        folderPath = sftp_client.getcwd() + folderName
    else:
        folderPath = sftp_client.getcwd() + "/" + folderName
    
    return folderPath

def uploadLogisticFileInSFtpServer(sftp_client , fileName , idFileInDB ):
    os.chdir(DJANGO_DIRECTORY)
    os.chdir("media/files")
    importedFilesfolderPath = createFolderIfNotExist(sftp_client, folderName=FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES , placementPath="/")
    idFileFolderPath = createFolderIfNotExist(sftp_client, folderName=idFileInDB, placementPath=importedFilesfolderPath)
    sftp_client.put(fileName, idFileFolderPath + "/" + fileName)
    os.remove(fileName)
    os.chdir(DJANGO_DIRECTORY)

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
                                 clientName= logisticFileDB.clientName, archived = logisticFileDB.archived,
                                 ButtonCorrecteActiveted= logisticFileDB.ButtonCorrecteActiveted,
                                 ButtonValidateActivated= logisticFileDB.ButtonValidateActivated,
                                 ButtonInvalidateActivated= logisticFileDB.ButtonInvalidateActivated)
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
                                            archived = logisticFileDB.archived,
                                            ButtonCorrecteActiveted = logisticFileDB.ButtonCorrecteActiveted,
                                            ButtonValidateActivated = logisticFileDB.ButtonValidateActivated,
                                            ButtonInvalidateActivated= logisticFileDB.ButtonInvalidateActivated)
    return logisticFileResponse

def seeContentLogisticFile(logisticFileName, folderLogisticFile, logisticSheetName):
    os.chdir(DJANGO_DIRECTORY)
    folderLogisticFilePath = "/{}/{}".format(FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES,folderLogisticFile)
    sftp_client = connect()
    sftp_client.chdir(folderLogisticFilePath)
    os.chdir("media/files")
    sftp_client.get(sftp_client.getcwd() + "/" + logisticFileName, os.getcwd() + "/" + logisticFileName)
    excelLogisticFile = pd.read_excel(logisticFileName, sheet_name=logisticSheetName)
    excelfile = excelLogisticFile.fillna('')
    columns = list(excelfile.columns)
    for column in columns:
        if (excelfile[column].dtype == np.dtype('datetime64[ns]')):
            excelfile[column] = excelfile[column].dt.strftime("%d/%m/%Y")
    rows = excelfile.values.tolist()
    os.remove(logisticFileName)
    responseObject = FileExcelContent(columns, rows)
    os.chdir(DJANGO_DIRECTORY)
    return responseObject


def readLogisticFileFromLocalHost(logisticFileName):
    with open(logisticFileName, 'rb') as f:
        logisticFile = f.read()
    return logisticFile


def downloadImportedLogisticFile(logisticFileName,folderLogisticFile):
    sftp_client = connect()
    sourcePath = "/{}/{}".format(FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES,folderLogisticFile)
    copyLogisticFileFromMagistorTransToLocalHost(sftp_client=sftp_client,logisticFileName=logisticFileName,source=sourcePath)
    logisticFile = readLogisticFileFromLocalHost(logisticFileName)
    return logisticFile

def validateLogisticFile(logisticFileName, folderLogisticFile, typeLogisticFile):
    sftp_client = connect()
    typeLogistFileExist = logisticFileTypeExistInSftpServer(sftp_client,typeLogisticFile)
    if(typeLogistFileExist):
        return False
    else:
        sourcePath = "/{}/{}".format(FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES,folderLogisticFile)
        destinationPath = "/IN"
        copyLogisticFileFromMagistorTransToIN(sftp_client= sftp_client,logisticFileName=logisticFileName,source= sourcePath,destination= destinationPath)
        LogisticFile.objects.filter(pk=folderLogisticFile).update(ButtonCorrecteActiveted=True,ButtonValidateActivated=False,ButtonInvalidateActivated=True,status='Validé')
        return True


def logisticFileExistInFolderIN(sftp_client, logisticFileName):
    INFolderPath = "/IN"
    sftp_client.chdir(INFolderPath)
    LogistFileExist = False
    for logisticFile in sftp_client.listdir():
        if (logisticFile == logisticFileName):
            LogistFileExist = True
    return LogistFileExist


def deleteLogisticFileFromInFolder(sftp_client, FolderInPath, logisticFileName):
    for logisticFile in sftp_client.listdir(path=FolderInPath):
        if (logisticFile == logisticFileName):
            sftp_client.remove(FolderInPath + "/"+ logisticFile)


def deleteNotValidateLogisticFile(logisticFileName, idLogisticFile):
    sftp_client = connect()
    LogistFileExist = logisticFileExistInFolderIN(sftp_client,logisticFileName)
    if(LogistFileExist == False):
        LogisticFile.objects.filter(pk=idLogisticFile).update(ButtonCorrecteActiveted=False,ButtonValidateActivated=True,ButtonInvalidateActivated=False,status='En attente')
        return False
    else:
        deleteLogisticFileFromInFolder(sftp_client= sftp_client, FolderInPath= "/IN", logisticFileName=logisticFileName)
        LogisticFile.objects.filter(pk=idLogisticFile).update(ButtonCorrecteActiveted=False,ButtonValidateActivated=True,ButtonInvalidateActivated=False,status='En attente')
        return True

def updateMetaDataFileInTableCoreLogisticFile(logisticFileId, logisticFileStatus):
    logisticFile = LogisticFile.objects.get(pk=logisticFileId)
    logisticFile.status = logisticFileStatus
    if(logisticFileStatus.casefold() in (status.casefold() for status in ["En cours","Invalide","Terminé"])):
        logisticFile.ButtonCorrecteActiveted = False
        logisticFile.ButtonValidateActivated = False
        logisticFile.ButtonInvalidateActivated = False

    elif(logisticFileStatus.casefold() == "à vérifier".casefold()):
        logisticFile.ButtonCorrecteActiveted = False
        logisticFile.ButtonValidateActivated = True
        logisticFile.ButtonInvalidateActivated = False

    logisticFile.save()





