import datetime
import pandas as pd
import os
from sftpConnectionToExecutionServer.views import sftp, connect as connect_sftp
from .models import TransactionsLivraison
from django.conf import settings

DJANGO_DIRECTORY = settings.BASE_DIR
Kayser_Client = "C328-LAGARDERE-ERIC KAYSER"
def sendTransactionParamsToExecutionServerInCsvFile(transaction_id, jobs_to_start, destination_folder):
    fileName = str(transaction_id) + ".csv"
    jobsToStartInOneString = listToString(jobs_to_start)
    remotePath = "/home/talend/projects/ftpfiles/IN/ondemand_prod/transactions/" + destination_folder + "/" + fileName
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
    transaction = TransactionsLivraison.objects.get(pk=transactionId)
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


def deleteFilesForTransaction(id):
    path = "/home/talend/projects/ftpfiles/IN" + "/" + "ondemand_preprod" + "/transactions" 
    toGeneratePath = path + "/to_generate"
    toCorrectPath = path + "/to_correct"
    
    sftp.chdir(toGeneratePath)
    fileName = str(id) + ".csv"
    try:
        sftp.stat(fileName)
        sftp.remove(fileName)
    except Exception as e:
        if ( "No such file" in str(e)):
            return("file not found")
    
    sftp.chdir(toCorrectPath)
    try:
        sftp.stat(fileName)
        sftp.remove(fileName)
    except Exception as e:
        if ( "No such file" in str(e)):
            return("file not found")

