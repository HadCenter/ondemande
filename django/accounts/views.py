import pytz
from datetime import datetime
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.utils.encoding import smart_str, force_str
from rest_framework.response import Response
from .models import Account, UserUniqueToken
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from rest_framework import status
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status, views, permissions
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
@api_view(['GET'])
def userList(request):
    users = Account.objects.all().order_by('-id')
    serializer = UserSerializer(users, many= True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
def user_detail(request, pk):
    try:
        user = Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return JsonResponse({'message': 'le client n''existe pas !'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_serializer = UserSerializer(user)
        return JsonResponse(user_serializer.data)
    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        print(user_data)
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user_password (request):
    # uidb64 = request.data['id']
    # id = smart_str(urlsafe_base64_decode(uidb64))
    user = Account.objects.get(pk=request.data['id'])
    # user = Account.objects.get(pk=id)
    if request.method == 'PUT':
        user_serializer = UserSerializer(user)
        if(request.data['password1'] != request.data['password2']):
            return JsonResponse({"message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.is_active = True
            user.set_password(request.data['password1'])
            user.save()
            return JsonResponse(user_serializer.data)

class PasswordTokenCheckAPI(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        pass

@api_view(['POST'])
def token_status (request):
    token = request.data['token']
    user_token = get_object_or_404(UserUniqueToken, token=token)  # get object or throw 404
    now = datetime.utcnow().replace(tzinfo=pytz.utc)
    # now = datetime.now()
    # returns a timedelta object
    c = now - user_token.datetime
    minutes = c.total_seconds() / 60
    print(minutes)
    if minutes > 5:
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message' : 'token est encore valide'}, status = status.HTTP_200_OK)
    # user = Account.objects.get(pk=request.data['id'])
    # token = request.data['token']
    # if not PasswordResetTokenGenerator().check_token(user, token):
    #     return Response({'error' : 'Token is not valide'}, status= status.HTTP_400_BAD_REQUEST)
    # else:
    #     return Response({'message' : 'token est encore valide'}, status = status.HTTP_200_OK)
