import jsonpickle
from django.http import HttpResponse

# Create your views here.
from rest_framework.decorators import api_view
from embededPowerBI.powerBIEmbedService import PbiEmbedService
from .config import BaseConfig
import requests

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

    authority = app.AUTHORITY.replace('organizations', app.TENANT_ID)
    clientapp = msal.ConfidentialClientApplication(app.CLIENT_ID, client_credential=app.CLIENT_SECRET, authority=authority)

    # Make a client call if Access token is not available in cache
    response = clientapp.acquire_token_for_client(scopes=app.SCOPE)

    try:
        #return response['access_token']
        return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNTk0Y2IwMjEtZTVlYS00MjBmLTg4M2UtMzI0NzZjOGY2NTNiLyIsImlhdCI6MTYzNDAyNTY3NywibmJmIjoxNjM0MDI1Njc3LCJleHAiOjE2MzQwMjk1NzcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVVFBdS84VEFBQUFKMCtlaXloTVF5N09UMFpoUWhBY0lWM3BIV2NIeElqOUUzRERhRzFqMjdmdUtNYTBwQ3hmYldBNW91eEJqb2h0dVk3bVozV0JlZ3RMRXdhbmFwQWp6QT09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjdmNTlhNzczLTJlYWYtNDI5Yy1hMDU5LTUwZmM1YmIyOGI0NCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoicmVkbGVhbiIsImdpdmVuX25hbWUiOiJSZWRsZWFuIiwiaXBhZGRyIjoiODYuNzYuMTc4LjI0IiwibmFtZSI6IlJlZGxlYW4gIHJlZGxlYW4iLCJvaWQiOiI5OTc1YzFhMy1hYThhLTRhMzItODA5ZC00ZmM0NTAwZjQ4NGYiLCJwdWlkIjoiMTAwMzIwMDBERDNCMzIxMiIsInJoIjoiMC5BVWdBSWJCTVdlcmxEMEtJUGpKSGJJOWxPM09uV1gtdkxweENvRmxRX0Z1eWkwUklBSXcuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiRk5JSVFRS05Fa0hYWFQyLUNOa0M2TU1yajJUdGxEWEhwMjAwZTB6VmwwYyIsInRpZCI6IjU5NGNiMDIxLWU1ZWEtNDIwZi04ODNlLTMyNDc2YzhmNjUzYiIsInVuaXF1ZV9uYW1lIjoicmVkbGVhbkBlY29sb3RyYW5zMS5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyZWRsZWFuQGVjb2xvdHJhbnMxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6Ikh1azUyZ0JyUlVpTUpKak1QdHNRQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjcyOTgyN2UzLTljMTQtNDlmNy1iYjFiLTk2MDhmMTU2YmJiOCIsIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImZlOTMwYmU3LTVlNjItNDdkYi05MWFmLTk4YzNhNDlhMzhiMSIsImE5ZWE4OTk2LTEyMmYtNGM3NC05NTIwLThlZGNkMTkyODI2YyIsImYwMjNmZDgxLWE2MzctNGI1Ni05NWZkLTc5MWFjMDIyNjAzMyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.DY6gV3AYnlIBlVKPiovI-OCDGb0EKvqubEM2Ki6Zd-afsmfnZ3y6yucU94tLrmdlykUC04iAUtyM95q-GJwn03VKThfTUghWiCjOBhSU56ufZqR3t88XBXvpBRq4yBBIRQ0v4D-NGmaGwlHxoD3d3VMU4qLoefsZGkqftdPDFfOj_2QPLeR9ebGitj6_x6oOdWFvm3Q8Sqv2hsUNkKX8d2OhqCfFIAhVwT-QZsE-0qPIw1FzcRreScWqsC9welhk5xsAmOH-91RqSaBdUZ9LiHuvqyvVYbEdGyeJyijtUD2Ko_yPEQ5Kq0YvqGvHlcjIQKoVwQ22RCTB6d3-flQEyg"
    except KeyError:
        raise Exception(response['error_description'])


