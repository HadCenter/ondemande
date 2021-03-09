from django.shortcuts import render
from rest_framework.response import Response
from .models import Account
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from rest_framework import status
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
# Create your views here.
# @api_view(['GET'])
# def roleList(request):
#     profiles = Profile.objects.all().order_by('-id')
#     print(profiles)
#     serializer = RoleSerializer(profiles, many= True)
#     return Response(serializer.data)
@api_view(['GET'])
def userList(request):
    users = Account.objects.all().order_by('-id')
    serializer = UserSerializer(users, many= True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
def user_detail(request, pk):
    try:
        user = Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return JsonResponse({'message': 'le client n''existe pas !'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_serializer = UserSerializer(user)
        return JsonResponse(user_serializer.data)
    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        print(user_data)
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user_password (request):
    print(request.data)
    user = Account.objects.get(pk=request.data['id'])
    if request.method == 'PUT':
        user_serializer = UserSerializer(user)
        if(request.data['password1'] != request.data['password2']):
            return JsonResponse({"message" : "erreur"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.set_password(request.data['password1'])
            user.save()
            return JsonResponse(user_serializer.data)
        # if user_serializer.is_valid():
        #     print("ahmed")
        #     user.set_password(request.data['password1'])
        #     user.save()
        #     return JsonResponse(user_serializer.data)
        # return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)