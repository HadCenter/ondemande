from django.urls import path
from .views import sendTask

urlpatterns = [
    path("testTask/", sendTask, name = "test-sendTask" )
]