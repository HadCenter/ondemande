from django.urls import path
from . import views
urlpatterns = [
    path("getEmbedParamsForSingleReport/", views.getEmbedParamsForSingleReport, name = "test-sendTask" )
]