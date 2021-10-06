from config import BaseConfig as app

import msal

class AadService:

    def get_access_token(self):
        '''Generates and returns Access token
        Returns:
            string: Access token
        '''

        response = None
        try:
            if app['AUTHENTICATION_MODE'].lower() == 'masteruser':

                # Create a public client to authorize the app with the AAD app
                clientapp = msal.PublicClientApplication(app['CLIENT_ID'], authority=app['AUTHORITY'])
                accounts = clientapp.get_accounts(username=app['POWER_BI_USER'])

                if accounts:
                    # Retrieve Access token from user cache if available
                    response = clientapp.acquire_token_silent(app['SCOPE'], account=accounts[0])

                if not response:
                    # Make a client call if Access token is not available in cache
                    response = clientapp.acquire_token_by_username_password(app['POWER_BI_USER'], app['POWER_BI_PASS'], scopes=app['SCOPE'])

            # Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
            elif app['AUTHENTICATION_MODE'].lower() == 'serviceprincipal':
                authority = app['AUTHORITY'].replace('organizations', app['TENANT_ID'])
                clientapp = msal.ConfidentialClientApplication(app['CLIENT_ID'], client_credential=app['CLIENT_SECRET'], authority=authority)

                # Make a client call if Access token is not available in cache
                response = clientapp.acquire_token_for_client(scopes=app['SCOPE'])

            try:
                return response['access_token']
            except KeyError:
                raise Exception(response['error_description'])

        except Exception as ex:
            raise Exception('Error retrieving Access token\n' + str(ex))