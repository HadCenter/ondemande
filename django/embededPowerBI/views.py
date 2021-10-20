import jsonpickle
from django.http import HttpResponse

# Create your views here.
from rest_framework.decorators import api_view
from powerBIEmbedService import PbiEmbedService
from config import BaseConfig

@api_view(['GET'])
def getEmbedParamsForSingleReport(request):
    baseConfigInstance = BaseConfig()
    powerBIEmbedServiceInstance = PbiEmbedService()
    response = powerBIEmbedServiceInstance.get_embed_params_for_single_report(baseConfigInstance.WORKSPACE_ID,baseConfigInstance.REPORT_ID)
    return HttpResponse(response, content_type="application/json")
