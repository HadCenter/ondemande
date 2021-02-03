from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ClientSerializer
from .models import Client
# Create your views here.


@api_view(['POST'])
def clientCreate(request):
    serializer = ClientSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def clientList(request):
    clients = Client.objects.all().order_by('-id')
    serializer = ClientSerializer(clients, many= True)
    return Response(serializer.data)




