from datetime import datetime
from .models import Facturation, FacturationInfo, MatriceFacturation, MatriceFacturationInfo
from django.db.models import Sum

def getAllClientsinDB():
    clientList = MatriceFacturation.objects.all()
    ResponseList = []
    temporaryList=[]
    for client in clientList:
        if(client.nom_client not in temporaryList):
            temporaryList.append(client.nom_client)
            ResponseList.append({"nom_client":client.nom_client, "code_client":client.code_client})
    return ResponseList

def getMatriceForParam(code_client: str, param : str):
    criteresList = MatriceFacturation.objects.filter(code_client = code_client,param = param)
    diction = {}
    for critere in criteresList:
        diction['param']=param
        diction['nom_client']=critere.nom_client
        diction[critere.key]= critere.value
    return diction

def getMatriceForClient(code_client: str):
    criteresList = MatriceFacturation.objects.filter(code_client = code_client)
    params = []
    for critere in criteresList:
        if(critere.param not in params):
            params.append(critere.param)

    matriceList = []
    for param in params:
        matriceList.append(getMatriceForParam(code_client,param))
    return matriceList


def getMatrice(param : str):
    criteresList = MatriceFacturation.objects.filter(param = param)
    listCritereMatrice= list()
    for critere in criteresList:
        critereResponse = MatriceFacturationInfo(id=critere.id, code_client=critere.code_client,
                                 nom_client=critere.nom_client, param=critere.param,
                                 key=critere.key, value=critere.value )
        listCritereMatrice.append(critereResponse)
    return listCritereMatrice

def getFacturationForDateRange(code_client, mois):
    month = datetime.strptime(mois, "%m-%Y").date().strftime("%m")
    year = datetime.strptime(mois, "%m-%Y").date().strftime("%Y")
    #factList = Facturation.objects.filter(code_client = code_client, date__range = (date1,date2))
    factList = Facturation.objects.filter(code_client = code_client, date__month = month, date__year = year).order_by('date')
    listCritereMatrice= list()
    for critere in factList:
        critereResponse = FacturationInfo(date= critere.date, code_client=critere.code_client,
                                 prep_jour=critere.prep_jour, prep_nuit=critere.prep_nuit,
                                 prep_province=critere.prep_province, total_jour=critere.total_jour,
                                 total_nuit = critere.total_nuit , total_province= critere.total_province )
        listCritereMatrice.append(critereResponse)
    return listCritereMatrice

def getMonthsFacturationForClient(code_client):
    factList = Facturation.objects.filter(code_client = code_client).order_by('date')
    somme_fact = Facturation.objects.values('date').order_by('date').annotate(total_price=Sum('total_jour'))
    nom_client = ""
    if(len(factList)>0):
        nom_client = factList[0].nom_client
    listMonths= list()
    sum_month = list() 
    for critere in factList:
        somme = 0
        if(critere.date.strftime("%m-%Y") not in listMonths):
            listMonths.append(critere.date.strftime("%m-%Y"))
    return nom_client,listMonths
