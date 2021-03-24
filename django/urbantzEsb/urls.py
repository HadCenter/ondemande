from django.urls import path
from .views import SendFromFileToUrbantzAsTasks

urlpatterns = [
    path("SendFromFileToUrbantzAsTasks/", SendFromFileToUrbantzAsTasks, name = "test-sendTask" )
]