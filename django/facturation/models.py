from MySQLdb import Date
from django.db import models


# Create your models here.
class MatriceFacturation(models.Model):
    id = models.IntegerField(primary_key=True)
    code_client = models.CharField(max_length=45)
    nom_client = models.CharField(max_length=45)
    param = models.CharField(max_length=45)
    key = models.CharField(max_length=45)
    value = models.CharField(max_length=45)
    class Meta:
        managed = False
        db_table = 'matrice_facturation_preparation'

class MatriceFacturationInfo:
    def __init__(self, id : int, code_client: str, nom_client : str , param: str, key: int, value: str):
        self.id = id
        self.code_client = code_client
        self.nom_client = nom_client
        self.param = param
        self.key = key
        self.value = value

class MatriceFacturationByParam:
    def __init__(self, id : int, code_client: str, nom_client : str , param: str, key: int, value: str):
        self.id = id
        self.code_client = code_client
        self.nom_client = nom_client
        self.param = param
        self.key = key
        self.value = value

class Facturation(models.Model):
    id = models.IntegerField(primary_key=True)
    code_client = models.CharField(max_length=45)
    nom_client = models.CharField(max_length=45)
    date = models.DateTimeField(unique=True)
    prep_jour = models.IntegerField()
    prep_nuit = models.IntegerField()
    prep_province = models.IntegerField()
    total_jour = models.FloatField(max_length=45)
    total_nuit = models.FloatField(max_length=45)
    total_province = models.FloatField(max_length=45)
    class Meta:
        managed = False
        db_table = 'facturation_preparation'

class FacturationInfo:
    def __init__(self,date: Date, code_client: str, prep_jour : int , prep_nuit: int, prep_province: int, total_jour: str, total_nuit:str, total_province:str):
        self.date = date
        self.code_client = code_client
        self.prep_jour = prep_jour
        self.prep_nuit = prep_nuit
        self.prep_province = prep_province
        self.total_jour = total_jour
        self.total_nuit = total_nuit
        self.total_province = total_province
