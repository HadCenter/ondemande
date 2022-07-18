import datetime
from fileinput import filename
import pandas as pd
import os
from django.core.cache import cache
import json
import requests
from sftpConnectionToExecutionServer.views import sftp, connect as connect_sftp
from .models import PlansFacturation, TransactionsLivraison
from django.conf import settings
from .configSF import ConfigSF
import numpy as np
DJANGO_DIRECTORY = settings.BASE_DIR
Kayser_Client = "C328-LAGARDERE-ERIC KAYSER"
env_folder = "ondemand_dev"
globalInFolderPath = "/var/www/talend/projects/ftpfiles/IN"


def sendTransactionParamsToExecutionServerInCsvFile(transaction_id, jobs_to_start, destination_folder):
    fileName = str(transaction_id) + ".csv"
    jobsToStartInOneString = listToString(jobs_to_start)
    remotePath = "/home/talend/projects/ftpfiles/IN/ondemand_dev/transactions/" + destination_folder + "/" + fileName
    df = pd.DataFrame([ [transaction_id, jobsToStartInOneString]], columns=['id', 'jobsToStart'])
    df.to_csv(fileName, index=False, sep=';')
    try:
        sftp.put(localpath=fileName, remotepath=remotePath)
    except Exception as e:
        connect_sftp()
        sftp.put(localpath=fileName, remotepath=remotePath)
    
    os.remove(fileName)


# converting list to string using iteration and add separator
def listToString(s):
    string = s[0]
    for index in range(1,len(s)):
        string += ',' + s[index]
    return string

def updateMetaDataFileInTableTransactionsLivraison(transactionId, transactionStatus):
    transaction = TransactionsLivraison.objects.get(id=transactionId)
    transaction.statut = transactionStatus
    transaction.save()

def downloadLivraisonFileFromFTP(transactionId, LivraisonFileName, clientList):
    transaction = TransactionsLivraison.objects.get(id=transactionId)
    try:
        sftp.get(transaction.fichier_livraison_sftp, os.getcwd() + "/" + LivraisonFileName )
    except Exception as e:
        connect_sftp()
        sftp.get(transaction.fichier_livraison_sftp, os.getcwd() + "/" + LivraisonFileName )

    LivraisonFile = readLivraisonFileForCertainClients(LivraisonFileName, clientList)

    return LivraisonFile


def readLivraisonFileForCertainClients(LivraisonFileName, clientList):
    with open(LivraisonFileName, 'rb') as f:
        LivraisonFile = f.read()

    kayserisFound: bool = False
    if (Kayser_Client in clientList):
        downloadKayserFiles(LivraisonFile)
        clientList.remove(Kayser_Client)
        kayserisFound = True

    excelfile = pd.read_excel(LivraisonFile)
    excelfile = excelfile.fillna('')
    df = excelfile.loc[excelfile['Expediteur'].isin(clientList)]
    os.remove(LivraisonFileName)
    df.to_excel(LivraisonFileName, index=False)

    with open(LivraisonFileName, 'rb') as file:
        LivraisonFile2 = file.read()

    return kayserisFound,LivraisonFile2


def readLivraisonFileFromLocalHost(LivraisonFileName):
    with open(LivraisonFileName, 'rb') as f:
        LivraisonFile = f.read()
    return LivraisonFile

def downloadKayserFiles(LivraisonFile):

    excelfile = pd.read_excel(LivraisonFile)
    excelfile = excelfile.fillna('')
    excelfile = excelfile.loc[excelfile['Expediteur'] == Kayser_Client]

    CDG_Livraisons_df = excelfile.loc[excelfile['Contact'].str.casefold().str.contains("charles") == True]
    ORLY_Livraisons_df = excelfile.loc[excelfile['Contact'].str.casefold().str.contains("orly") == True]
    montparnasse_df = excelfile.loc[(excelfile['Type_de_Service'].str.contains("LIVRAISON") == True) & (excelfile['Contact'].str.casefold().str.contains("charles") == False) & (excelfile['Contact'].str.casefold().str.contains("orly") == False)]
    all_enlevement_df = excelfile.loc[(excelfile['Type_de_Service'].str.contains("ENLEVEMENT") == True) & (excelfile['Contact'].str.casefold().str.contains("charles") == False) & (excelfile['Contact'].str.casefold().str.contains("orly") == False)]
    
    CDG_Livraisons_df = CDG_Livraisons_df.append(all_enlevement_df.loc[all_enlevement_df['Tournee'].isin(CDG_Livraisons_df['Tournee'].values)], ignore_index=True)
    CDG_Livraisons_df.sort_values(by = ['Tournee'], inplace=True)

    ORLY_Livraisons_df = ORLY_Livraisons_df.append(all_enlevement_df.loc[all_enlevement_df['Tournee'].isin(ORLY_Livraisons_df['Tournee'].values)], ignore_index=True)
    ORLY_Livraisons_df.sort_values(by = ['Tournee'], inplace=True)

    montparnasse_df = montparnasse_df.append(all_enlevement_df.loc[all_enlevement_df['Tournee'].isin(montparnasse_df['Tournee'].values)], ignore_index=True)
    montparnasse_df.sort_values(by = ['Tournee'], inplace=True)

    current_date = datetime.datetime.now().strftime("%d_%m_%Y")
    CDG_Livraisons_df.to_excel(current_date+"_CDG_Livraisons.xlsx", index=False)
    ORLY_Livraisons_df.to_excel(current_date+"_ORL_Livraisons.xlsx", index=False)
    montparnasse_df.to_excel(current_date+"_Montparnasse_Livraisons.xlsx", index=False)


def getAllFacturationTransportFromFTP():
    INFolderPath = "/var/www/talend/projects/ftpfiles/OUT/Billing_generator"
    sftp.chdir(INFolderPath)
    files = []
    count = 1
    status = "unknown"

    for file in sftp.listdir():
        if (file.__contains__(".xlsx")):
            files.append({"name":file,"status":status})
    sorted_files = sorted(files, key = lambda element:element["name"], reverse=True)
    for f in sorted_files:
        if(count < 2):
            f["status"] = checkFacturationBetweenSheets(f["name"])
            count += 1
    return sorted_files

def checkFacturationForOneFile(fileName):
    status = checkFacturationBetweenSheets(fileName)
    return {"name":fileName,"status":status} 

def checkFacturationBetweenSheets(file):
    INFolderPath = "/var/www/talend/projects/ftpfiles/OUT/Billing_generator"
    sftp.chdir(INFolderPath + "/" + env_folder)
    try:
        sftp.get(file, os.getcwd() + "/" + file)
    except Exception as e:
        os.remove(file)
        return "Introuvable"


    excelfile = pd.read_excel(file)
    excelfile = excelfile.fillna('')

    for idx,row in excelfile.iterrows():
        num_fact = str(int(row['Numero_de_facture']))
        montant_HT = row['Montant_HT']
        print(file,'HT ',montant_HT)
        sheet_df = pd.read_excel(file, sheet_name=num_fact)
        total = sheet_df['total_price'].sum()
        print(file,"total in 2nd sheet", total)

        if((abs(montant_HT - total)) >= 0.1 and not(total < 400) ):
            os.remove(file)
            return "Invalide"
    os.remove(file)
    return "Valide"
        

def FacturationTransportFileFromFTP(fileToDownload):
    os.chdir(DJANGO_DIRECTORY)
    source = "/var/www/talend/projects/ftpfiles/OUT/Billing_generator"
    sftp.get(source + "/" + fileToDownload, os.getcwd() + "/" + fileToDownload )
    with open(fileToDownload, 'rb') as f:
        file = f.read()
    return file

def downloadBillingFileAndFolder(date):
    os.chdir(DJANGO_DIRECTORY)
    files = []

    source = "/var/www/talend/projects/ftpfiles/OUT/Billing_generator/" + env_folder
    billingFile = "billing"+date+".xlsx"
    download_file(source, billingFile)
    files.append(billingFile)
    
    source = "/var/www/talend/projects/ftpfiles/OUT/comptabilite/" + env_folder
    billingFile = "billing_comptabilite_analytique"+date+".csv"
    download_file(source, billingFile)
    files.append(billingFile)

    billingFile = "billing_comptabilite"+date+".csv"
    download_file(source, billingFile)
    files.append(billingFile)

    files = download_files(date, files)
    return files

def download_file(remote_path, filename):
    try:
        sftp.get(remote_path + "/" + filename, os.getcwd() + "/" + filename )
    except Exception as e:
        sftp.get(remote_path + "/" + filename, os.getcwd() + "/" + filename )

def download_files(folder, files):
    billingFolder = "/var/www/talend/projects/ftpfiles/OUT/Billing_generator/"+ env_folder +"/"+ folder
    sftp.chdir(billingFolder)

    if not os.path.exists(folder):
        os.makedirs(folder)
    # files.append(folder)
    for file in sftp.listdir():
        if (file.__contains__(".xlsx")):
            files.append(folder+"/"+file)
            try:
                sftp.chdir(billingFolder)
                sftp.get(file , os.getcwd() + "/" + folder + "/" + file )
            except Exception:
                sftp.chdir(billingFolder)
                sftp.get(file , os.getcwd() + "/" + folder + "/" + file )
        else:
            download_files(folder + "/" + file, files)
            files.append(folder + "/" + file)
    return files


def generateSFTokens():
    body = {
    'grant_type': 'password ',
    'client_id': ConfigSF.client_id,
    'client_secret': ConfigSF.client_secret,
    'username' : ConfigSF.username,
    'password' : ConfigSF.password
    }
    api_response = requests.post(ConfigSF.salesforce_url, data=body)
    if(api_response.status_code == 200):
        try:
            cache.set('SF_token', api_response.json(), 7200) #expires after two hours 
        except KeyError:
            raise Exception(api_response['error_description'])
 

def GetAllFacturePDFFromSF():
    if cache.get('SF_token') is None:
        generateSFTokens()
    token = cache.get('SF_token')

    header = {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + token['access_token']
    }

    api_response = requests.get(token['instance_url']+"/services/apexrest/getAllFactures/", headers=header)
    if(api_response.status_code == 200):
        return api_response.json()
    elif(api_response.status_code == 401):
        generateSFTokens()
        token = cache.get('SF_token')

        header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token['access_token']
        }

        api_response = requests.get(token['instance_url']+"/services/apexrest/getAllFactures/", headers=header)
        if(api_response.status_code == 200):
            return api_response.json()

    
def downloadFacturePDFFromSF(FacturesIds, factNames, nomsClients, AccountsIds):
    if cache.get('SF_token') is None:
        generateSFTokens()
    token = cache.get('SF_token')

    header = {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + token['access_token']
    }

    body = {
    "FacturesIds" : FacturesIds,
    "factNames" : factNames,
    "nomsClients" : nomsClients,
    "AccountsIds" : AccountsIds,
    "onlyPdf" : True
    }

    api_response = requests.post(token['instance_url']+"/services/apexrest/downloadFactures/", data = json.dumps(body), headers=header)
    if(api_response.status_code == 200):
        # download_response = requests.get(token['instance_url']+"/"+api_response.json(), headers=header)
        # print(token['instance_url']+"/"+api_response.json())
        #return api_response.json()
        return api_response.json()
    

def modifyFactureInSF(idFacture, price):
    if cache.get('SF_token') is None:
        generateSFTokens()
    token = cache.get('SF_token')

    header = {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + token['access_token']
    }

    body = {
    "idFacture" : idFacture,
    "montant" : price,
    }

    api_response = requests.put(token['instance_url']+"/services/apexrest/editMontant/", data = json.dumps(body), headers=header)
    if(api_response.status_code == 200):
        return api_response.json()


def updatePlanStatus(status, plan, date, numFacture):
    planDB = PlansFacturation.objects.get(plan = plan)
    planDB.status = status
    if(date is not None):
        planDB.month = date.split("-")[0]
        planDB.year = date.split("-")[1]
        planDB.numFacture = numFacture
    planDB.save()
    

def updatePlanStatutWS(plan, status):
    planDB = PlansFacturation.objects.get(plan = plan)
    planDB.status = status
    planDB.month = None
    planDB.year = None 
    planDB.month = None 
    planDB.save()


def checkFilesExistance():
    file = "ToVerifyQTE_MAD_Livraisons.xlsx"
    sftp.chdir(globalInFolderPath + "/" + env_folder)
    planDB = PlansFacturation.objects.get(plan = "step 3")
    date = planDB.derniere_execution.strftime("%d_%m_%Y_")
    fileName = date + file
    try:
        sftp.stat(fileName)
    except Exception as e:
        if ( "No such file" in str(e)):
            return("file not found")
    # os.remove(fileName)

    file = "Livraisons.xlsx"
    sftp.chdir(globalInFolderPath + "/CleanServer/" + env_folder)
    fileName = date + file
    try:
        sftp.stat(fileName)
    except Exception as e:
        if ( "No such file" in str(e)):
            return("file not found")
    # os.remove(fileName)
    return("file found")


def removeClientsFromMADFileAndCopyFileToIN(transaction_id, clientList):
    transaction = TransactionsLivraison.objects.get(id=transaction_id)
    remotefilePath = transaction.fichier_mad_sftp
    fileName = "ToVerifyQTE_MAD_Livraisons.xlsx"

    try:
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)
    except Exception as e:
        print(e)
        connect_sftp()
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)

    fileNameOUT = removeSomeClients(fileName, clientList)

    try:
        sftp.put(os.getcwd() + '/' + fileNameOUT, globalInFolderPath+"/"+ env_folder + "/" +fileNameOUT)
    except Exception as e:
        connect_sftp()
        sftp.put(os.getcwd() + '/' + fileNameOUT, globalInFolderPath+"/" + env_folder + "/" +fileNameOUT)
    os.remove(fileNameOUT)

def removeClientsFromLivraisonFileAndCopyFileToIN(transaction_id, clientList):
    transaction = TransactionsLivraison.objects.get(id=transaction_id)
    remotefilePath = transaction.fichier_livraison_sftp
    fileName = "Livraisons.xlsx"
    specificPath = "CleanServer"

    try:
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)
    except Exception as e:
        print(e)
        connect_sftp()
        sftp.get(remotepath=remotefilePath, localpath=os.getcwd() + '/' + fileName)

    fileNameOUT = removeSomeClients(fileName, clientList)

    try:
        sftp.put(os.getcwd() + '/' + fileNameOUT, globalInFolderPath + "/" + specificPath + "/" + env_folder + "/" +fileNameOUT)
    except Exception as e:
        connect_sftp()
        sftp.put(os.getcwd() + '/' + fileNameOUT, globalInFolderPath + "/" + specificPath + "/" + env_folder + "/" +fileNameOUT)
    os.remove(fileNameOUT)


def removeSomeClients(fileName, clientList):
    with open(fileName, 'rb') as f:
        file = f.read()

    excelfile = pd.read_excel(file)
    excelfile = excelfile.fillna('')
    df = excelfile.loc[np.invert(excelfile['Expediteur'].isin(clientList))]
    os.remove(fileName)
    current_date = datetime.datetime.now().strftime("%d_%m_%Y")

    FileNameOUT = current_date +"_"+fileName

    df.to_excel(FileNameOUT, index=False)

    return(FileNameOUT)
