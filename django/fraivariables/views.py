
import datetime
from http.client import ResponseNotReady, responses
from turtle import update
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Carburant, Pneumatique, Entretien, IndiceCarburant
from random import randrange
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR

@api_view(['GET', 'PUT'])
def carburantList_detail(request,pk):
    
    try:
        carburants = Carburant.objects.get(pk=pk)
    except carburants.DoesNotExist:
        return ResponseNotReady(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        ResponseList = []
        if carburants.is_deleted == False:
            if carburants.type_Carburant == 'ELECTRIC':
                unite = "€/kWh"
            else:
                unite = "€/Litre"
            ResponseList.append({
                    "id":carburants.id,
                    "code_Carburant":carburants.code_Carburant,
                    "type_Carburant":carburants.type_Carburant,
                    "dateupdate":carburants.dateupdate,
                    "prix_essence":carburants.prix_essence,
                    "prix_Diesel":carburants.prix_Diesel,
                    "prix_Gaz":carburants.prix_Gaz,
                    "is_deleted":carburants.is_deleted,
                    "unite":unite
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'PUT':
        for dat in request.data:
            setattr(carburants, dat, request.data[dat])
        try:
            carburants.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'updaded successfully'}, status=status.HTTP_200_OK)
@api_view(['GET','POST'])
def carburantList(request):
    #users = Carburant.objects.order_by('-id')
    if request.method == 'GET':
        carburants = Carburant.objects.all()
        #carburants = Carburant.objects.get(pk=1)
        ResponseList = []
        for carburant in carburants:
            if carburant.is_deleted == False:
                if carburant.type_Carburant == 'ELECTRIC':
                    unite = "€/kWh"
                else:
                    unite = "€/Litre"
                ResponseList.append({
                    "id":carburant.id,
                    "code_Carburant":carburant.code_Carburant,
                    "type_Carburant":carburant.type_Carburant,
                    "dateupdate":carburant.dateupdate,
                    "prix_essence":carburant.prix_essence,
                    "prix_Diesel":carburant.prix_Diesel,
                    "prix_Gaz":carburant.prix_Gaz,
                    "is_active":carburant.is_active,
                    "is_deleted":carburant.is_deleted,
                    "unite":unite
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'POST':
        try:
            code_Carburant = request.data['code_Carburant']
            type_Carburant = request.data['type_Carburant']
            prix_essence = request.data['prix_essence']
            prix_Diesel = request.data['prix_Diesel']
            prix_Gaz = request.data['prix_Gaz']           
            dateupdate = datetime.datetime.now().strftime("%Y-%m-%d")
        except Exception as e:
            return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            Carbu = Carburant(
                code_Carburant = code_Carburant,
                type_Carburant = type_Carburant,
                dateupdate = dateupdate,
                prix_essence =prix_essence,
                prix_Diesel =prix_Diesel,
                prix_Gaz =prix_Gaz,
                is_active = 1,
                is_deleted = 0

            )
            Carbu.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'Added successfully'}, status=status.HTTP_200_OK)
    
   
# Create your views here.
@api_view(['GET', 'PUT'])
def pnumatiqueList_detail(request,pk):
    
    try:
        Pneumatiques = Pneumatique.objects.get(pk=pk)
    except Pneumatique.DoesNotExist:
        return ResponseNotReady(status=status.HTTP_404_NOT_FOUND)
    
    
    if request.method == 'GET':
        ResponseList = []
        if Pneumatiques.is_deleted == False:
            ResponseList.append({
                    "id":Pneumatiques.id,
                    "code_Carburant":Pneumatiques.code_Pneumatique,
                    "dateupdate":Pneumatiques.dateupdate,
                    "prix_Pneumatique":Pneumatiques.prix_Pneumatique,
                    "is_active":Pneumatiques.is_active,
                    "is_deleted":Pneumatiques.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'PUT':
        for dat in request.data:
            setattr(Pneumatiques, dat, request.data[dat])
        try:
            Pneumatiques.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'updaded successfully'}, status=status.HTTP_200_OK)

@api_view(['GET','POST'])
def pnumatiqueList(request):
    #users = Carburant.objects.order_by('-id')
    if request.method == 'GET':
        Pneumatiques = Pneumatique.objects.all()
        ResponseList = []
        for Pn in Pneumatiques:
            if Pn.is_deleted == False :
                ResponseList.append({
                    "id":Pn.id,
                    "code_Pneumatique":Pn.code_Pneumatique,
                    "dateupdate":Pn.dateupdate,
                    "prix_Pneumatique":Pn.prix_Pneumatique,
                    "is_active":Pn.is_active,
                    "is_deleted":Pn.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'POST':
        try:
            code_Pneumatique = request.data['code_Pneumatique']
            prix_Pneumatique = request.data['prix_Pneumatique']
            dateupdate = datetime.datetime.now().strftime("%Y-%m-%d")
        except Exception as e:
            return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            Pneuma = Pneumatique(
                code_Pneumatique = code_Pneumatique,
                dateupdate = dateupdate,
                prix_Pneumatique =prix_Pneumatique,
                is_active = 1,
                is_deleted = 0
            )
            print(code_Pneumatique)
            print(dateupdate)
            print(prix_Pneumatique)
            Pneuma.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            #calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'Added successfully'}, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT'])
def entretienList_detail(request,pk):
    
    try:
        entretiens = Entretien.objects.get(pk=pk)
    except Pneumatique.DoesNotExist:
        return ResponseNotReady(status=status.HTTP_404_NOT_FOUND)
    
    
    if request.method == 'GET':
        ResponseList = []
        if entretiens.is_deleted == False:
            ResponseList.append({
                    "id":entretiens.id,
                    "code_Entretien":entretiens.code_Entretien,
                    "dateupdate":entretiens.dateupdate,
                    "prix_entretien":entretiens.prix_entretien,
                    "is_active":entretiens.is_active,
                    "is_deleted":entretiens.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'PUT':
        for dat in request.data:
            setattr(entretiens, dat, request.data[dat])
        try:
            entretiens.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'updaded successfully'}, status=status.HTTP_200_OK)

@api_view(['GET','POST'])
def entretienList(request):
    #users = Carburant.objects.order_by('-id')
    if request.method == 'GET':
        Entretiens = Entretien.objects.all()
        ResponseList = []
        for Ent in Entretiens:
            if Ent.is_deleted == False:
                ResponseList.append({
                    "id":Ent.id,
                    "code_Entretien":Ent.code_Entretien,
                    "dateupdate":Ent.dateupdate,
                    "prix_entretien":Ent.prix_entretien,
                    "is_active":Ent.is_active,
                    "is_deleted":Ent.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'POST':
        try:
            code_Entretienn = request.data['code_Entretien']
            #dateupdate = request.data['dateupdate']
            prix_entretienn = request.data['prix_entretien']
            dateupdate = datetime.datetime.now().strftime("%Y-%m-%d")
        except Exception as e:
            return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            Entre = Entretien(
                code_Entretien = code_Entretienn,
                dateupdate = dateupdate,
                prix_entretien =prix_entretienn,
                is_active = 1,
                is_deleted = 0
            )
            Entre.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'Added successfully'}, status=status.HTTP_200_OK)
        
@api_view(['GET', 'PUT'])
def IndiceCarburantList_detail(request,pk):
    
    try:
        indices = IndiceCarburant.objects.get(pk=pk)
    except Pneumatique.DoesNotExist:
        return ResponseNotReady(status=status.HTTP_404_NOT_FOUND)
    
    
    if request.method == 'GET':
        ResponseList = []
        if indices.is_deleted == False:
            ResponseList.append({
                    "id":indices.id,
                    "code_Entretien":indices.code_IndiceCarburant,
                    "dateupdate":indices.dateupdate,
                    "prix_entretien":indices.prix_IndiceCarburant,
                    "is_active":indices.is_active,
                    "is_deleted":indices.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'PUT':
        for dat in request.data:
            setattr(indices, dat, request.data[dat])
        try:
            indices.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'updaded successfully'}, status=status.HTTP_200_OK)

@api_view(['GET','POST'])
def indicecarburantList(request):
    #users = Carburant.objects.order_by('-id')
    if request.method == 'GET':
        IndiceCarburants = IndiceCarburant.objects.all()
        ResponseList = []
        for Indice in IndiceCarburants:
            if Indice.is_deleted == False:
                ResponseList.append({
                    "id":Indice.id,
                    "code_IndiceCarburant":Indice.code_IndiceCarburant,
                    "dateupdate":Indice.dateupdate,
                    "prix_IndiceCarburant":Indice.prix_IndiceCarburant,
                    "is_active":Indice.is_active,
                    "is_deleted":Indice.is_deleted,
                    })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")
    elif request.method == 'POST':
        try:
            code_IndiceCarburant = request.data['code_IndiceCarburant']
            prix_IndiceCarburant = request.data['prix_IndiceCarburant']
            dateupdate = datetime.datetime.now().strftime("%Y-%m-%d")
        except Exception as e:
            return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            IndiceCarb = IndiceCarburant(
                code_IndiceCarburant = code_IndiceCarburant,
                prix_IndiceCarburant = prix_IndiceCarburant,
                dateupdate =dateupdate,
                is_active = 1,
                is_deleted = 0
            )
            IndiceCarb.save()
        except Exception as e:
            return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
            #calculateAllFacturationsForAllClients()
        return JsonResponse({'message': 'Added successfully'}, status=status.HTTP_200_OK)

"""
@api_view(['POST'])
def indicecarburantAdd(request):
    try:
        code_IndiceCarburant = request.data['code_IndiceCarburant']
        prix_IndiceCarburant = request.data['prix_IndiceCarburant']
        dateupdate=request.data['dateupdate']
    except Excepa   tion as e:
        return JsonResponse({'message': 'params missing'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        IndiceCarb = IndiceCarburant(
            code_IndiceCarburant = code_IndiceCarburant,
            prix_IndiceCarburant = prix_IndiceCarburant,
            dateupdate =dateupdate
        )
        IndiceCarb.save()
    except Exception as e:
        return JsonResponse({'message': 'error occured'}, status=status.HTTP_404_NOT_FOUND)
        calculateAllFacturationsForAllClients()
    return JsonResponse({'message': 'Added successfully'}, status=status.HTTP_200_OK)
"""