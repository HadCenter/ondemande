from django.urls import path
from . import views
from .views import fileCreate, uploadfileNameAPIView, uploadfileoutputNameAPIView
from django.conf.urls import url
urlpatterns = [
    path("test/", views.testCreate, name = "test-create" ),
    path("client/", views.clientCreate, name = "client-create" ),
	path("getClients/",views.clientList, name = "client-list"),
    # path("getClients/",views.contactList, name = "contact-list"),
    path('file/', fileCreate.as_view(), name='file-create'),
    path('uploadfile/<clientName>/<fileName>/', uploadfileNameAPIView.as_view(), name = "upload-file"),
    path("getFiles/", views.fileList, name = "file-list"),
    url(r'^getClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^updateClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^archiveClient/(?P<pk>[0-9]+)$', views.archive_client),
    path('uploadfile/<clientName>/<fileName>/', uploadfileNameAPIView.as_view(), name = "upload-file"),
    path('uploadFileOutput/<clientName>/<fileName>/', uploadfileoutputNameAPIView.as_view(), name = "upload-file-output"),
]