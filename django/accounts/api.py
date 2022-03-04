
from django.contrib.sites.shortcuts import get_current_site
import jwt
import datetime
from .models import Account
from rest_framework.response import Response
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from rest_framework import generics, permissions
from rest_framework import status
import string
from django.core.mail import EmailMessage
import secrets
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode
from API.settings import SECRET_KEY
class LoginAPI(generics.GenericAPIView):
	serializer_class = LoginSerializer
	def post(self, request, *args, **kwargs):
		try:
			user = Account.objects.get(email=request.data['email'])
		except Exception as e:
			return Response({"message" : "l'utilisateur n'existe pas"}, status=status.HTTP_400_BAD_REQUEST)
		if(user.is_active == False):
			return Response({"message" : "l'utilisateur n'est pas active"}, status=status.HTTP_400_BAD_REQUEST)
		if(user.is_deleted == True):
			return Response({"message" : "l'utilisateur n'existe pas"}, status=status.HTTP_400_BAD_REQUEST)
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data
		payload = {
			'id': user.id,
			'iat' : datetime.datetime.utcnow()
		}
		token = jwt.encode(payload,SECRET_KEY,algorithm='HS256').decode('utf-8')
		return Response({
			'user': UserSerializer(user).data,
			'token': token
		})
class RegisterAPI(generics.GenericAPIView):
	serializer_class = RegisterSerializer
	def post(self, request, *args, **kwargs):
		password = ''.join(
			(secrets.choice(string.ascii_letters + string.digits + string.punctuation) for i in range(8)))
		_mutable = request.data._mutable
		request.data._mutable = True
		request.data['created_at'] = datetime.datetime.now()
		request.data['password'] = password
		request.data._mutable = _mutable
		try:
			serializer = self.get_serializer(data=request.data)
			serializer.is_valid(raise_exception=True)
		except Exception as e:
			try:
				usr = Account.objects.get(email = request.data['email'], is_deleted = True)
				usr.is_deleted = False
				usr.username = request.data['username']
				usr.role = request.data['role']
				usr.reports_id = request.data['reports_id']
				usr.canUpdateCapacity = request.data['canUpdateCapacity'] == "true"
				usr.save()
				return Response({"user":["added"]})
			except Exception as e1:
				print(e1)
				return Response({"email":["account with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)
				
		user = serializer.save()

		now = datetime.datetime.now()
		date_time = now.strftime("%d/%m/%Y, %H:%M:%S")
		id = user.id
		token = secrets.token_hex(16) + str(id)
		encodeToken = urlsafe_base64_encode(smart_bytes(token))
		base64_message = encodeToken
		current_site = get_current_site(request)
		current_site_domain = current_site.domain.split(':')[0]
		absurl = f'http://{current_site_domain}/#/user-password?token={encodeToken}'
		email_body = f'Bonjour,\n\nVotre compte onDemand a été créé le {date_time}.\n\n' \
					 'Afin de confirmer la création de votre compte, nous vous invitons à cliquer sur ' + \
					 absurl + '.\n\n'+\
					 'Ce lien expirera dans 2 jours, assurez-vous de l\'utiliser bientôt.\n\n' \
					 'Nous vous rappelons que votre identifiant correspond à votre adresse email.\n\n' + \
					 'Cordialement.\n\n' \
					 'L\'équipe Ecolotrans.'
		email = request.data['email']
		email_subject = 'Création de mot de passe'
		email = EmailMessage(
			email_subject,
			email_body,
			'onDemandSupport@redlean.io',
			[email],
		)
		email.send(fail_silently=False)
		return Response({
			'user': UserSerializer(user).data,
		})
class UserAPI(generics.RetrieveAPIView):
	permission_classes = [
		permissions.IsAuthenticated
	]
	serializer_class = UserSerializer

	def get_object(self):
		return self.request.user