from calendar import week
from csv import excel
from datetime import datetime
from fileinput import filename
import os
from tkinter.ttk import Separator
import pandas as pd 
from core.models import Client
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view

from core.ediFileService import connect


from .facturationService import getFacturationForMonth, getMatriceForClient, getMatriceForParam, getAllClientsinDB, getMonthsFacturationForClient

from .models import Conditionnement, FacturationHolidays, MatriceFacturation, Facturation
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR

# Create your views here.


@api_view(['GET'])
def getListClient(request):
    listClient = getAllClientsinDB()
    return HttpResponse(jsonpickle.encode(listClient, unpicklable=False), content_type="application/json")




@api_view(['POST'])
def updateMatriceForClient(request):
    try:
        param = request.data['param']
        code_client = request.data['code_client']
        keys= request.data['keys']
        values = request.data['values']
    except Exception:
        return JsonResponse({'message': 'Body parametres are empty or incorrect'}, status=status.HTTP_403_FORBIDDEN)

    for idx, key in enumerate(keys):
        try:
            critere = MatriceFacturation.objects.get(param = param, code_client = code_client, key = key)
            critere.value = values[idx]
            critere.save() 
        except Exception as e:
            if ( "matching query does not exist." in str(e)):
                critere = MatriceFacturation()
                critere.code_client = code_client
                try:
                    critere.nom_client = Client.objects.get(code_client=code_client).nom_client
                except Exception as e:
                    return JsonResponse({'message': 'client introuvable'}, status=status.HTTP_400_BAD_REQUEST)

                critere.param = param
                critere.key = key
                critere.value = values[idx]
                critere.save() 

    return JsonResponse({'message': 'updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def updateAllMatriceForClient(request):
    try:
        parameters : list = []
        params = request.data['param']
        code_client = request.data['code_client']
        keys= request.data['keys']
        for i,param in enumerate(params):
            parameters.append(request.data[param])
    except Exception as e:
        print(e)
        return JsonResponse({'message': 'Body parametres are empty or incorrect'}, status=status.HTTP_403_FORBIDDEN)

    for i,param in enumerate(params):
        for idx, key in enumerate(keys):
            try:
                critere = MatriceFacturation.objects.get(param = params[i], code_client = code_client, key = key)
                critere.value = parameters[i][idx]
                critere.save() 
            except Exception as e:
                if ( "matching query does not exist." in str(e)):
                    critere = MatriceFacturation()
                    critere.code_client = code_client
                    try:
                        critere.nom_client = Client.objects.get(code_client=code_client).nom_client
                    except Exception as e:
                        return JsonResponse({'message': 'client introuvable'}, status=status.HTTP_400_BAD_REQUEST)

                    critere.param = param
                    critere.key = key
                    critere.value = parameters[i][idx]
                    critere.save() 

    return JsonResponse({'message': 'updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def updateAllMatriceForClientV2(request):
    try:
        params = request.data['parameters']
        code_client = request.data['code_client']
    except Exception as e:
        print(e)
        return JsonResponse({'message': 'Body parametres are empty or incorrect'}, status=status.HTTP_403_FORBIDDEN)

    for element in params:
        element.pop("nom_client", None)
        param = element.pop("param",None)
        for key in element:
            try:
                critere = MatriceFacturation.objects.get(param = param, code_client = code_client, key = key)
                critere.value = element[key]
                critere.save() 
            except Exception as e:
                if ( "matching query does not exist." in str(e)):
                    critere = MatriceFacturation()
                    critere.code_client = code_client
                    try:
                        critere.nom_client = Client.objects.get(code_client=code_client).nom_client
                    except Exception as e:
                        return JsonResponse({'message': 'client introuvable'}, status=status.HTTP_400_BAD_REQUEST)

                    critere.param = param
                    critere.key = key
                    critere.value = element[key]
                    critere.save() 
    return JsonResponse({'message': 'updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def getMatriceByParam(request):
    param = request.data['param']
    code_client = request.data['code_client']
    criteres = getMatriceForParam(code_client, param)
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client or param not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(criteres, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def getMatriceByClient(request):
    code_client = request.data['code_client']
    criteres = getMatriceForClient(code_client)
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(criteres, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def caculateFacturationForClient(request):
    param = request.data['param']
    code_client = request.data['code_client']
    nbre_preparateur = request.data['nbre_preparateur']
    criteres = getMatriceForParam(code_client, param)

    unitéManut = ( int(nbre_preparateur) * int(criteres['TP']) * 60 ) / int(criteres["productivite"])
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.'))/100)
    total = coutProdAvecMarge * unitéManut
    #unitéManut = ((int(nbre_preparateur) * int(criteres["CHP"]) * criteres["forfaitNbHeure"]) + (criteres["CHC"] * criteres["forfaitNbHeureCoord"]))/ (1-criteres["marge"]/100)
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client or param not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def caculateFacturationByUnite(request):
    param = request.data['param']
    code_client = request.data['code_client']
    nbre_preparateur = request.data['nbre_preparateur']
    manutention_reel = request.data['manutention']

    criteres = getMatriceForParam(code_client, param)

    unitéManut = ( int(nbre_preparateur) * int(criteres['TP']) * 60 ) / int(criteres["productivite"])
    if(manutention_reel < unitéManut):
        return JsonResponse({'message': 'unité manutention doivent être sup à unité manut pour le nbre prepateur indiqué.'}, status=status.HTTP_404_NOT_FOUND)
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.'))/100)
    total = coutProdAvecMarge * manutention_reel
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client or param not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def caculateFacturationByDate(request):
    total = 0
    untreatedFacturation = Facturation.objects.filter(total_jour=None)
    for fact in untreatedFacturation:
        if(fact.prep_jour != None):
            criteres = getMatriceForParam(fact.code_client, "midi")
            total = getFacturationTotal(fact.prep_jour, criteres)
            fact.total_jour = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter( total_nuit=None)
    for fact in untreatedFacturation:
        if(fact.prep_nuit != None):
            criteres = getMatriceForParam(fact.code_client, "soir")
            total = getFacturationTotal(fact.prep_nuit, criteres)
            fact.total_nuit = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter(total_province = None)
    for fact in untreatedFacturation:
        if(fact.prep_province != None):
            criteres = getMatriceForParam(fact.code_client, "province")
            total = getFacturationTotal(fact.prep_province, criteres)
            fact.total_province = total
            fact.save()

    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")

def calculateMonthFacturationForClient(code_client):
    total = 0
    untreatedFacturation = Facturation.objects.filter(code_client = code_client, date__lt=None)
    for fact in untreatedFacturation:
        if(fact.prep_jour != None):
            criteres = getMatriceForParam(fact.code_client, "midi")
            total = getFacturationTotal(fact.prep_jour, criteres)
            fact.total_jour = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter( total_nuit=None)
    for fact in untreatedFacturation:
        if(fact.prep_nuit != None):
            criteres = getMatriceForParam(fact.code_client, "soir")
            total = getFacturationTotal(fact.prep_nuit, criteres)
            fact.total_nuit = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter(total_province = None)
    for fact in untreatedFacturation:
        if(fact.prep_province != None):
            criteres = getMatriceForParam(fact.code_client, "province")
            total = getFacturationTotal(fact.prep_province, criteres)
            fact.total_province = total
            fact.save()

    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")

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

@api_view(['POST'])
def addFacturation(request):
    preparations = request.data['preparations']
    facturationHolidays = FacturationHolidays.objects.get(id=1)

    for prep in preparations:
        code_client = prep['code_client']
        facturationDB = Facturation()
        facturationDB.code_client = code_client
        facturationDB.nom_client = Client.objects.get(code_client=code_client).nom_client
        facturationDB.date = prep['date']
        calculateTotals(facturationDB,prep,code_client, prep['date'], facturationHolidays)
        
        try:
            facturationDB.save()
        except Exception as e:
            print(e)
            #the below code allow backend to modify inserted preparations
            facturationDB = Facturation.objects.get(date= prep['date'], code_client=code_client)
            calculateTotals(facturationDB,prep,code_client, prep['date'], facturationHolidays)
            facturationDB.save()

    return JsonResponse({'message': 'added successfully'}, status=status.HTTP_200_OK)

def calculateTotals(facturationDB,prep,code_client, date, facturationHolidays):
    if('prep_jour' in prep):
        facturationDB.prep_jour = prep['prep_jour']
        critere_jour = getMatriceForParam(code_client, "midi")
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

def addMargeToTotalIfWeekend(total, date, facturationHolidays):
    holidaysList =facturationHolidays.holidays.split(',')
    weekendsDaysList = facturationHolidays.weekends.split(',')
    for holiday in holidaysList:
        if date == holiday:
            total = total * (1 +facturationHolidays.marge /100)
    for weekend in weekendsDaysList:
        if int(weekend) == datetime.strptime(date, "%Y-%m-%d").date().weekday():
            total = total * (1 +facturationHolidays.marge /100)
    return(total)

@api_view(['POST'])
def addMonthFacturation(request):
    preparations = request.data['preparations']
    code_client = request.data['code_client']
    dates = request.data['date']
    code_client = request.data['code_client']
    for prep in preparations:
        facturationDB = Facturation()
        facturationDB.code_client = prep['code_client']
        facturationDB.nom_client = Client.objects.get(code_client=prep['code_client']).nom_client
        facturationDB.date = prep['date']
        if('prep_jour' in prep):
            facturationDB.prep_jour = prep['prep_jour']
        if('prep_nuit' in prep):
            facturationDB.prep_nuit = prep['prep_nuit']
        if('prep_province' in prep):
            facturationDB.prep_province = prep['prep_province']
        try:
            facturationDB.save()
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'date already exists'}, status=status.HTTP_200_OK)

    return JsonResponse({'message': 'added successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def getFacturation(request):
    code_client = request.data['code_client']
    mois = request.data['mois']
    fact = getFacturationForMonth(code_client, mois)
    return HttpResponse(jsonpickle.encode(fact, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def downloadExcelFacturation(request):
    code_client = request.data['code_client']
    mois = request.data['mois']
    fileName = "Preparation_"+Client.objects.get(code_client=code_client).nom_client+"_"+mois+".xlsx"
    columns = []
    rows = []
    fact = getFacturationForMonth(code_client, mois)
    for f in fact:
        row = []
        for key in f.__dict__:
            if key not in columns:
                columns.append(key)
            if key == "date":
                row.append(f.__dict__[key].strftime("%d/%m/%y"))
            else:
                row.append(f.__dict__[key])
        rows.append(row)
    #print(fact[0].total_jour)
    createFileFacturationFromColumnAndRows(columns, rows, fileName)
    with open(fileName, 'rb') as f:
        file = f.read()
    response = HttpResponse(file, content_type="application/xls")
    response['Content-Disposition'] = "attachment; filename={0}".format(fileName)
    response['Content-Length'] = os.path.getsize(fileName)
    os.remove(fileName)
    return response

    return JsonResponse({'columns': columns, 'rows': rows}, status=status.HTTP_200_OK)

    return HttpResponse(jsonpickle.encode(fact[0].keys(), unpicklable=False), content_type="application/json")
def createFileFacturationFromColumnAndRows(columns, rows, fileName):
    df = pd.DataFrame(rows, columns=columns)
    df.to_excel(fileName, index=False)


@api_view(['POST'])
def getMonthFacturation(request):
    code_client = request.data['code_client']
    nom_client,fact = getMonthsFacturationForClient(code_client)
    return HttpResponse(jsonpickle.encode({'nom_client': nom_client, 'months':fact}, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def getMonthFacturationWithTotal(request):
    code_client = request.data['code_client']
    factList = Facturation.objects.filter(code_client = code_client).order_by('date')
    if(len(factList)>0):
        nom_client = factList[0].nom_client
        current_month = factList[0].date.strftime("%m-%Y")
    else:
        return HttpResponse(jsonpickle.encode({'nom_client': nom_client, 'months':[]}, unpicklable=False), content_type="application/json")

    
    somme = 0
    listMonths= list()
    for critere in factList:
        if(critere.date.strftime("%m-%Y") == current_month):
            if(critere.total_jour != None):
                somme += critere.total_jour 
            if(critere.total_nuit != None):
                somme += critere.total_nuit
            if(critere.total_province != None):
                somme += critere.total_province
        else:
            diction = {}
            diction['month']=current_month
            diction['total']=somme
            listMonths.append(diction)
            current_month = critere.date.strftime("%m-%Y")
            somme = 0
            if(critere.total_jour != None):
                somme += critere.total_jour 
            if(critere.total_nuit != None):
                somme += critere.total_nuit
            if(critere.total_province != None):
                somme += critere.total_province
    diction = {}
    diction['month']=current_month
    diction['total']=somme
    listMonths.append(diction)

    return HttpResponse(jsonpickle.encode({'nom_client': nom_client, 'months':listMonths}, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def CalculateRealUM(request):
    somme_UM = 0
    nbre_fichier = 0
    nom_client = request.data['nom_client']
    jour = request.data['jour']
    # CRP01220331232759
    ftp = connect()
    path_racine = "/maGistor_2/Clients"
    sous_racine = "OUT/CRP/.archive"
    path_client = path_racine + '/' + nom_client + '/' +sous_racine
    os.chdir(DJANGO_DIRECTORY)
    os.chdir("media/files")
    ftp.cwd(path_client)
    for name in ftp.nlst():
        if "CRP01220331" in name:
            nbre_fichier += 1
            with open(name, "wb") as file:
                commande = "RETR " + name
                ftp.retrbinary(commande, file.write)
            filename = name.split('csv', 1)[0]+'csv'
            try:
                os.rename(name, filename)
            except Exception as e:
                print(e)
                continue
            csvfile = pd.read_csv(filename, delimiter=";")
            csvfile.to_excel('tmp.xlsx', index = None, header=True)
            os.remove(filename)
            excelfile = pd.read_excel('tmp.xlsx', usecols="J,K")
            somme_UM += CalculRealUM(excelfile)

    # excelfile = pd.read_excel(fileName)
    # excelfile = excelfile.fillna('')
    # columns = list(excelfile.columns)





    # with open(fileName, 'rb') as f:
    #     file = f.read()

    #os.remove('tmp.xlsx')
    # df.to_excel(LivraisonFileName, index=False)

    return HttpResponse(jsonpickle.encode({'Unité Mautention':somme_UM, ' fichier_parcourue': nbre_fichier}, unpicklable=False), content_type="application/json")

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

@api_view(['GET'])
def getHolidays(request):
    facturationHolidays = FacturationHolidays.objects.get(id=1)
    response = {"holidays":facturationHolidays.holidays, "weekends":facturationHolidays.weekends, "marge":facturationHolidays.marge}
    return HttpResponse(jsonpickle.encode(response, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def updateHolidays(request):
    try:
        holidays = request.data['holidays']
        weekends = request.data['weekends']
        marge = request.data['marge']
    except Exception as e:
        return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        facturationHolidays = FacturationHolidays.objects.get(id=1)
        facturationHolidays.holidays = holidays
        facturationHolidays.weekends = weekends
        facturationHolidays.marge = marge
        facturationHolidays.save()
    except Exception as e:
        return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)

    return JsonResponse({'message': 'updated successfully'}, status=status.HTTP_200_OK)
