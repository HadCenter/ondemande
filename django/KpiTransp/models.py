from django.db import models
import os
from datetime import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

# Create your models here.
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from websocket.consumers import ChatConsumer

class KPI_HT_TRANS(models.Model):
    id = models.IntegerField(primary_key=True)
    date = models.DateField(null= True)
    prix_HT =  models.CharField(max_length=200, blank=True, null= True)
    is_deleted = models.BooleanField(null= True)
    type_service =  models.CharField(max_length=200, blank=True, null= True)

    def __str__(self):
        return self.prix_HT
