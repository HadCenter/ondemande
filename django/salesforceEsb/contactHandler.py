from core.models import Client
from core.views import archive_client


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
    elif objectAction == "archive" :
        client = Client.objects.get(id_salesforce = objectToSendToDB['Id'] )
        archive_client(client)
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


