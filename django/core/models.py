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
    token = models.CharField( max_length=250,blank=True, null=True)

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
    client = models.ForeignKey(Client,related_name='files', on_delete=models.CASCADE, default=1)
    number_correct_commands = models.IntegerField(default=0)
    number_wrong_commands = models.IntegerField(default=0)
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
    def __init__(self,idFile : int ,fileName : str,createdAt :models.DateTimeField,status : str,wrongCommands : str,validatedOrders :str,archived : int,cliqued : int , contact : Contact ,  number_wrong_commands : int , number_correct_commands : int  ):
        self.idFile = idFile
        self.fileName = fileName
        self.createdAt = createdAt
        self.status = status
        self.wrongCommands =wrongCommands
        self.validatedOrders = validatedOrders
        self.archived = archived
        self.cliqued = cliqued
        self.contact = contact
        self.number_wrong_commands = number_wrong_commands
        self.number_correct_commands = number_correct_commands


class AnomaliesEdiFileAnnuaire(models.Model):
    id_anomalie = models.AutoField(primary_key=True)
    label = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'anomalies_edi_file_annuaire'

class HistoryAnomaliesEdiFiles(models.Model):
    edi_file = models.ForeignKey(EDIfile ,db_column="edi_file_id", on_delete= models.DO_NOTHING )
    execution_time = models.DateTimeField(blank=True, null=True)
    anomalie = models.ForeignKey(AnomaliesEdiFileAnnuaire,db_column="anomalie_id",on_delete=models.DO_NOTHING , blank=True, null=True)
    number_of_anomalies = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'history_anomalies_edi_files'

class kpi3SchemaSingleAnomalie :
    def __init__(self,anomalie_id,number_of_anomalies,execution_time,edi_file_id,client_id,client_name,client_code, anomalie_name , edi_file_name):
        self.anomalie_id = anomalie_id
        self.number_of_anomalies = number_of_anomalies
        self.execution_time = execution_time
        self.edi_file_id = edi_file_id
        self.client_id = client_id
        self.client_name = client_name
        self.client_code = client_code
        self.anomalie_name = anomalie_name
        self.edi_file_name = edi_file_name