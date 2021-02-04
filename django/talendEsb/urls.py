from django.urls import path

from . import views

urlpatterns = [
    path('startEngineOnEdiFiles', views.startEngineOnEdiFiles),
]