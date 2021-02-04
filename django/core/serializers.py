from rest_framework import serializers
from .models import Client
from .models import EDIfile
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EDIfile
        fields = '__all__'
