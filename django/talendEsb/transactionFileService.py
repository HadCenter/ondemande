import pandas as pd
import os
from sftpConnectionToExecutionServer.views import sftp


def sendTransactionParamsToExecutionServerInCsvFile(transaction_id, jobs_to_start, destination_folder):
    fileName = str(transaction_id) + ".csv"
    jobsToStartInOneString = listToString(jobs_to_start)
    remotePath = "/home/talend/projects/ftpfiles/IN/ondemand_preprod/transactions/" + destination_folder + "/" + fileName
    df = pd.DataFrame([ [transaction_id, jobsToStartInOneString]], columns=['id', 'jobsToStart'])

    df.to_csv(fileName, index=False, sep=';')
    sftp.put(localpath=fileName, remotepath=remotePath)
    os.remove(fileName)


# converting list to string using iteration and add separator
def listToString(s):
    string = s[0]

    for index in range(1,len(s)):
        string += ',' + s[index]

    return string