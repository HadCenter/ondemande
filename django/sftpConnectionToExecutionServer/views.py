from django.shortcuts import render
import os
# Create your views here.
import paramiko
paramiko.util.log_to_file("paramiko.log")

# Open a transport
host,port = "talend.ecolotrans.net",22
transport = paramiko.Transport((host,port))

# Auth
username,password = "talend","CpZjNb7tWQya"
transport.connect(None,username,password)

# Go!
sftp = paramiko.SFTPClient.from_transport(transport)


remoteFilepathBase = "/var/www/talend/projects/ftpfiles/IN/"


def dowloadFileSFTP(transaction_id : str , fileName : str ):
    osOriginalPath = os.getcwd()
    try :
        os.chdir("media/files/UrbantzToHub/")
        remoteFilepath = remoteFilepathBase+ transaction_id + "/" + fileName
        sftp.get(remotepath= remoteFilepath,localpath= os.getcwd() + "/" + fileName)
        os.chdir(osOriginalPath)
    except Exception as e:
        print(e)
        os.chdir(osOriginalPath)

