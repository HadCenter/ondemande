# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from os import abort
from .azureActiveDirectoryService import AadService
from .models import ReportConfig
from .models import EmbedConfig
from .models import EmbedTokenRequestBody
from .models import EmbedToken
from django.core.cache import cache

import requests
import json


class PbiEmbedService:

    def get_embed_params_for_single_report(self, workspace_id, report_id, additional_dataset_id=None):
        '''Get embed params for a report and a workspace
        Args:
            workspace_id (str): Workspace Id
            report_id (str): Report Id
            additional_dataset_id (str, optional): Dataset Id different than the one bound to the report. Defaults to None.
        Returns:
            EmbedConfig: Embed token and Embed URL
        '''

        report_url = f'https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}'
        api_response = requests.get(report_url, headers=self.get_request_header())
        print("12233 REPONSE SERVEEEUR // "+api_response.text+"FIIIIIIIIN")

        if api_response.status_code != 200:
            raise Exception(f'Error while retrieving Embed URL\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}')
        # if api_response.status_code != 200:
        #     abort(api_response.status_code,
        #           description=f'Error while retrieving Embed URL\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}')
        api_response = json.loads(api_response.text)
        report = ReportConfig(api_response['id'], api_response['name'], api_response['embedUrl'], api_response['datasetId'])
        dataset_ids = [api_response['datasetId']]

        # Append additional dataset to the list to achieve dynamic binding later
        if additional_dataset_id is not None:
            dataset_ids.append(additional_dataset_id)

        embed_token = self.get_embed_token_for_single_report_single_workspace(report_id, dataset_ids, workspace_id)
        embed_config = EmbedConfig(embed_token.tokenId, embed_token.token, embed_token.tokenExpiry, [report.__dict__])
        return json.dumps(embed_config.__dict__)



    def get_embed_token_for_single_report_single_workspace(self, report_id, dataset_ids, target_workspace_id=None):
        '''Get Embed token for single report, multiple datasets, and an optional target workspace
        Args:
            report_id (str): Report Id
            dataset_ids (list): Dataset Ids
            target_workspace_id (str, optional): Workspace Id. Defaults to None.
        Returns:
            EmbedToken: Embed token
        '''

        request_body = EmbedTokenRequestBody()

        for dataset_id in dataset_ids:
            request_body.datasets.append({'id': dataset_id})

        request_body.reports.append({'id': report_id})

        if target_workspace_id is not None:
            request_body.targetWorkspaces.append({'id': target_workspace_id})

        # Generate Embed token for multiple workspaces, datasets, and reports. Refer https://aka.ms/MultiResourceEmbedToken
        embed_token_api = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
        api_response = requests.post(embed_token_api, data=json.dumps(request_body.__dict__), headers=self.get_request_header())

        if api_response.status_code != 200:
            raise Exception(f'Error while retrieving Embed token\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}')

        api_response = json.loads(api_response.text)
        embed_token = EmbedToken(api_response['tokenId'], api_response['token'], api_response['expiration'])
        return embed_token


    def get_embed_params_for_multiple_reports(self, workspace_id, report_ids, additional_dataset_ids=None):
        '''Get embed params for multiple reports for a single workspace
        Args:
            workspace_id (str): Workspace Id
            report_ids (list): Report Ids
            additional_dataset_ids (list, optional): Dataset Ids which are different than the ones bound to the reports. Defaults to None.
        Returns:
            EmbedConfig: Embed token and Embed URLs
        '''

        # Note: This method is an example and is not consumed in this sample app

        dataset_ids = []

        # To store multiple report info
        reports = []

        for report_id in report_ids:
            report_url = f'https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}'
            api_response = requests.get(report_url, headers=self.get_request_header())

            if api_response.status_code != 200:
                abort(api_response.status_code, description=f'Error while retrieving Embed URL\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}')

            api_response = json.loads(api_response.text)
            report_config = ReportConfig(api_response['id'], api_response['name'], api_response['embedUrl'])
            reports.append(report_config.__dict__)
            dataset_ids.append(api_response['datasetId'])

        # Append additional dataset to the list to achieve dynamic binding later
        if additional_dataset_ids is not None:
            dataset_ids.extend(additional_dataset_ids)

        embed_token = self.get_embed_token_for_multiple_reports_single_workspace(report_ids, dataset_ids, workspace_id)
        embed_config = EmbedConfig(embed_token.tokenId, embed_token.token, embed_token.tokenExpiry, reports)
        return json.dumps(embed_config.__dict__)

    def get_embed_token_for_multiple_reports_single_workspace(self, report_ids, dataset_ids, target_workspace_id=None):
        '''Get Embed token for multiple reports, multiple dataset, and an optional target workspace
        Args:
            report_ids (list): Report Ids
            dataset_ids (list): Dataset Ids
            target_workspace_id (str, optional): Workspace Id. Defaults to None.
        Returns:
            EmbedToken: Embed token
        '''

        # Note: This method is an example and is not consumed in this sample app

        request_body = EmbedTokenRequestBody()

        for dataset_id in dataset_ids:
            request_body.datasets.append({'id': dataset_id})

        for report_id in report_ids:
            request_body.reports.append({'id': report_id})

        if target_workspace_id is not None:
            request_body.targetWorkspaces.append({'id': target_workspace_id})

        # Generate Embed token for multiple workspaces, datasets, and reports. Refer https://aka.ms/MultiResourceEmbedToken
        embed_token_api = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
        api_response = requests.post(embed_token_api, data=json.dumps(request_body.__dict__), headers=self.get_request_header())

        if api_response.status_code != 200:
            abort(api_response.status_code, description=f'Error while retrieving Embed token\n{api_response.reason}:\t{api_response.text}\nRequestId:\t{api_response.headers.get("RequestId")}')
        
        api_response = json.loads(api_response.text)
        embed_token = EmbedToken(api_response['tokenId'], api_response['token'], api_response['expiration'])
        return embed_token

    def get_request_header(self):
        '''Get Power BI API request header
        Returns:
            Dict: Request header
        '''
        aadService = AadService();

        if cache.get('my_token') is None:
            aadService.get_access_token()
            print("# # # GENERATING NEW TOKEN IN PROCESS... # # #")
        
        print({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cache.get('my_token')})
        return {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cache.get('my_token')}