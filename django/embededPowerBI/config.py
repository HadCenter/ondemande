# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class BaseConfig(object):
    # Can be set to 'MasterUser' or 'ServicePrincipal'
    AUTHENTICATION_MODE = 'ServicePrincipal'

    # Workspace Id in which the report is present
    WORKSPACE_ID = '6ba62016-e902-4f44-9d76-7148c1e76245'

    # Report Id for which Embed token needs to be generated
    REPORT_ID = 'f839444b-ed27-45f8-9514-7570c7485ebd'

    # Id of the Azure tenant in which AAD app and Power BI report is hosted. Required only for ServicePrincipal authentication mode.
    TENANT_ID = '594cb021-e5ea-420f-883e-32476c8f653b'

    # Client Id (Application Id) of the AAD app
    CLIENT_ID = 'fd7442da-454e-4d29-8a8d-a5f27d3f8396'

    # Client Secret (App Secret) of the AAD app. Required only for ServicePrincipal authentication mode.
    CLIENT_SECRET = 'GQT8Q~LzulCuTY-MpSTYZCMQPRP5rueGcsuvyaQy'

    # Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
    SCOPE = ['https://analysis.windows.net/powerbi/api/.default']

    #SCOPES FOR AZURE AUTH
    SCOPES= 'https://management.azure.com/.default'

    #Resource for AZURE
    RESOURCE = 'https://management.azure.com'

    # URL used for initiating authorization request
    AUTHORITY = 'https://login.microsoftonline.com/organizations'


    AZURE_AUTHORITY = 'https://login.windows.net/tenant/oauth2/token'

    #AZURE SUBSCRIPTION ID
    SUBSCRIPTION_ID = 'cb90222b-7b5b-4f10-a44b-5957d232e6f4'

    #AZURE Resource Group NAME
    RESOURCE_GROUP_NAME = 'PowerBI_Ecolotrans'

    #DEDICATED CAPACITY NAME
    DEDICATED_CAPACITY_NAME = 'powerbiecolotransressource'

    API_VERSION = '2021-01-01'
    # Master user email address. Required only for MasterUser authentication mode.
    POWER_BI_USER = ''

    # Master user email password. Required only for MasterUser authentication mode.
    POWER_BI_PASS = ''