from core.models import Client
from core.views import archive_client , desarchive_client


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

    if client.archived != objectToSendToDB['Archived__c'] : #detect if archived changed to apply action
        client.archived = objectToSendToDB['Archived__c']
        if  client.archived == True :
            archive_client(client)
        else :
            desarchive_client(client)
    client.id_salesforce = objectToSendToDB['Id']
    return client


