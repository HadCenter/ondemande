from .models import Account
# from .models import Profile
from django.contrib.auth import authenticate

from rest_framework.fields import ReadOnlyField
from rest_framework import serializers



class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()

	def validate(self, data):
		user = authenticate(**data)
		if user:
			return user
		raise serializers.ValidationError('Incorrect Credentials')

class RegisterSerializer(serializers.ModelSerializer):
	# profile = ReadOnlyField(source='role.label')
	class Meta:
		model = Account
		fields = ('id', 'email', 'username', 'password', 'is_superadmin', 'is_admin', 'created_at')
		# fields = '__all__'
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		print(validated_data)
		user = Account.objects.create_user(
            email=validated_data["email"],
			username=validated_data["username"],
			password=validated_data["password"],
			is_superadmin = validated_data["is_superadmin"],
			is_admin = validated_data["is_admin"],
			created_at=validated_data["created_at"],
		)
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = Account
		fields = ('id','email','username','is_active','is_superadmin','is_admin', 'last_login' )

# class RoleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = '__all__'


