# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

class BaseConfig(object):
    # Can be set to 'MasterUser' or 'ServicePrincipal'
    AUTHENTICATION_MODE = 'ServicePrincipal'

    # Workspace Id in which the report is present
    WORKSPACE_ID = 'ab7d2131-e7ad-4d55-a907-4ffd2e20fcf6'

    # Report Id for which Embed token needs to be generated
    REPORT_ID = 'f839444b-ed27-45f8-9514-7570c7485ebd'

    # Id of the Azure tenant in which AAD app and Power BI report is hosted. Required only for ServicePrincipal authentication mode.
    TENANT_ID = '594cb021-e5ea-420f-883e-32476c8f653b'

    # Client Id (Application Id) of the AAD app
    CLIENT_ID = '467bc7fa-d877-44e9-ab85-385f0b8bb30e'

    # Client Secret (App Secret) of the AAD app. Required only for ServicePrincipal authentication mode.
    CLIENT_SECRET = '1-~7Q~.CdCmpiPCDfc9Di13BYfQ-8zJU34Qm6'

    # Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
    SCOPE = ['https://analysis.windows.net/powerbi/api/.default']

    # URL used for initiating authorization request
    AUTHORITY = 'https://login.microsoftonline.com/organizations'

    # Master user email address. Required only for MasterUser authentication mode.
    POWER_BI_USER = ''

    # Master user email password. Required only for MasterUser authentication mode.
    POWER_BI_PASS = ''