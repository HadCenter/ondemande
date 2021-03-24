from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from core.models import Client




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

def contactHandler(objectAction : str , objectToSendToDB) :
    response : str
    if objectAction == "insert":
        client = Client()
        client = contactMapFields(client = client , objectToSendToDB = objectToSendToDB)
        client.save()
        response = "ok"
    elif objectAction == "edit" :
        client = Client.objects.get(id_salesforce = objectToSendToDB['Id'] )
        client = contactMapFields(client = client , objectToSendToDB = objectToSendToDB)
        client.save()
        response = "ok"
    elif objectAction == "delete" :
        client = Client.objects.get(id_salesforce = objectToSendToDB['Id'] )
        client.delete()
        response = "ok"
    else:
        response = "objectAction : "+objectAction + " is not supported"
    return response


def contactMapFields(client :Client, objectToSendToDB):
    client.code_client = objectToSendToDB['Code_Client__c']
    client.nom_client = objectToSendToDB['LastName']
    if 'Email' in objectToSendToDB :
        client.email = objectToSendToDB['Email']
    if 'RL_Archived__c' in objectToSendToDB:
        client.archived = objectToSendToDB['RL_Archived__c']
    client.id_salesforce = objectToSendToDB['Id']
    return client
