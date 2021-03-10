from .models import Account
from rest_framework.response import Response
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from knox.models import AuthToken
from rest_framework import generics, permissions
from django.contrib.auth import login
from rest_framework import status
import secrets
import string
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt
from django.conf import settings
class LoginAPI(generics.GenericAPIView):
	serializer_class = LoginSerializer
	def post(self, request, *args, **kwargs):
		user = Account.objects.get(email=request.data['email'])
		if(user.is_active == False):
			return Response({"message" : "l'utilisateur n'est pas active"}, status=status.HTTP_400_BAD_REQUEST)
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data
		login(request, user)
		return Response({
			'user': UserSerializer(user).data,
			'token': AuthToken.objects.create(user)[1]
		})

class RegisterAPI(generics.GenericAPIView):
	serializer_class = RegisterSerializer

	def post(self, request, *args, **kwargs):
		password = ''.join(
			(secrets.choice(string.ascii_letters + string.digits + string.punctuation) for i in range(8)))
		_mutable = request.data._mutable
		request.data._mutable = True
		request.data['password'] = password
		request.data._mutable = _mutable
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		# uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
		uidb64 = user.id
		token = PasswordResetTokenGenerator().make_token(user)
		current_site = get_current_site(
			request=request).domain
		relativeLink = reverse(
			'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
		absurl = f'http://{current_site}/#/user-password/{uidb64}/{token}/'
		email_body = 'Hello, \n Use link below to create your password  \n' + \
					 absurl
		# data = {'email_body': email_body, 'to_email': user.email,
		# 		'email_subject': 'Reset your passsword'}
		email = request.data['email']
		email_subject = 'Création de mot de passe'
		# email_body = 'Test body'
		email = EmailMessage(
			email_subject,
			email_body,
			'ahmedbelaiba19952018@gmail.com',
			[email],
		)
		email.send(fail_silently=False)
		return Response({
			'user': UserSerializer(user).data,
			# 'token': AuthToken.objects.create(user)[1]
		})
class UserAPI(generics.RetrieveAPIView):
	permission_classes = [
		permissions.IsAuthenticated
	]
	serializer_class = UserSerializer

	def get_object(self):
		return self.request.user