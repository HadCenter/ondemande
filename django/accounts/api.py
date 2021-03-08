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
		# remember old state
		_mutable = request.data._mutable
		# set to mutable
		request.data._mutable = True
		# сhange the values you want
		request.data['password'] = password
		# set mutable flag back
		request.data._mutable = _mutable
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		email = request.data['email']
		email_subject = 'Création de mot de passe'
		email_body = 'Test body'
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