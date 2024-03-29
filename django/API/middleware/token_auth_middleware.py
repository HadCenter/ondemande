
import jwt
from rest_framework import status
from rest_framework.response import Response
from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import PermissionDenied
from API.settings import SECRET_KEY
class TokenAuthMiddleware(MiddlewareMixin):
    # def __init__(self, get_response):
    #     self.get_response = get_response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Get the view name as a string
        view_name = '.'.join((view_func.__module__, view_func.__name__))
        print(view_name)
        # If the view name is in our exclusion list, exit early
        exclusion_list=['accounts.views.update_reset_user_password','accounts.views.update_user_password','accounts.views.token_status','accounts.views.token_rest_status','accounts.api.LoginAPI','accounts.views.forgetPassword','embededPowerBI.views.updatePowerBiRefreshButtonStatusWS','talendEsb.views.updateMetaDataFileInTableTransactionsLivraisonWS','core.views.updateMetaDataFileInTableCoreEDIFileWS','core.views.updateMetaDataFileInTableCoreLogisticFileWS','salesforceEsb.views.makeDbChangePushMode']
        if view_name in exclusion_list:
            return None

        # Check if auth token is valid
        try:
            token = request.META['HTTP_AUTHORIZATION'] # Get token
            token = token.replace("Bearer ","")
            response = jwt.decode(token,SECRET_KEY,algorithms="HS256")
            #print(response)
            # If IP is allowed we don't do anything
            return None
        except:
            raise PermissionDenied()

    # Check if auth token is valid
    # def process_request(self, request):
    #     try:
    #         token = request.META['HTTP_AUTHORIZATION'] # Get token
    #         print(token)
    #         token = token.replace("Bearer ","")
    #         response = jwt.decode(token,"secret",algorithms="HS256")
    #         #print(response)
    #         # If IP is allowed we don't do anything
    #         return None
    #     except:
    #         raise PermissionDenied()


 
