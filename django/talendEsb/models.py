from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
# Create your models here.

class SendMadPostProcessPostObject:
    def __init__(self,transaction_id,end_date_plus_one,start_date,jobs_to_start):
        self.transaction_id = transaction_id
        self.end_date_plus_one = end_date_plus_one
        self.start_date = start_date
        self.jobs_to_start = jobs_to_start

class TransactionsLivraisonMadDto:
    def __init__(self,transaction_id,start_date,end_date,statut,fichier_livraison_sftp,fichier_exception_sftp,fichier_metadata_sftp,fichier_mad_sftp,created_at):
        self.transaction_id = transaction_id
        self.start_date = start_date
        self.end_date = end_date
        self.statut = statut
        self.fichier_livraison_sftp = fichier_livraison_sftp
        self.fichier_exception_sftp = fichier_exception_sftp
        self.fichier_metadata_sftp = fichier_metadata_sftp
        self.fichier_mad_sftp = fichier_mad_sftp
        self.created_at = created_at


class TransactionsLivraison(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    statut = models.CharField(max_length=45, blank=True, null=True)
    fichier_livraison_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_exception_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_metadata_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_mad_sftp = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'transactions_livraison'


class RabbitMqMessagesForJobToStart:
    def __init__(self,webhook,payloadToSendToTalend,environnement):
        self.webhook = webhook
        self.payloadToSendToTalend = payloadToSendToTalend
        self.environnement = environnement

@receiver(post_save, sender=TransactionsLivraison)
def send_message_to_frontend_when_transactionFile_updated(sender, instance=None, created=False, **kwargs):
    if not created:
        messageToSend = {
            "stateEdi": "table ediFile not updated",
            "stateTransaction" : "table transactionFile updated",
            "stateLogistic": "table logisticFile not updated"
        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room_group',
            {
                'type': 'send_message_to_frontend',
                'message': messageToSend
            }
        )
