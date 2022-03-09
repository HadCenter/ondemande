import logging
import pytz
import datetime
import jwt
SECRET_KEY = 'o87w7g(!mb8o8fs^&7=w9prsjnwkt05azo8#bpg6_r=p*yt#)%'

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import smart_str
from rest_framework.response import Response
from .models import Account, Tokensforgetpassword
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.utils.http import urlsafe_base64_decode
from django.core.mail import EmailMessage
@api_view(['GET'])
def userList(request):
    users = Account.objects.filter(is_deleted = False).order_by('-id')
    serializer = UserSerializer(users, many= True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
def user_detail(request, pk):
    try:
        user = Account.objects.get(pk=pk, is_deleted = False)
    except Account.DoesNotExist:
        return JsonResponse({'message': 'le client n''existe pas !'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_serializer = UserSerializer(user)
        return JsonResponse(user_serializer.data)
    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user_password (request):
    token = request.data['token']
    print(token)
    message = smart_str(urlsafe_base64_decode(token))
    print(message)
    id = message[32:]
    account = Account.objects.get(pk=id)
    # user = Account.objects.get(pk=id)
    if request.method == 'PUT':
        user_serializer = UserSerializer(account)
        if(request.data['password1'] != request.data['password2']):
            return JsonResponse({"message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            account.is_active = True
            account.set_password(request.data['password1'])
            account.save()
            return JsonResponse(user_serializer.data)

@api_view(['PUT'])
def update_reset_user_password(request):
    token = request.data['token']
    decode = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    id = decode['id']
    account = Account.objects.get(pk=id)
    if request.method == 'PUT':
        user_serializer = UserSerializer(account)
        if (request.data['password1'] != request.data['password2']):
            return JsonResponse({"message": "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            account.set_password(request.data['password1'])
            account.save()
            token_object = Tokensforgetpassword.objects.get(token=token,account=account)
            token_object.delete()

            authLogger = logging.getLogger('auth')
            authLogger.info("UPDATED PASSWORDD : the user {} with id {} just updated his password!".format(account.email, account.id))

            return JsonResponse(user_serializer.data)

@api_view(['POST'])
def token_status (request):
    token = request.data['token']
    message = smart_str(urlsafe_base64_decode(token))
    id = message[32:]
    account = Account.objects.get(pk=id)
    now = datetime.datetime.utcnow()
    print("NOOOOOOOOW :  ",now.replace(tzinfo=datetime.timezone.utc))
    print("CREATED A IS :  ",account.created_at)
    c = now.replace(tzinfo=datetime.timezone.utc) - account.created_at
    print("COMPARE IS :  ",c)
    minutes = c.total_seconds() / 60
    if minutes > 2880 or account.is_active == True or account.is_deleted == True:
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message' : 'token est encore valide'}, status = status.HTTP_200_OK)


@api_view(['POST'])
def forgetPassword(request):
    authLogger = logging.getLogger('auth')
    authLogger.info("FORGET PASSWORD : the user {} just demanded a new password!".format(request.data['email']))

    try:
        account = Account.objects.get(email=request.data['email'])
    except :
        return Response({'message':'Utilisateur n\'est pas actif/n\'existe pas'},status.HTTP_200_OK)
    if(account.is_active == False or account.is_deleted == True):
        return Response({'message':'Utilisateur n\'est pas actif/n\'existe pas'},status.HTTP_200_OK)
    payload = {
        'id': account.id,
        'iat': datetime.datetime.utcnow()
    }
    #print("TIME WHEN EMAIL SENT IS :  ",datetime.datetime.now())
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
    token_forget_password = Tokensforgetpassword(token = token,account = account)
    token_forget_password.save()
    current_site = get_current_site(request)
    current_site_domain = current_site.domain.split(':')[0]
    absurl = f'http://{current_site_domain}/#/forgot-password?token={token}'
    email_body = f'Bonjour,\n\n' \
                 'Vous avez oublié votre mot de passe pour accéder à votre espace onDemand . Pour définir un nouveau mot de passe, il vous suffit de cliquer sur le lien ci-dessous : \n' + \
                 absurl + '.\n\n' + \
                 'Ce lien expirera dans 30 minutes, assurez-vous de l\'utiliser bientôt.\n\n' \
                 'Merci.'
    email = request.data['email']
    email_subject = 'Réinitialisation de mot de passe'
    email = EmailMessage(
        email_subject,
        email_body,
        'ahmedbelaiba19952018@gmail.com',
        [email],
    )
    email.send(fail_silently=False)
    return Response({'message':'success'},status.HTTP_200_OK)

@api_view(['POST'])
def token_rest_status(request):
    token = request.data['token']
    decode = jwt.decode(token, SECRET_KEY, algorithms="HS256")
    now = datetime.datetime.now()
    print("now",now)
    print("decode_iat",decode['iat'])
    print(datetime.datetime.fromtimestamp(decode['iat']))
    c = now - datetime.datetime.fromtimestamp(decode['iat']) 
    minutes = c.total_seconds() / 60
    print("minutes", minutes," AND  difference in minutes is :  ",c)
    try:
        token_object = Tokensforgetpassword.objects.get(token=token)
    except :
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)
    if minutes < 30 :
        return Response({'message': 'token est encore valide'}, status=status.HTTP_200_OK)
    else:
        token_object.delete()
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)