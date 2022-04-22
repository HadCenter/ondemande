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
    date = models.DateField(unique=True)
    prep_jour = models.IntegerField()
    UM_jour = models.IntegerField()
    prep_nuit = models.IntegerField()
    UM_nuit = models.IntegerField()
    prep_province = models.IntegerField()
    UM_province = models.IntegerField()
    total_jour = models.FloatField(max_length=45)
    total_nuit = models.FloatField(max_length=45)
    total_province = models.FloatField(max_length=45)
    diff_jour = models.FloatField(max_length=45)
    diff_nuit = models.FloatField(max_length=45)
    diff_province = models.FloatField(max_length=45)

    class Meta:
        managed = False
        db_table = 'facturation_preparation'

class FacturationInfo:
    def __init__(self,date: Date, prep_jour : int , UM_jour:int, prep_nuit: int,UM_nuit:int, prep_province: int, UM_province: int, total_jour: str, total_nuit:str, total_province:str,diff_jour: str, diff_nuit:str, diff_province:str):
        self.date = date
        self.prep_jour = prep_jour
        self.UM_jour = UM_jour
        self.prep_nuit = prep_nuit
        self.UM_nuit = UM_nuit
        self.prep_province = prep_province
        self.UM_province = UM_province
        self.total_jour = total_jour
        self.total_nuit = total_nuit
        self.total_province = total_province
        self.diff_jour = diff_jour
        self.diff_nuit = diff_nuit
        self.diff_province = diff_province
        
class Conditionnement(models.Model):
    ID_CND = models.IntegerField(primary_key=True)
    CODE_SOC = models.CharField(max_length=45)
    TYPE_COND = models.IntegerField()
    CODE_ARTICLE = models.CharField(max_length=45)
    QTE = models.FloatField(max_length=45)
    class Meta:
        managed = False
        db_table = 'conditionnement'

class FacturationHolidays(models.Model):
    id = models.IntegerField(primary_key=True)
    marge = models.IntegerField()
    weekends = models.CharField(max_length=45)
    holidays = models.CharField(max_length=200)
    class Meta:
        managed = False
        db_table = 'Facturation_holidays'
