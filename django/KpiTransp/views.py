
import datetime
from http.client import ResponseNotReady, responses
from turtle import update
from django.http import HttpResponse, JsonResponse
import jsonpickle
from rest_framework import status
from rest_framework.decorators import api_view
from .models import KPI_HT_TRANS
from random import randrange
from django.conf import settings
DJANGO_DIRECTORY = settings.BASE_DIR

def KPIHTList(request):
    #users = Carburant.objects.order_by('-id')
    if request.method == 'GET':
        KPIHT = KPI_HT_TRANS.objects.all()
        ResponseList = []
        for KPIHTs in KPIHT:
            #if KPIHTs.is_deleted == False:
            ResponseList.append({
                "id":KPIHTs.id,
                "date":KPIHTs.date,
                "prix_HT":KPIHTs.prix_HT,
                "is_deleted":KPIHTs.is_deleted,
                "type_service":KPIHTs.type_service,
                })
        return HttpResponse(jsonpickle.encode(ResponseList, unpicklable=False), content_type="application/json")