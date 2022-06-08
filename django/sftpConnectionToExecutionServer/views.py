from django.shortcuts import render
import os
# Create your views here.
import paramiko
paramiko.util.log_to_file("paramiko.log")

sftp = None
def connect():
    global sftp
    # Open a transport
    host,port = "talend.ecolotrans.net",22
    transport = paramiko.Transport((host,port))

    # Auth
    username,password = "talend","CpZjNb7tWQya"
    transport.connect(None,username,password)
    # Go!
    sftp = paramiko.SFTPClient.from_transport(transport)

connect()
