from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from .serializers import ClientSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Client
from .serializers import FileSerializer
from .models import EDIfile
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

class fileCreate(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        print(request.data)
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def fileList(request):
    files = EDIfile.objects.all().order_by('-id')
    serializer = FileSerializer(files, many= True)
    return Response(serializer.data)




