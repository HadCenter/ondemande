from django.urls import path
from . import views
from django.conf.urls import url

from .views import fileCreate

urlpatterns = [
    path("client/", views.clientCreate, name = "client-create" ),
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', fileCreate.as_view(), name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
    url(r'^getClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^getFile/(?P<pk>[0-9]+)$', views.file_detail),
    url(r'^updateClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^archiveClient/(?P<pk>[0-9]+)$', views.archive_client),
    path('downloadFile/', views.downloadFileName, name = "upload-file"),
    path('downloadFileOutput/', views.downloadFileoutputName, name ="upload-file-output"),
    path('seeFileContent', views.seeFileContent, name="seeFileContent"),

]