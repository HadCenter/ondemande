import jsonpickle
from django.http import HttpResponse

# Create your views here.
from rest_framework.decorators import api_view
from embededPowerBI.powerBIEmbedService import PbiEmbedService
from .config import BaseConfig
import requests
from .azureActiveDirectoryService import AadService
from django.core.cache import cache

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
def getUserToken(request):
    aadService = AadService();
    if cache.get('my_token') is None:
        aadService.get_access_token()

    return cache.get('my_token')


