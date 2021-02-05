from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view


talendUrl = 'https://webhooks.eu.cloud.talend.com/onDemandESB/e6cb39ecec634b44b99b40ab36eda213'


@api_view(['POST'])
def startEngineOnEdiFiles(request):
	requests.post(talendUrl,json = request.data)
	return HttpResponse("Hello, world. starting engine.")

