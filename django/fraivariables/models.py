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

class Carburant(models.Model):
    id = models.IntegerField(primary_key=True)
    code_Carburant = models.CharField(max_length=200, blank=True, null= True)
    type_Carburant = models.CharField(max_length=200, blank=True, null= True)
    dateupdate = models.DateField(null= True)
    prix_essence =  models.CharField(max_length=200, blank=True, null= True)
    prix_Diesel =  models.CharField(max_length=200, blank=True, null= True)
    prix_Gaz =  models.CharField(max_length=200, blank=True, null= True)
    is_deleted = models.BooleanField()
    is_active = models.BooleanField()

    def __str__(self):
        return self.type_Carburant
class Pneumatique(models.Model):
    id = models.IntegerField(primary_key=True)
    code_Pneumatique = models.CharField(max_length=200, blank=True, null= True)
    dateupdate = models.DateField(null= True)
    prix_Pneumatique =  models.CharField(max_length=200, blank=True, null= True)
    is_deleted = models.BooleanField()
    is_active = models.BooleanField()

    def __str__(self):
        return self.prix_Pneumatique
# Create your models here.
class Entretien(models.Model):
    id = models.IntegerField(primary_key=True)
    code_Entretien = models.CharField(max_length=200, blank=True, null= True)
    dateupdate = models.DateField(null= True)
    prix_entretien =  models.CharField(max_length=200, blank=True, null= True)
    is_deleted = models.BooleanField()
    is_active = models.BooleanField()

    def __str__(self):
        return self.prix_entretien
class IndiceCarburant(models.Model):
    code_IndiceCarburant = models.CharField(max_length=200, blank=True, null= True)
    dateupdate = models.DateField(null= True)
    prix_IndiceCarburant =  models.CharField(max_length=200, blank=True, null= True)
    is_deleted = models.BooleanField()
    is_active = models.BooleanField()

    def __str__(self):
        return self.prix_IndiceCarburant