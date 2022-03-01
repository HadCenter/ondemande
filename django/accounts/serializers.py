from .models import Account
from django.contrib.auth import authenticate
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
	class Meta:
		model = Account
		fields = ('id', 'email', 'username', 'password', 'role', 'created_at','reports_id','canUpdateCapacity')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		user = Account.objects.create_user(
            email=validated_data["email"],
			username=validated_data["username"],
			password=validated_data["password"],
			role = validated_data["role"],
			created_at=validated_data["created_at"],
			reports_id=validated_data["reports_id"],
			canUpdateCapacity=validated_data["canUpdateCapacity"],
		)
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = Account
		fields = ('id','email','username','is_active','role','reports_id','canUpdateCapacity','is_deleted' )


