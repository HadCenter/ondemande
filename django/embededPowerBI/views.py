from django.http import JsonResponse
from django.http.response import HttpResponseNotFound
from rest_framework import status
import jsonpickle
from django.http import HttpResponse
from requests.models import Response

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer

from accounts.models import Account
from .models import PowerBiRTLog
from embededPowerBI.powerBIEmbedService import PbiEmbedService
from .config import BaseConfig
import requests
from .azureActiveDirectoryService import AadService
from django.core.cache import cache
import json
import time

updatePowerBIDatabaseWebhook = "https://webhooks.eu.cloud.talend.com/DB_RT_ONDEMAND/b56ff707f3754e9683363c8bf4895c24"
@api_view(['GET'])
def getEmbedParamsForSingleReport(request,id):
    #print(request.GET.get('id',"params in url not found"))
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    response = powerBIEmbedServiceInstance.get_embed_params_for_single_report(baseConfigInstance.WORKSPACE_ID,id)
    return HttpResponse(response, content_type="application/json")


@api_view(['GET'])
def getMultipleReports(request):
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    # response = powerBIEmbedServiceInstance.get_embed_params_for_multiple_reports(baseConfigInstance.WORKSPACE_ID,id)
    # return HttpResponse(response, content_type="application/json")
    report_url = f'https://api.powerbi.com/v1.0/myorg/groups/{baseConfigInstance.WORKSPACE_ID}/reports/'
    api_response = requests.get(report_url, headers=powerBIEmbedServiceInstance.get_request_header())
    return HttpResponse(api_response, content_type="application/json")

@api_view(['GET'])
def getUserReports(request,id):
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    # response = powerBIEmbedServiceInstance.get_embed_params_for_multiple_reports(baseConfigInstance.WORKSPACE_ID,id)
    # return HttpResponse(response, content_type="application/json")
    report_url = f'https://api.powerbi.com/v1.0/myorg/groups/{baseConfigInstance.WORKSPACE_ID}/reports/'
    api_response = requests.get(report_url, headers=powerBIEmbedServiceInstance.get_request_header())
    response = json.loads(api_response.content)['value']
    account = Account.objects.get(pk=id)
    account_reports = []
    if(account.reports_id):
        account_reports = account.reports_id.split(',')
    reports = []
    for item in response:
        if(item['id'] in account_reports):
            reports.append(item)
    return HttpResponse(JSONRenderer().render(reports), content_type="application/json")

@api_view(['GET'])
def getUserToken(request):
    aadService = AadService();
    if cache.get('my_token') is None:
        aadService.get_access_token()

    return cache.get('my_token')

@api_view(['GET'])
def resume(self):
    config = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    report_url = f'https://management.azure.com/subscriptions/{config.SUBSCRIPTION_ID}/resourceGroups/{config.RESOURCE_GROUP_NAME}/providers/Microsoft.PowerBIDedicated/capacities/{config.DEDICATED_CAPACITY_NAME}/resume?api-version={config.API_VERSION}'
    api_response = requests.post(report_url, headers=powerBIEmbedServiceInstance.get_azure_header())
    #response = api_response.json()
    if api_response.status_code == 202:
        return JsonResponse({'message': 'resumed successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'message': 'Could not be resumed'}, status=status.HTTP_403_FORBIDDEN)

    
@api_view(['GET'])
def suspend(self):
    config = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    report_url = f'https://management.azure.com/subscriptions/{config.SUBSCRIPTION_ID}/resourceGroups/{config.RESOURCE_GROUP_NAME}/providers/Microsoft.PowerBIDedicated/capacities/{config.DEDICATED_CAPACITY_NAME}/suspend?api-version={config.API_VERSION}'
    api_response = requests.post(report_url, headers=powerBIEmbedServiceInstance.get_azure_header())
    #response = api_response.json()
    print(api_response)
    #print(response)
    if api_response.status_code == 202:
        return JsonResponse({'message': 'suspended successfully'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'message': 'Could not be suspended'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def getCapacityState(request):
    config = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    report_url = f'https://management.azure.com/subscriptions/{config.SUBSCRIPTION_ID}/resourceGroups/{config.RESOURCE_GROUP_NAME}/providers/Microsoft.PowerBIDedicated/capacities/{config.DEDICATED_CAPACITY_NAME}?api-version={config.API_VERSION}'
    api_response = requests.get(report_url, headers=powerBIEmbedServiceInstance.get_azure_header())
    response = json.loads(api_response.text)
    if api_response.status_code == 200:
        return HttpResponse(json.dumps(response['properties']['state']), content_type="application/json")
    else:
        return Response({'status': 'could not get details '})

@api_view(['GET'])
def getRefreshState(request,id):
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    refresh_url = f'https://api.powerbi.com/v1.0/myorg/groups/{baseConfigInstance.WORKSPACE_ID}/datasets/{id}/refreshes'
    api_response = requests.get(refresh_url, headers=powerBIEmbedServiceInstance.get_request_header())
    if( str(api_response.status_code).startswith("4")):
        return HttpResponseNotFound(api_response, content_type="application/json")
    else:
        return HttpResponse(api_response, content_type="application/json")

@api_view(['POST'])
def refreshReport(request,id):
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    refresh_url = f'https://api.powerbi.com/v1.0/myorg/groups/{baseConfigInstance.WORKSPACE_ID}/datasets/{id}/refreshes'
    api_response = requests.post(refresh_url, headers=powerBIEmbedServiceInstance.get_request_header())
    print(api_response)
    if( str(api_response.status_code).startswith("4")):
        print("ERROOOOR WORKEEEED")
        return HttpResponseNotFound(api_response, content_type="application/json")
    else:
        print("ERROOOOR NOOOOOOOOOOOOOOOT WORKEEEED")
        return HttpResponse(api_response, content_type="application/json")

@api_view(['POST'])
def refreshDatabase(request):
    updatePowerBiRefreshButtonStatus(statut = "En attente", id_admin = request.data[0]['id_admin'])
    refreshDatabaseWithData(updatePowerBIDatabaseWebhook, request.data)
    return JsonResponse({'message': 'ok'}, status=status.HTTP_200_OK)


def checkButtonStatusAndChangeItAfterSomeTime():
    time.sleep(250) #sleep for 4 minutes
    if(PowerBiRTLog.objects.last().status == "En attente"):
        updatePowerBiRefreshButtonStatus(statut = "Echec", id_admin = 15)


def refreshDatabaseWithData(link:str,data):
    requests.post(link, json=data)

@api_view(['POST'])
def updatePowerBiRefreshButtonStatusWS(request):
    statut = request.data['status']
    id_admin = request.data['id_admin']

    updatePowerBiRefreshButtonStatus(statut = statut, id_admin = id_admin )
    return JsonResponse({'message': 'success'}, status=status.HTTP_200_OK)


def updatePowerBiRefreshButtonStatus(statut: str, id_admin):
    powerBiRtLog = PowerBiRTLog()
    powerBiRtLog.status = statut
    powerBiRtLog.id_admin = id_admin
    powerBiRtLog.save()

@api_view(['GET'])
def getPowerBiRefreshButtonStatus(request):
    statut = PowerBiRTLog.objects.last().status
    return JsonResponse({'status': statut}, status=status.HTTP_200_OK)




