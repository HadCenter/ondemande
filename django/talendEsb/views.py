from django.http import HttpResponse
import requests
from rest_framework.decorators import api_view
# import pdb
from rest_framework.response import Response
from rest_framework import status
from core.models import EDIfile
# talendUrl = 'https://webhooks.eu.cloud.talend.com/onDemandESB/e6cb39ecec634b44b99b40ab36eda213'
# talendUrl = 'https://webhooks.eu.cloud.talend.com/OnDemand/d9454150cb0641658e132131bf6d585d'
talendUrl ='https://webhooks.eu.cloud.talend.com/onDemandPipeline/f370e80809334a5499c2b7bc8d58a746'


@api_view(['POST'])
def startEngineOnEdiFiles(request):
	fileEdi = EDIfile.objects.get(pk=request.data[0]["fileId"])
	fileEdi.cliqued = True
	fileEdi.save()
	requests.post(talendUrl,json = request.data)
	return Response({"message" : "ok"}, status=status.HTTP_200_OK)

