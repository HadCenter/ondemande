from django.urls import path
from . import views
from .views import fileCreate
from django.conf.urls import url
urlpatterns = [
    path("client/", views.clientCreate, name = "client-create" ),
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', fileCreate.as_view(), name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
    url(r'^getClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^updateClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^archiveClient/(?P<pk>[0-9]+)$', views.archive_client),
]