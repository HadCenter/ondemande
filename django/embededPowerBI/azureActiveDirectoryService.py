import requests
from .config import BaseConfig
from embededPowerBI.config import BaseConfig as app
from django.core.cache import cache
import msal

class AadService:

    def get_access_token(self):
        '''Generates and returns Access token
        Returns:
            string: Access token
        '''

        response = None
        try:
            if app.AUTHENTICATION_MODE.lower() == 'masteruser':

                # Create a public client to authorize the app with the AAD app
                clientapp = msal.PublicClientApplication(app.CLIENT_ID, authority=app.AUTHORITY)
                accounts = clientapp.get_accounts(username=app.POWER_BI_USER)

                if accounts:
                    # Retrieve Access token from user cache if available
                    response = clientapp.acquire_token_silent(app.SCOPE, account=accounts[0])

                if not response:
                    # Make a client call if Access token is not available in cache
                    response = clientapp.acquire_token_by_username_password(app.POWER_BI_USER, app.POWER_BI_PASS, scopes=app.SCOPE)

            # Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
            elif app.AUTHENTICATION_MODE.lower() == 'serviceprincipal':
                authority = app.AUTHORITY.replace('organizations', app.TENANT_ID)
                clientapp = msal.ConfidentialClientApplication(app.CLIENT_ID, client_credential=app.CLIENT_SECRET, authority=authority)

                # Make a client call if Access token is not available in cache
                response = clientapp.acquire_token_for_client(scopes=app.SCOPE)

            try:
                cache.set('my_token', response['access_token'], 3600)

                #return response['access_token']
                #return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNTk0Y2IwMjEtZTVlYS00MjBmLTg4M2UtMzI0NzZjOGY2NTNiLyIsImlhdCI6MTYzNDAyNTY3NywibmJmIjoxNjM0MDI1Njc3LCJleHAiOjE2MzQwMjk1NzcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVVFBdS84VEFBQUFKMCtlaXloTVF5N09UMFpoUWhBY0lWM3BIV2NIeElqOUUzRERhRzFqMjdmdUtNYTBwQ3hmYldBNW91eEJqb2h0dVk3bVozV0JlZ3RMRXdhbmFwQWp6QT09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjdmNTlhNzczLTJlYWYtNDI5Yy1hMDU5LTUwZmM1YmIyOGI0NCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoicmVkbGVhbiIsImdpdmVuX25hbWUiOiJSZWRsZWFuIiwiaXBhZGRyIjoiODYuNzYuMTc4LjI0IiwibmFtZSI6IlJlZGxlYW4gIHJlZGxlYW4iLCJvaWQiOiI5OTc1YzFhMy1hYThhLTRhMzItODA5ZC00ZmM0NTAwZjQ4NGYiLCJwdWlkIjoiMTAwMzIwMDBERDNCMzIxMiIsInJoIjoiMC5BVWdBSWJCTVdlcmxEMEtJUGpKSGJJOWxPM09uV1gtdkxweENvRmxRX0Z1eWkwUklBSXcuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiRk5JSVFRS05Fa0hYWFQyLUNOa0M2TU1yajJUdGxEWEhwMjAwZTB6VmwwYyIsInRpZCI6IjU5NGNiMDIxLWU1ZWEtNDIwZi04ODNlLTMyNDc2YzhmNjUzYiIsInVuaXF1ZV9uYW1lIjoicmVkbGVhbkBlY29sb3RyYW5zMS5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyZWRsZWFuQGVjb2xvdHJhbnMxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6Ikh1azUyZ0JyUlVpTUpKak1QdHNRQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjcyOTgyN2UzLTljMTQtNDlmNy1iYjFiLTk2MDhmMTU2YmJiOCIsIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImZlOTMwYmU3LTVlNjItNDdkYi05MWFmLTk4YzNhNDlhMzhiMSIsImE5ZWE4OTk2LTEyMmYtNGM3NC05NTIwLThlZGNkMTkyODI2YyIsImYwMjNmZDgxLWE2MzctNGI1Ni05NWZkLTc5MWFjMDIyNjAzMyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.DY6gV3AYnlIBlVKPiovI-OCDGb0EKvqubEM2Ki6Zd-afsmfnZ3y6yucU94tLrmdlykUC04iAUtyM95q-GJwn03VKThfTUghWiCjOBhSU56ufZqR3t88XBXvpBRq4yBBIRQ0v4D-NGmaGwlHxoD3d3VMU4qLoefsZGkqftdPDFfOj_2QPLeR9ebGitj6_x6oOdWFvm3Q8Sqv2hsUNkKX8d2OhqCfFIAhVwT-QZsE-0qPIw1FzcRreScWqsC9welhk5xsAmOH-91RqSaBdUZ9LiHuvqyvVYbEdGyeJyijtUD2Ko_yPEQ5Kq0YvqGvHlcjIQKoVwQ22RCTB6d3-flQEyg"
            except KeyError:
                raise Exception(response['error_description'])

        except Exception as ex:
            raise Exception('Error retrieving Access token\n' + str(ex))

    def get_azure_token(self):
        '''Generates and returns Access token
        Returns:
            string: Access token
        '''

        api_response = None
        config = BaseConfig()
        report_url = f'https://login.windows.net/{config.TENANT_ID}/oauth2/token'
        payload = {'grant_type':'client_credentials',
        'client_id':config.CLIENT_ID , 
        'client_secret': config.CLIENT_SECRET,
        'resource' : config.RESOURCE,
        'scopes' : config.SCOPES
        }
        api_response = requests.post(report_url, data=payload)
        response = api_response.json()

        try:
            cache.set('azure_token', response['access_token'], 3600)
        except KeyError:
            raise Exception(response['error_description'])
