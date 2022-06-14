from datetime import datetime
from .models import Facturation, FacturationHolidays, FacturationInfo, MatriceFacturation, MatriceFacturationInfo, Conditionnement
import pandas as pd
from django.db.models import Q

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

def getFacturationForMonth(code_client, mois):
    month = datetime.strptime(mois, "%m-%Y").date().strftime("%m")
    year = datetime.strptime(mois, "%m-%Y").date().strftime("%Y")
    #factList = Facturation.objects.filter(code_client = code_client, date__range = (date1,date2))
    factList = Facturation.objects.filter(code_client = code_client, date__month = month, date__year = year).order_by('date')
    listCritereMatrice= list()
    for critere in factList:
        critereResponse = FacturationInfo(date= critere.date, prep_jour=critere.prep_jour, UM_jour=critere.UM_jour,
                                  prep_nuit=critere.prep_nuit, UM_nuit=critere.UM_nuit,
                                 prep_province=critere.prep_province, UM_province=critere.UM_province,
                                  total_jour=critere.total_jour, total_nuit = critere.total_nuit , 
                                  total_province= critere.total_province, diff_jour=critere.diff_jour,
                                 diff_nuit = critere.diff_nuit , diff_province= critere.diff_province )
        listCritereMatrice.append(critereResponse)

    UMs = getUMForOnePrep(code_client)
    UMs["facture"]=listCritereMatrice
    return UMs
    
def getUMForOnePrep(code_client):
    unitéManut_jour = ""
    unitéManut_nuit = ""
    unitéManut_province = ""

    critere_jour = getMatriceForParam(code_client, "midi")
    if(not checkMatriceEmptyValues(critere_jour)):
        unitéManut_jour = getUM(1, critere_jour)

    critere_nuit = getMatriceForParam(code_client, "soir")
    if(not checkMatriceEmptyValues(critere_nuit)):
        unitéManut_nuit = getUM(1, critere_nuit)

    critere_province = getMatriceForParam(code_client, "province")
    if(not checkMatriceEmptyValues(critere_province)):
        unitéManut_province = getUM(1, critere_province)

    return {"facture":[],"UM_jour":unitéManut_jour, "UM_nuit":unitéManut_nuit,"UM_province":unitéManut_province}

def createFileFacturationFromColumnAndRows(columns, rows, fileName):
    df = pd.DataFrame(rows, columns=columns)
    df.to_excel(fileName, index=False)

def initializeValues(facturationDB):
    facturationDB.prep_jour = None
    facturationDB.prep_nuit = None
    facturationDB.prep_province = None
    facturationDB.UM_jour = None
    facturationDB.UM_nuit = None
    facturationDB.UM_province = None
    facturationDB.diff_jour =None
    facturationDB.diff_nuit =None
    facturationDB.diff_province =None
    facturationDB.total_jour = None
    facturationDB.total_nuit = None
    facturationDB.total_province = None

def calculateTotals(facturationDB,prep,code_client, date, facturationHolidays):
    initializeValues(facturationDB)
    if('prep_jour' in prep):
        facturationDB.prep_jour = prep['prep_jour']
        critere_jour = getMatriceForParam(code_client, "midi")
        if(checkMatriceEmptyValues(critere_jour)):
            return False
        total_jour = getFacturationTotal(prep['prep_jour'], critere_jour)
        total_jour = addMargeToTotalIfWeekend(total_jour, date, facturationHolidays)
        facturationDB.total_jour = total_jour
        facturationDB.diff_jour = 0
        facturationDB.UM_jour = getUM(prep['prep_jour'], critere_jour)
        if('UM_jour' in prep and facturationDB.UM_jour < float(prep['UM_jour'])):
            facturationDB.UM_jour = prep['UM_jour']
            total_jour, diff_jour = getFacturationTotalWithDepassement(prep['prep_jour'], critere_jour, prep['UM_jour'])
            total_jour = addMargeToTotalIfWeekend(total_jour, date, facturationHolidays)
            facturationDB.total_jour = total_jour
            facturationDB.diff_jour = diff_jour

    if('prep_nuit' in prep):
        facturationDB.prep_nuit = prep['prep_nuit']
        critere_nuit = getMatriceForParam(code_client, "soir")
        if(checkMatriceEmptyValues(critere_nuit)):
            return False
        total_nuit = getFacturationTotal(prep['prep_nuit'], critere_nuit)
        total_nuit = addMargeToTotalIfWeekend(total_nuit, date, facturationHolidays)
        facturationDB.total_nuit = total_nuit
        facturationDB.diff_nuit = 0
        facturationDB.UM_nuit = getUM(prep['prep_nuit'], critere_nuit)
        if('UM_nuit' in prep and facturationDB.UM_nuit < float(prep['UM_nuit'])):
            facturationDB.UM_nuit = prep['UM_nuit']
            total_nuit, diff_nuit = getFacturationTotalWithDepassement(prep['prep_nuit'], critere_nuit, prep['UM_nuit'])
            total_nuit = addMargeToTotalIfWeekend(total_nuit, date, facturationHolidays)
            facturationDB.total_nuit = total_nuit
            facturationDB.diff_nuit = diff_nuit
    

    if('prep_province' in prep):
        facturationDB.prep_province = prep['prep_province']
        critere_province = getMatriceForParam(code_client, "province")
        if(checkMatriceEmptyValues(critere_province)):
            return False

        total_province = getFacturationTotal(prep['prep_province'], critere_province)
        total_province = addMargeToTotalIfWeekend(total_province, date, facturationHolidays)
        facturationDB.total_province = total_province
        facturationDB.diff_province = 0
        facturationDB.UM_province = getUM(prep['prep_province'], critere_province)
        if('UM_province' in prep and facturationDB.UM_province < float(prep['UM_province'])):
            facturationDB.UM_province = prep['UM_province']
            total_province, diff_province = getFacturationTotalWithDepassement(prep['prep_province'], critere_province, prep['UM_province'])
            total_province = addMargeToTotalIfWeekend(total_province, date, facturationHolidays)
            facturationDB.total_province = total_province
            facturationDB.diff_province = diff_province
    return True

def addMargeToTotalIfWeekend(total, date, facturationHolidays):
    holidaysList = facturationHolidays.holidays.split(',')
    weekendsDaysList = facturationHolidays.weekends.split(',')
    for holiday in holidaysList:
        if (date == holiday) and (str(datetime.strptime(date, "%Y-%m-%d").date().weekday()) not in weekendsDaysList):
            total = total * (1 +facturationHolidays.marge /100)
    for weekend in weekendsDaysList:
        if int(weekend) == datetime.strptime(date, "%Y-%m-%d").date().weekday():
            total = total * (1 +facturationHolidays.marge /100)
    return(total)


def checkMatriceEmptyValues(criteres):
    try:
        bool = int(criteres["CHP"])+int(criteres["forfaitNbHeure"])+int(criteres["CHC"])+int(criteres["forfaitNbHeureCoord"])+float(criteres["marge"].replace(',','.'))+int(criteres["TP"])+int(criteres["productivite"])
    except Exception as e:
        return True
    return False

def getFacturationTotal(nbre_preparateur, criteres):
    unitéManut = getUM(nbre_preparateur, criteres)
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.'))/100)
    total = coutProdAvecMarge * unitéManut
    return total

def getFacturationTotalWithDepassement(nbre_preparateur, criteres, manutention_reel):
    unitéManut = getUM(nbre_preparateur, criteres)
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.'))/100)
    total = coutProdAvecMarge * float(manutention_reel)
    diff = total - (coutProdAvecMarge * unitéManut)
    return total, diff

def getUM(nbre_preparateur, criteres):
    unitéManut = ( int(nbre_preparateur) * int(criteres["TP"]) * 60 ) / int(criteres["productivite"])
    return unitéManut
    
def calculateAllFacturationsForAllClients():
    today = datetime.today()
    facturationDBList = Facturation.objects.filter(Q(date__month = today.month) | Q(date__month = today.month+1))
    for facturationDB in facturationDBList:
        recalculateTotal(facturationDB,FacturationHolidays.objects.get(id=1))
        facturationDB.save()

def CalculRealUM(excelfile: pd.DataFrame):
    df = excelfile.fillna('')
    df["TYPE_COND"] = ""
    df["QTE_BD"] = ""
    df["UM"] = ""
    print(df.columns.values)
    somme_UM = 0
    for row in df.values:
        list_article = Conditionnement.objects.filter(CODE_ARTICLE = row[0])
        if(len(list_article) == 1):
            row[2] = list_article[0].TYPE_COND
        elif(len(list_article) > 1):
            for element in list_article:
                if(element.QTE <= row[1] and row[1]%element.QTE == 0):
                    row[2] = element.TYPE_COND
                    row[3] = element.QTE
                try:
                    row[4] = row[1] / row[3]
                except Exception: 
                    continue
        if(row[4] != ''):
            somme_UM += row[4]
        print(row)
    print(somme_UM)
    return somme_UM

def recalculateTotal(facturationDB, facturationHolidays):
    #initializeValues(facturationDB)
    critere_jour = getMatriceForParam(facturationDB.code_client, "midi")
    if(not checkMatriceEmptyValues(critere_jour)):
        if(facturationDB.prep_jour != None):
            total_jour, diff_jour = getFacturationTotalWithDepassement(facturationDB.prep_jour, critere_jour, facturationDB.UM_jour)
            total_jour = addMargeToTotalIfWeekend(total_jour, str(facturationDB.date)[0:10], facturationHolidays)
            facturationDB.total_jour = total_jour
            facturationDB.diff_jour = diff_jour

    critere_nuit = getMatriceForParam(facturationDB.code_client, "soir")
    if(not checkMatriceEmptyValues(critere_nuit)):
        if(facturationDB.prep_nuit != None):
            total_nuit, diff_nuit = getFacturationTotalWithDepassement(facturationDB.prep_nuit, critere_nuit, facturationDB.UM_nuit)
            total_nuit = addMargeToTotalIfWeekend(total_nuit, str(facturationDB.date)[0:10], facturationHolidays)
            facturationDB.total_nuit = total_nuit
            facturationDB.diff_nuit = diff_nuit

    critere_province = getMatriceForParam(facturationDB.code_client, "province")
    if(not checkMatriceEmptyValues(critere_province)):
        if(facturationDB.prep_province != None):
            total_province, diff_province = getFacturationTotalWithDepassement(facturationDB.prep_province, critere_province, facturationDB.UM_province)
            total_province = addMargeToTotalIfWeekend(total_province, str(facturationDB.date)[0:10], facturationHolidays)
            facturationDB.total_province = total_province
            facturationDB.diff_province = diff_province
