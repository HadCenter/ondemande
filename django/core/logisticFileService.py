
from django.core.files.storage import FileSystemStorage
import os
import time
import paramiko
import logging
import pandas as pd
import numpy as np
from sftpConnectionToExecutionServer.views import sftp
from API.settings import SECRET_KEY
import jwt

from .models import LogisticFile, LogisticFileInfo, FileExcelContent
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR
magistorLogger = logging.getLogger('magistor')

FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES = "TransMagistorProd"

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
        magistorLogger.info("Magistor File type {} ".format(typeLogisticFile))
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

    ssh.connect(hostname='10.10.1.8', username='REDLEAN_T', password='rV53PjKsu6JEJ22m', port='2022')

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
    try:
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
    except Exception as e:
        response = FileExcelContent([], [])
        return response



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
        #LogisticFile.objects.filter(pk=folderLogisticFile).update(ButtonCorrecteActiveted=True,ButtonValidateActivated=False,ButtonInvalidateActivated=True,status='en cours')
        updateMetaDataFileInTableCoreLogisticFile(folderLogisticFile,"en cours")
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
    if(int(LogisticFile.objects.get(pk=idLogisticFile).number_annomalies) > 0):
        #LogisticFile.objects.filter(pk=idLogisticFile).update(ButtonCorrecteActiveted=False,ButtonValidateActivated=True,ButtonInvalidateActivated=False,status='à vérifier')
        updateMetaDataFileInTableCoreLogisticFile(idLogisticFile,"à vérifier")
    else:
        updateMetaDataFileInTableCoreLogisticFile(idLogisticFile,"En attente")
        #LogisticFile.objects.filter(pk=idLogisticFile).update(ButtonCorrecteActiveted=False,ButtonValidateActivated=True,ButtonInvalidateActivated=False,status='En attente')

    if(LogistFileExist == False):
        return False
    else:
        deleteLogisticFileFromInFolder(sftp_client= sftp_client, FolderInPath= "/IN", logisticFileName=logisticFileName)
        return True

def updateMetaDataFileInTableCoreLogisticFile(logisticFileId, logisticFileStatus):
    logisticFile = LogisticFile.objects.get(pk=logisticFileId)
    logisticFile.status = logisticFileStatus
    if(logisticFileStatus in (status for status in ["En attente d'un moteur","En cours","Invalide","Terminé"])):
        logisticFile.ButtonCorrecteActiveted = False
        logisticFile.ButtonValidateActivated = False
        logisticFile.ButtonInvalidateActivated = False

    elif(logisticFileStatus.casefold() in (status.casefold() for status in ["Echec","à vérifier","En attente"])):
        logisticFile.ButtonCorrecteActiveted = False
        logisticFile.ButtonValidateActivated = True
        logisticFile.ButtonInvalidateActivated = False

    elif(logisticFileStatus == "en cours"):
        logisticFile.ButtonCorrecteActiveted = False
        logisticFile.ButtonValidateActivated = False
        logisticFile.ButtonInvalidateActivated = True
    logisticFile.save()

def createFileLogisticFromColumnAndRows(LogisticFileId, columns1, rows1, columns2, rows2):
    os.chdir(DJANGO_DIRECTORY)
    os.chdir("media/files")
    logisticFile = LogisticFile.objects.get(pk=LogisticFileId)
    sourcePath = "/{}/{}".format(FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES,LogisticFileId)
    fileName : str
    columns1HasRemarque : bool = False
    columns2HasRemarque : bool = False
    sftp_client = connect()
    fileName = logisticFile.logisticFile.name
    sftp_client.get(sourcePath +  "/" + fileName, fileName)
    excelfile = pd.ExcelFile(fileName)
    FileSheets = excelfile.sheet_names
    excelfile.close()

    df = pd.DataFrame(rows1, columns=columns1)
    df2 = pd.DataFrame(rows2, columns=columns2)
    df.rename(columns={'LONGUEUR_UNITAIRE':'LONGEUR_UNITAIRE'}, inplace = True)
    df2.rename(columns={'LONGUEUR':'LONGEUR'}, inplace = True)

    for element in columns1:
        if(element == 'REMARQUE'):
            dfwithoutRemarque = df.drop("REMARQUE", axis=1)
            columns1HasRemarque = True

    for element in columns2:
        if(element == 'REMARQUE'):
            df2withoutRemarque = df2.drop("REMARQUE", axis=1)
            columns2HasRemarque = True


    if(columns1HasRemarque or columns2HasRemarque):
        transIdFileException = fileName[0:3] + fileName[5:]
        transIdFileException = transIdFileException.replace('.xlsx', '_Exceptions.xlsx')
        with pd.ExcelWriter(fileName) as writer:  
            df.to_excel(writer, sheet_name=FileSheets[0], index=False)
            df2.to_excel(writer, sheet_name=FileSheets[1], index= False)

        sftp_client.put(fileName, sourcePath + "/" + transIdFileException)
        os.remove(fileName)

        transIdFileCorrect = fileName[0:3] + fileName[5:]
        transIdFileCorrect = transIdFileCorrect.replace('.xlsx', '_Correct.xlsx')
        sftp_client.get(sourcePath +  "/" + transIdFileCorrect, transIdFileCorrect)

        fichier_correct = pd.read_excel(transIdFileCorrect, sheet_name=FileSheets[0])
        fichier_correct.rename(columns={'LONGUEUR_UNITAIRE':'LONGEUR_UNITAIRE'}, inplace = True)
        df = dfwithoutRemarque.append(fichier_correct, ignore_index=True)

        fichier_correct2 = pd.read_excel(transIdFileCorrect, sheet_name=FileSheets[1])
        fichier_correct2.rename(columns={'LONGUEUR':'LONGEUR'}, inplace = True)
        df2 = df2withoutRemarque.append(fichier_correct2, ignore_index=True)

    with pd.ExcelWriter(fileName) as writer:  
        df.to_excel(writer, sheet_name=FileSheets[0], index=False)
        df2.to_excel(writer, sheet_name=FileSheets[1], index= False)

    sftp_client.put(fileName, sourcePath + "/" + fileName)

    os.remove(fileName)
    os.chdir(DJANGO_DIRECTORY)
    return fileName

def validateAndReplaceLogisticFile(logisticFileName, folderLogisticFile):
    sftp_client = connect()
    LogistFileExist = LogisticFileExistInSftpServer(sftp_client,logisticFileName)
    typeLogistFileExist = logisticFileTypeExistInSftpServer(sftp_client,logisticFileName[0:5])
    if (not(LogistFileExist) and typeLogistFileExist):
        return False
    else:
        sourcePath = "/{}/{}".format(FOLDER_NAME_FOR_IMPORTED_LOGISTIC_FILES,folderLogisticFile)
        destinationPath = "/IN"
        copyLogisticFileFromMagistorTransToIN(sftp_client= sftp_client,logisticFileName=logisticFileName,source= sourcePath,destination= destinationPath)
        #LogisticFile.objects.filter(pk=folderLogisticFile).update(ButtonCorrecteActiveted=True,ButtonValidateActivated=False,ButtonInvalidateActivated=True,status='Validé')
        return True


def LogisticFileExistInSftpServer(sftp_client,logisticFileName):
    INFolderPath = "/IN"
    sftp_client.chdir(INFolderPath)
    LogistFileExist = False
    for logisticFile in sftp_client.listdir():
        if (logisticFile == logisticFileName):
            LogistFileExist = True
    return LogistFileExist



