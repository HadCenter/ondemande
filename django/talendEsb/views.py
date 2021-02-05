from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import asyncio

talendUrl = 'https://webhooks.eu.cloud.talend.com/onDemandESB/e6cb39ecec634b44b99b40ab36eda213'
testObj = [{
	"filePath": "25_12_2020_EDI_2021-02-05-05-36-00.xlsx",
	"ClientOwner" : 3,
	"fileId" : 1
}]


@csrf_exempt
def startEngineOnEdiFiles(request):
	requests.post(talendUrl,data = testObj)
	return HttpResponse("Hello, world. starting engine.")

