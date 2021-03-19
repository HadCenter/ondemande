import pytz
from datetime import datetime
import secrets
from django.utils.encoding import smart_bytes
from django.utils.encoding import smart_str
from rest_framework.response import Response
from .models import Account
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import EmailMessage
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
    print(token)
    message = smart_str(urlsafe_base64_decode(token))
    print(message)
    id = message[32:]
    account = Account.objects.get(pk=id)
    if request.method == 'PUT':
        user_serializer = UserSerializer(account)
        if (request.data['password1'] != request.data['password2']):
            return JsonResponse({"message": "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            account.set_password(request.data['password1'])
            account.save()
            return JsonResponse(user_serializer.data)
class PasswordTokenCheckAPI(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        pass

@api_view(['POST'])
def token_status (request):
    token = request.data['token']
    print(token)
    message = smart_str(urlsafe_base64_decode(token))
    print(message)
    id = message[32:]
    account = Account.objects.get(pk=id)
    now = datetime.utcnow().replace(tzinfo=pytz.utc)
    print(now)
    print(account.created_at)
    c = now - account.created_at
    minutes = c.total_seconds() / 60
    print(minutes)
    if minutes > 30:
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message' : 'token est encore valide'}, status = status.HTTP_200_OK)


@api_view(['POST'])
def forgetPassword(request):
    try:
        account = Account.objects.get(email=request.data['email'])
    except :
        return Response({'message':'Votre compte n\'existe plus/n\'est pas actif'},status.HTTP_200_OK)
    if(account.is_active == False):
        return Response({'message':'Votre compte n\'existe plus/n\'est pas actif'},status.HTTP_200_OK)
    account.updated_at = datetime.utcnow().replace(tzinfo=pytz.utc)
    account.save()
    id = account.id
    token = secrets.token_hex(16) + str(id)
    encodeToken = urlsafe_base64_encode(smart_bytes(token))
    base64_message = encodeToken.decode('ascii')
    absurl = f'http://52.47.208.8/#/forgot-password?token={base64_message}'
    email_body = f'Bonjour,\n\n' \
                 'Vous avez oublié votre mot de passe pour accéder à votre espace onDemand . Pour définir un nouveau mot de passe, il vous suffit de cliquer sur le lien ci-dessous : ' + \
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
    message = smart_str(urlsafe_base64_decode(token))
    id = message[32:]
    account = Account.objects.get(pk=id)
    now = datetime.utcnow().replace(tzinfo=pytz.utc)
    c = now - account.updated_at
    minutes = c.total_seconds() / 60
    print(minutes)
    if minutes > 30:
        return Response({'error': 'Token is not valide'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'token est encore valide'}, status=status.HTTP_200_OK)
