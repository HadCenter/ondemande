from core.models import Client
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view


from .facturationService import getFacturationForMonth, getMatriceForClient, getMatriceForParam, getAllClientsinDB, getMonthsFacturationForClient

from .models import MatriceFacturation, Facturation
from django.db.models import Sum

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
    for prep in preparations:
        code_client = prep['code_client']
        facturationDB = Facturation()
        facturationDB.code_client = code_client
        facturationDB.nom_client = Client.objects.get(code_client=code_client).nom_client
        facturationDB.date = prep['date']
        calculateTotals(facturationDB,prep,code_client)
        
        try:
            facturationDB.save()
        except Exception as e:
            print(e)
            #the below code allow backend to modify inserted preparations
            facturationDB = Facturation.objects.get(date= prep['date'], code_client=code_client)
            calculateTotals(facturationDB,prep,code_client)
            facturationDB.save()

    return JsonResponse({'message': 'added successfully'}, status=status.HTTP_200_OK)

def calculateTotals(facturationDB,prep,code_client):
    if('prep_jour' in prep):
        facturationDB.prep_jour = prep['prep_jour']
        critere_jour = getMatriceForParam(code_client, "midi")
        total_jour = getFacturationTotal(prep['prep_jour'], critere_jour)
        facturationDB.total_jour = total_jour
        facturationDB.UM_jour = getUM(prep['prep_jour'], critere_jour)
        print("fact",facturationDB.UM_jour)
        if('UM_jour' in prep and facturationDB.UM_jour < float(prep['UM_jour'])):
            facturationDB.UM_jour = prep['UM_jour']
            total_jour, diff_jour = getFacturationTotalWithDepassement(prep['prep_jour'], critere_jour, prep['UM_jour'])
            facturationDB.total_jour = total_jour
            facturationDB.diff_jour = diff_jour

    if('prep_nuit' in prep):
        facturationDB.prep_nuit = prep['prep_nuit']
        critere_nuit = getMatriceForParam(code_client, "soir")
        total_nuit = getFacturationTotal(prep['prep_nuit'], critere_nuit)
        facturationDB.total_nuit = total_nuit
        facturationDB.UM_nuit = getUM(prep['prep_nuit'], critere_nuit)
        if('UM_nuit' in prep and facturationDB.UM_nuit < float(prep['UM_nuit'])):
            facturationDB.UM_nuit = prep['UM_nuit']
            total_nuit, diff_nuit = getFacturationTotalWithDepassement(prep['prep_nuit'], critere_nuit, prep['UM_nuit'])
            facturationDB.total_nuit = total_nuit
            print(diff_nuit)
            facturationDB.diff_nuit = diff_nuit


    if('prep_province' in prep):
        facturationDB.prep_province = prep['prep_province']
        critere_province = getMatriceForParam(code_client, "province")
        total_province = getFacturationTotal(prep['prep_province'], critere_province)
        facturationDB.total_province = total_province
        facturationDB.UM_province = getUM(prep['prep_province'], critere_province)
        if('UM_province' in prep):
            facturationDB.UM_province = prep['UM_province']
            total_province, diff_province = getFacturationTotalWithDepassement(prep['prep_province'], critere_province, prep['UM_province'])
            facturationDB.total_province = total_province
            print(diff_province)
            facturationDB.diff_province = diff_province


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
