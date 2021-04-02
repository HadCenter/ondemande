from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from core.models import Client

from salesforceEsb.contactHandler import contactHandler


@api_view(['POST'])
def makeDbChangePushMode(request):
    objectName= request.data['objectName']
    objectAction= request.data['objectAction']
    objectToSendToDB= request.data['objectToSendToDB']
    message : str
    if objectName == "Contact" :
        message = contactHandler(objectAction = objectAction,objectToSendToDB = objectToSendToDB)
    else:
        print("objectName : " + objectName + " is not supported")

    return Response({"message" : message}, status=status.HTTP_200_OK)
