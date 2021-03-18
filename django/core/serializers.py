from rest_framework import serializers
from rest_framework.fields import ReadOnlyField

from .models import Client
from .models import EDIfile
# from salesforceEsb.models import Contact
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
class FileSerializer(serializers.ModelSerializer):
    client_name = ReadOnlyField(source='client.nom_client')
    class Meta:
        model = EDIfile
        fields = '__all__'
# class ContactSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Contact
#         fields = ['code_client','last_name','email']


