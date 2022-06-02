from django.db import models
import os
from django.db.models.signals import post_save
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

# Create your models here.
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from websocket.consumers import ChatConsumer


def upload_to(instance, filename):
    return 'files/{filename}'.format(filename=filename)

class Client(models.Model):
    code_client = models.CharField(max_length=200, blank=True, null= True)
    nom_client = models.CharField(max_length=200, blank=True, null= True)
    email = models.EmailField(max_length=100 , blank= True, null= True)
    archived = models.BooleanField(default= False)
    id_salesforce = models.CharField( max_length=200, blank=True, null= True)
    token = models.CharField( max_length=250,blank=True, null=True)
    token_for_flux = models.CharField( max_length=250,blank=True, null=True)

    def __str__(self):
        return self.nom_client
class EDIfile(models.Model):
    file = models.FileField(blank = False, null = False, upload_to=upload_to)
    created_at = models.DateTimeField(auto_now_add =True)
    status = models.CharField(max_length=200,default= 'En attente')
    wrong_commands = models.CharField(max_length=200, default="_")
    validated_orders = models.CharField(max_length=200, default="_")
    archived = models.BooleanField(default= False)
    cliqued = models.BooleanField(default= False)
    sendedToUrbantz = models.BooleanField(default=False)
    client = models.ForeignKey(Client,related_name='files', on_delete=models.CASCADE, default=1)
    number_correct_commands = models.IntegerField(default=0)
    number_wrong_commands = models.IntegerField(default=0)
    def __str__(self):
        return os.path.basename(self.file.name)

# @receiver(post_save, sender=EDIfile)
# def set_active_from_on_create(sender, instance, created, **kwargs):
#     if created is True:
#         instance.created_at = datetime.now()

class LogisticFile(models.Model):
    logisticFile = models.FileField(blank = False, null = False)
    logisticFileType = models.CharField(max_length=200, blank=True, null= True)
    created_at = models.DateTimeField(auto_now_add =True)
    status = models.CharField(max_length=200,default= 'En attente')
    number_annomalies = models.IntegerField(default=0)
    clientName = models.CharField(max_length=200)
    archived = models.BooleanField(default=False)
    ButtonCorrecteActiveted = models.BooleanField(default=False)
    ButtonValidateActivated = models.BooleanField(default=True)
    ButtonInvalidateActivated = models.BooleanField(default=False)
    def __str__(self):
        return os.path.basename(self.logisticFile.name)

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

class LogisticFileInfo:
    def __init__(self, idLogisticFile : int, logisticFileName: str, createdAt: models.DateTimeField, logisticFileType : str , status: str, number_annomalies: int, clientName: str, archived: int, ButtonCorrecteActiveted: int, ButtonValidateActivated: int, ButtonInvalidateActivated: int):
        self.idLogisticFile = idLogisticFile
        self.logisticFileName = logisticFileName
        self.createdAt = createdAt
        self.logisticFileType = logisticFileType
        self.status = status
        self.number_annomalies = number_annomalies
        self.clientName = clientName
        self.archived = archived
        self.ButtonCorrecteActiveted = ButtonCorrecteActiveted
        self.ButtonValidateActivated = ButtonValidateActivated
        self.ButtonInvalidateActivated = ButtonInvalidateActivated


class FileInfo:
    def __init__(self, idFile: int, fileName: str, createdAt: models.DateTimeField, status: str, wrongCommands: str, validatedOrders: str, archived: int, cliqued: int, contact: Contact, number_wrong_commands: int, number_correct_commands: int, sendedToUrbantz: int):
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
        self.sendedToUrbantz = sendedToUrbantz


class AnomaliesEdiFileAnnuaire(models.Model):
    id_anomalie = models.AutoField(primary_key=True)
    label = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'anomalies_edi_file_annuaire'

class HistoryAnomaliesEdiFiles(models.Model):
    edi_file = models.ForeignKey(EDIfile ,db_column="edi_file_id", on_delete= models.CASCADE )
    execution_time = models.DateTimeField(auto_now =True)
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

class getNumberOfAnomaliesPerDateDTO:
    def __init__(self,date,numberOfAnomalies):
        self.date= date
        self.numberOfAnomalies = numberOfAnomalies

class getNumberOfAnomaliesWithFiltersDTO:
    def __init__(self,mapIdToNumberOfAnomalies,mapDateToNumberOfAnomalies):
        self.mapIdToNumberOfAnomalies = mapIdToNumberOfAnomalies
        self.mapDateToNumberOfAnomalies = mapDateToNumberOfAnomalies

class AllMadFileContent:
    def __init__(self,livraison,exception,metadata,mad):
        self.livraison = livraison
        self.exception = exception
        self.metadata = metadata
        self.mad = mad

class AccountsAccount(models.Model):
    password = models.CharField(max_length=128)
    email = models.CharField(unique=True, max_length=254)
    username = models.CharField(max_length=255)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    role = models.CharField(max_length=200)
    is_superuser = None
    last_login = None

    class Meta:
        managed = False
        db_table = 'accounts_account'


class InterventionAdmin(models.Model):
    id = models.IntegerField(primary_key=True)
    id_admin = models.ForeignKey(AccountsAccount ,db_column="id_admin", on_delete= models.DO_NOTHING )
    id_file_edi = models.ForeignKey(EDIfile ,db_column="id_file_edi", on_delete= models.CASCADE )
    execution_time = models.DateTimeField(auto_now =True)

    class Meta:
        managed = False
        db_table = 'intervention_admin'


class kpi4WithFiltersDto:
    def __init__(self,date,fileName,clientName,AdminName):
        self.date = date
        self.fileName = fileName
        self.clientName = clientName
        self.AdminName = AdminName

class kpi2WithFiltersDto:
    def __init__(self,date,fileName,clientName):
        self.date = date
        self.fileName = fileName
        self.clientName = clientName




class transactionFileColumnsException:
    def __init__(self, Tournee, taskId, itemId,Date,Expediteur,Activite,Categorie,Type_de_Service,ID_de_la_tache,Item___Nom,Item___Type,Item___Quantite,Code_postal,Round_Name,Express,Remarque,isDeleted,Contact, billingRoundName):
        self.Tournee = Tournee
        self.taskId = taskId
        self.itemId = itemId
        self.Date = Date
        self.Expediteur = Expediteur
        self.Activite = Activite
        self.Categorie = Categorie
        self.Type_de_Service = Type_de_Service
        self.ID_de_la_tache = ID_de_la_tache
        self.Item___Nom = Item___Nom
        self.Item___Type = Item___Type
        self.Item___Quantite = Item___Quantite
        self.Code_postal = Code_postal
        self.Round_Name = Round_Name
        self.Express = Express
        self.Remarque = Remarque
        self.isDeleted = isDeleted
        self.Contact = Contact
        self.billingRoundName = billingRoundName
class transactionFileColumnsLivraison:
    def __init__(self,Tournee,taskId,itemId,Date,Expediteur,Activite,Categorie,Type_de_Service,ID_de_la_tache,Item___Nom_sous_categorie,Item___Type_unite_manutention,Item___Quantite,Code_postal,total_price,Round_Name,sourceHubName,isExpress,toDelete,Contact,billingRoundName):
        self.Tournee = Tournee
        self.taskId = taskId
        self.itemId = itemId
        self.Date = Date
        self.Expediteur = Expediteur
        self.Activite = Activite
        self.Categorie = Categorie
        self.Type_de_Service = Type_de_Service
        self.ID_de_la_tache = ID_de_la_tache
        self.Item___Nom_sous_categorie = Item___Nom_sous_categorie
        self.Item___Type_unite_manutention = Item___Type_unite_manutention
        self.Item___Quantite = Item___Quantite
        self.Code_postal = Code_postal
        self.total_price = total_price
        self.Round_Name = Round_Name
        self.sourceHubName = sourceHubName
        self.isExpress = isExpress
        self.toDelete = toDelete
        self.Contact = Contact
        self.billingRoundName = billingRoundName
class transactionFileColumnsMetadata:
    def __init__(self,Tournee,taskId,itemId,Date,Expediteur,Activite,Categorie,Type_de_Service,ID_de_la_tache,Item___Nom_sous_categorie,Item___Type_unite_manutention,Item___Quantite,Code_postal,sourceHubName,Round_Name,sourceClosureDate,realInfoHasPrepared,status,metadataFACTURATION):
        self.Tournee = Tournee
        self.taskId = taskId
        self.itemId = itemId
        self.Date = Date
        self.Expediteur = Expediteur
        self.Activite = Activite
        self.Categorie = Categorie
        self.Type_de_Service = Type_de_Service
        self.ID_de_la_tache = ID_de_la_tache
        self.Item___Nom_sous_categorie = Item___Nom_sous_categorie
        self.Item___Type_unite_manutention = Item___Type_unite_manutention
        self.Item___Quantite = Item___Quantite
        self.Code_postal = Code_postal
        self.sourceHubName = sourceHubName
        self.Round_Name = Round_Name
        self.sourceClosureDate = sourceClosureDate
        self.realInfoHasPrepared = realInfoHasPrepared
        self.status = status
        self.metadataFACTURATION = metadataFACTURATION
class transactionFileColumnsMad:
    def __init__(self,Tournee,taskId,itemId,Date,Expediteur,Activite,Categorie,Type_de_Service,ID_de_la_tache,Item___Nom_sous_categorie,Item___Type_unite_manutention,Item___Quantite,Code_postal,sourceHubName,Round_Name,toDelete,StartTime,ClousureTime):
        self.Tournee = Tournee
        self.taskId = taskId
        self.itemId = itemId
        self.Date = Date
        self.Expediteur = Expediteur
        self.Activite = Activite
        self.Categorie = Categorie
        self.Type_de_Service = Type_de_Service
        self.ID_de_la_tache = ID_de_la_tache
        self.Item___Nom_sous_categorie = Item___Nom_sous_categorie
        self.Item___Type_unite_manutention = Item___Type_unite_manutention
        self.Item___Quantite = Item___Quantite
        self.Code_postal = Code_postal
        self.sourceHubName = sourceHubName
        self.Round_Name = Round_Name
        self.toDelete = toDelete
        self.StartTime = StartTime
        self.ClousureTime = ClousureTime


class TransactionFileContentAndOptions:
    def __init__(self,fileContent,options):
        self.fileContent = fileContent
        self.options = options

@receiver(post_save, sender=EDIfile)
def send_message_to_frontend_when_edifile_updated(sender, instance=None, created=False, **kwargs):
    if not created:
        messageToSend = {
            "stateEdi": "table ediFile updated",
            "stateTransaction" : "table transactionFile not updated",
            "stateLogistic": "table logisticFile not updated",
            "statePowerbi": "table powerbirtlog not updated"
        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room_group',
            {
                'type': 'send_message_to_frontend',
                'message': messageToSend
            }
        )
@receiver(post_save, sender=LogisticFile)
def send_message_to_frontend_when_logisticfile_updated(sender, instance=None, created=False, **kwargs):
    if not created:
        messageToSend = {
            "stateEdi": "table ediFile not updated",
            "stateTransaction" : "table transactionFile not updated",
            "stateLogistic": "table logisticFile updated",
            "statePowerbi": "table powerbirtlog not updated"
        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room_group',
            {
                'type': 'send_message_to_frontend',
                'message': messageToSend
            }
        )
