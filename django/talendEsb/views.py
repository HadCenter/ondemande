from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import asyncio

talendUrl = 'https://www.w3schools.com/python/demopage.php'
testObj = {
	"filePath": "path",
	"ClientOwner" : "amine",
	"fileId" : "ehklaaze"
}

@csrf_exempt
def startEngineOnEdiFiles(request):

    return HttpResponse("Hello, world. starting engine.")

