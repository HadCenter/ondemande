from django.shortcuts import render
from rest_framework.response import Response
from .models import Profile
from rest_framework.decorators import api_view
from .serializers import RoleSerializer
# Create your views here.
@api_view(['GET'])
def roleList(request):
    profiles = Profile.objects.all().order_by('-id')
    print(profiles)
    serializer = RoleSerializer(profiles, many= True)
    return Response(serializer.data)