import os
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from core.models import AccountsAccount

# Create your models here.

class EmbedConfig:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    tokenId = None
    accessToken = None
    tokenExpiry = None
    reportConfig = None

    def __init__(self, token_id, access_token, token_expiry, report_config):
        self.tokenId = token_id
        self.accessToken = access_token
        self.tokenExpiry = token_expiry
        self.reportConfig = report_config

class EmbedToken:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    tokenId = None
    token = None
    tokenExpiry = None

    def __init__(self, token_id, token, token_expiry):
        self.tokenId = token_id
        self.token = token
        self.tokenExpiry = token_expiry

class EmbedTokenRequestBody:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    datasets = None
    reports = None
    targetWorkspaces = None

    def __init__(self):
        self.datasets = []
        self.reports = []
        self.targetWorkspaces = []

class ReportConfig:

    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    reportId = None
    reportName = None
    embedUrl = None
    datasetId = None

    def __init__(self, report_id, report_name, embed_url, dataset_id = None):
        self.reportId = report_id
        self.reportName = report_name
        self.embedUrl = embed_url
        self.datasetId = dataset_id

class EmbedTokenRequestBody:
    
    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    datasets = None
    reports = None
    targetWorkspaces = None

    def __init__(self):
        self.datasets = []
        self.reports = []
        self.targetWorkspaces = []


class EmbedToken:
    
    # Camel casing is used for the member variables as they are going to be serialized and camel case is standard for JSON keys

    tokenId = None
    token = None
    tokenExpiry = None

    def __init__(self, token_id, token, token_expiry):
        self.tokenId = token_id
        self.token = token
        self.tokenExpiry = token_expiry

class PowerBiRTLog(models.Model):
    id = models.IntegerField(primary_key=True)
    id_admin = models.IntegerField()
    status = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now =True)
    class Meta:
        managed = False
        db_table = 'powerbi_rt_log'


@receiver(post_save, sender=PowerBiRTLog)
def send_message_to_frontend_when_powerbi_updated(sender, instance=None, created=False, **kwargs):
    if created:
        messageToSend = {        
            "stateEdi": "table ediFile not updated",
            "stateTransaction" : "table transactionFile not updated",
            "stateLogistic" : "table logisticFile not updated",
            "statePowerbi": "table powerbirtlog updated"
        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room_group',
            {
                'type': 'send_message_to_frontend',
                'message': messageToSend
            }
        )
