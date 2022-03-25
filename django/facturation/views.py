from core.models import Client
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view

from .facturationService import getFacturationForDateRange, getMatriceForClient, getMatriceForParam, getAllClientsinDB, getMonthsFacturationForClient

from .models import MatriceFacturation, Facturation

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

    unitéManut = ( int(nbre_preparateur) * int(criteres['TP']) * 60 ) / int(criteres["productivité"])
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.')))
    total = coutProdAvecMarge * unitéManut
    #unitéManut = ((int(nbre_preparateur) * int(criteres["CHP"]) * criteres["forfaitNbHeure"]) + (criteres["CHC"] * criteres["forfaitNbHeureCoord"]))/ (1-criteres["marge"])
    print(unitéManut)
    print(coutProdSansMarge)
    print(coutProdAvecMarge)
    print(total) 
    if(len(criteres) == 0):
        return JsonResponse({'message': 'Client or param not found'}, status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")

@api_view(['POST'])
def caculateFacturationByDate(request):
    total = 0
    untreatedFacturation = Facturation.objects.filter(total_jour=None)
    for fact in untreatedFacturation:
        if(fact.prep_jour != None):
            print("prep jour in not null")
            criteres = getMatriceForParam(fact.code_client, "midi")
            total = getFacturationTotal(fact.prep_jour, criteres)
            fact.total_jour = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter( total_nuit=None)
    for fact in untreatedFacturation:
        if(fact.prep_nuit != None):
            print("prep soir in not null")
            criteres = getMatriceForParam(fact.code_client, "soir")
            total = getFacturationTotal(fact.prep_nuit, criteres)
            fact.total_nuit = total
            fact.save()
    untreatedFacturation = Facturation.objects.filter(total_province = None)
    for fact in untreatedFacturation:
        if(fact.prep_province != None):
            print("prep province in not null")
            criteres = getMatriceForParam(fact.code_client, "province")
            print(criteres)
            total = getFacturationTotal(fact.prep_province, criteres)
            print(fact.prep_province)
            fact.total_province = total
            fact.save()

    return HttpResponse(jsonpickle.encode(total, unpicklable=False), content_type="application/json")


def getFacturationTotal(nbre_preparateur, criteres):
    unitéManut = ( int(nbre_preparateur) * int(criteres["TP"]) * 60 ) / int(criteres["productivité"])
    coutProdSansMarge = ((int(nbre_preparateur) * int(criteres["CHP"]) * int(criteres["forfaitNbHeure"])) + (int(criteres["CHC"]) * int(criteres["forfaitNbHeureCoord"])))/ (unitéManut)
    coutProdAvecMarge = coutProdSansMarge/(1- float(criteres["marge"].replace(',','.')))
    total = coutProdAvecMarge * unitéManut
    return total

@api_view(['POST'])
def addFacturation(request):
    preparations = request.data['preparations']
    for prep in preparations:
        facturationDB = Facturation()
        facturationDB.code_client = prep['code_client']
        print(prep['code_client'])
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
            #the below code allow backend to modify inserted preparations
            # facturationDB = Facturation.objects.get(date= prep['date'])
            # if('prep_jour' in prep):
            #     facturationDB.prep_jour = prep['prep_jour']
            # if('prep_nuit' in prep):
            #     facturationDB.prep_nuit = prep['prep_nuit']
            # if('prep_province' in prep):
            #     facturationDB.prep_province = prep['prep_province']
            # facturationDB.save()

    return JsonResponse({'message': 'added successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def addMonthFacturation(request):
    preparations = request.data['preparations']
    code_client = request.data['code_client']
    dates = request.data['date']
    code_client = request.data['code_client']
    for prep in preparations:
        facturationDB = Facturation()
        facturationDB.code_client = prep['code_client']
        print(prep['code_client'])
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
    fact = getFacturationForDateRange(code_client, mois)
    return HttpResponse(jsonpickle.encode(fact, unpicklable=False), content_type="application/json")


@api_view(['POST'])
def getMonthFacturation(request):
    code_client = request.data['code_client']
    nom_client,fact = getMonthsFacturationForClient(code_client)
    return HttpResponse(jsonpickle.encode({'nom_client': nom_client, 'months':fact}, unpicklable=False), content_type="application/json")
