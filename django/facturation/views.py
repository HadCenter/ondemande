import os
import pandas as pd 
from core.models import Client
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view
from core.ediFileService import connect
from .facturationService import CalculRealUM, calculateAllFacturationsForAllClients, calculateTotals, createFileFacturationFromColumnAndRows, getFacturationForMonth, getMatriceForClient, getMatriceForParam, getAllClientsinDB
from .models import FacturationHolidays, MatriceFacturation, Facturation
from random import randrange
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR

@api_view(['GET'])
def getListClient(request):
    listClient = getAllClientsinDB()
    return HttpResponse(jsonpickle.encode(listClient, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def updateAllMatriceForClientV2(request):
    listOfParams = []
    try:
        params = request.data['parameters']
        code_client = request.data['code_client']
    except Exception as e:
        print(e)
        return JsonResponse({'message': 'Body parametres are empty or incorrect'}, status=status.HTTP_403_FORBIDDEN)
    try:
        nom_client=request.data['nom_client']
        client = Client() 
        client.nom_client=nom_client
        code_client = "F"+str(randrange(1000)+1)
        client.code_client = code_client
        client.id_salesforce=code_client
        client.save()
    except Exception as e:
        print(e)

    for element in params:
        element.pop("nom_client", None)
        param = element.pop("param",None)
        if(param not in listOfParams):
            listOfParams.append(param)
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
    matrice = MatriceFacturation.objects.filter(code_client=code_client)
    for mat in matrice:
        if(mat.param not in listOfParams):
            mat.delete()
    return JsonResponse({'message': 'updated successfully','code_client':code_client}, status=status.HTTP_200_OK)

@api_view(['POST'])
def getMatriceByClient(request):
    code_client = request.data['code_client']
    criteres = getMatriceForClient(code_client)
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(criteres, unpicklable=False), content_type="application/json")

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
def addFacturation(request):
    preparations = request.data['preparations']
    facturationHolidays = FacturationHolidays.objects.get(id=1)
    for prep in preparations:
        code_client = prep['code_client']
        try:
            facturationDB = Facturation.objects.get(date= prep['date'], code_client=code_client)
            response = calculateTotals(facturationDB,prep,code_client, prep['date'], facturationHolidays)
            if(not response):
                return JsonResponse({'message': 'veuiller remplir la matrice du client'}, status=status.HTTP_400_BAD_REQUEST)
            facturationDB.save()
        except Exception as e:
            print(e)
            #the below code allow backend to insert new preparations
            facturationDB = Facturation()
            facturationDB.code_client = code_client
            facturationDB.nom_client = Client.objects.get(code_client=code_client).nom_client
            facturationDB.date = prep['date']
            response = calculateTotals(facturationDB,prep,code_client, prep['date'], facturationHolidays)
            if(not response):
                return JsonResponse({'message': 'veuiller remplir la matrice du client'}, status=status.HTTP_400_BAD_REQUEST)
            facturationDB.save()
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
    for f in fact["facture"]:
        row = []
        for key in f.__dict__:
            if key not in columns:
                columns.append(key)
            if key == "date":
                row.append(f.__dict__[key].strftime("%d/%m/%y"))
            else:
                row.append(f.__dict__[key])
        rows.append(row)
    createFileFacturationFromColumnAndRows(columns, rows, fileName)
    with open(fileName, 'rb') as f:
        file = f.read()
    response = HttpResponse(file, content_type="application/xls")
    response['Content-Disposition'] = "attachment; filename={0}".format(fileName)
    response['Content-Length'] = os.path.getsize(fileName)
    os.remove(fileName)
    return response

@api_view(['POST'])
def getMonthFacturationWithTotal(request):
    code_client = request.data['code_client']
    factList = Facturation.objects.filter(code_client = code_client).order_by('date')
    if(len(factList)>0):
        nom_client = factList[0].nom_client
        current_month = factList[0].date.strftime("%m-%Y")
    else:
        try:
            nom_client = Client.objects.get(code_client=code_client).nom_client
        except Exception:
            nom_client=""
        return HttpResponse(jsonpickle.encode({'nom_client': nom_client , 'months':[]}, unpicklable=False), content_type="application/json")

    
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

    return HttpResponse(jsonpickle.encode({'Unité Mautention':somme_UM, ' fichier_parcourue': nbre_fichier}, unpicklable=False), content_type="application/json")


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
    calculateAllFacturationsForAllClients()
    return JsonResponse({'message': 'updated successfully'}, status=status.HTTP_200_OK)
