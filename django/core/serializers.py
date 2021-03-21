from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import Client
from .models import EDIfile
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
class FileSerializer(serializers.ModelSerializer):
    client_name = ReadOnlyField(source='client.nom_client')
    class Meta:
        model = EDIfile
        fields = '__all__'
class ClientTestSerialize(serializers.ModelSerializer):
    files = FileSerializer(read_only=True,many=True)
    class Meta:
        model = Client
        fields = ['nom_client','files']



