from django.db import models
import os
# Create your models here.
def upload_to(instance, filename):
    return 'files/{filename}'.format(filename=filename)

class Client(models.Model):
    code_client = models.CharField(max_length=200)
    nom_client = models.CharField(max_length=200, unique=True)
    email = models.EmailField(max_length=100 , blank= True)
    archived = models.BooleanField(default= False)
    id_salesforce = models.CharField( max_length=200)

    def __str__(self):
        return self.nom_client
class EDIfile(models.Model):
    file = models.FileField(blank = False, null = False, upload_to=upload_to)
    created_at = models.DateTimeField(auto_now =True)
    status = models.CharField(max_length=200,default= 'En attente')
    wrong_commands = models.CharField(max_length=200, default="_")
    validated_orders = models.CharField(max_length=200, default="_")
    archived = models.BooleanField(default= False)
    cliqued = models.BooleanField(default= False)
    client = models.ForeignKey(Client,related_name='files', on_delete=models.CASCADE)
    def __str__(self):
        return os.path.basename(self.file.name)

class FileExcelContent:
    def __init__(self,columns,rows):
        self.columns = columns
        self.rows =rows



class Contact:
    def __init__(self, idContact : int, codeClient : str , nomClient: str , email : str , archived:  int):
        self.idContact = idContact
        self.codeClient = codeClient
        self.nomClient = nomClient
        self.email = email
        self.archived = archived




class FileInfo:
    def __init__(self,idFile : int ,fileName : str,createdAt :models.DateTimeField,status : str,wrongCommands : str,validatedOrders :str,archived : int,cliqued : int , contact : Contact ):
        self.idFile = idFile
        self.fileName = fileName
        self.createdAt = createdAt
        self.status = status
        self.wrongCommands =wrongCommands
        self.validatedOrders = validatedOrders
        self.archived = archived
        self.cliqued = cliqued
        self.contact = contact