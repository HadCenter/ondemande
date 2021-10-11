from embededPowerBI.config import BaseConfig as app

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
                #return response['access_token']
                return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNTk0Y2IwMjEtZTVlYS00MjBmLTg4M2UtMzI0NzZjOGY2NTNiLyIsImlhdCI6MTYzMzk0MzU5NiwibmJmIjoxNjMzOTQzNTk2LCJleHAiOjE2MzM5NDc0OTYsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVVFBdS84VEFBQUFnSkdvWk8ya1BHZ3JVZWV6ZXNJUjBRN1krLzNlaDRrM1J2TU0vd0xQWnVVWW5qdzVrZDcrUWZQSExpekNSaHN1SmhaUGZWTVpPYTdvMk1HZkU5eFY3dz09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBpZCI6IjdmNTlhNzczLTJlYWYtNDI5Yy1hMDU5LTUwZmM1YmIyOGI0NCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoicmVkbGVhbiIsImdpdmVuX25hbWUiOiJSZWRsZWFuIiwiaXBhZGRyIjoiODYuNzYuMTc4LjI0IiwibmFtZSI6IlJlZGxlYW4gIHJlZGxlYW4iLCJvaWQiOiI5OTc1YzFhMy1hYThhLTRhMzItODA5ZC00ZmM0NTAwZjQ4NGYiLCJwdWlkIjoiMTAwMzIwMDBERDNCMzIxMiIsInJoIjoiMC5BVWdBSWJCTVdlcmxEMEtJUGpKSGJJOWxPM09uV1gtdkxweENvRmxRX0Z1eWkwUklBSXcuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiRk5JSVFRS05Fa0hYWFQyLUNOa0M2TU1yajJUdGxEWEhwMjAwZTB6VmwwYyIsInRpZCI6IjU5NGNiMDIxLWU1ZWEtNDIwZi04ODNlLTMyNDc2YzhmNjUzYiIsInVuaXF1ZV9uYW1lIjoicmVkbGVhbkBlY29sb3RyYW5zMS5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyZWRsZWFuQGVjb2xvdHJhbnMxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6Ik9pM3Ztem5rQTAtRUd3RlRUWlVpQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjcyOTgyN2UzLTljMTQtNDlmNy1iYjFiLTk2MDhmMTU2YmJiOCIsIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImZlOTMwYmU3LTVlNjItNDdkYi05MWFmLTk4YzNhNDlhMzhiMSIsImE5ZWE4OTk2LTEyMmYtNGM3NC05NTIwLThlZGNkMTkyODI2YyIsImYwMjNmZDgxLWE2MzctNGI1Ni05NWZkLTc5MWFjMDIyNjAzMyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.Mt6ovzOHLy-7t_y2g7Vhkyof7R7Te60wJ-zSX5LSTUNYh0YKhJRccEd1GHcEqyOi9MeuzTg24uM4dmuxjfeuNxYuTI8mbN6I85ONEuW9M1grPKnBfAKKcOuqhUs_TNmh7xzm4qDy1xpAQ_OlYBw2fMRBt3f-9fbmfxmiR_BcO_FJdeHegQfGMfLV689BP6N5D-yEMeS6-oX2uea7Y6fcpOMESQEOTPBC9QIeB7nY-AjGgluPhq360E_5u4k-ArE355N0MlnuNZBY4fVoM_DngNaUFbgoMUvlw90EbtY5d33uW1l1t17Ox1R54mQJKczbrniOMNP412t7Qq8erLCeKg"
            except KeyError:
                raise Exception(response['error_description'])

        except Exception as ex:
            raise Exception('Error retrieving Access token\n' + str(ex))