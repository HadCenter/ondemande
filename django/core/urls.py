from django.urls import path
from . import views
from .views import fileCreate
urlpatterns = [
    path("client/", views.clientCreate, name = "client-create" ),
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', fileCreate.as_view(), name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
]