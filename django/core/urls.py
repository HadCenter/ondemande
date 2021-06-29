from django.urls import path
from . import views
from django.conf.urls import url


urlpatterns = [
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', views.fileCreate, name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
    path("archiverFileEDI/", views.archive_fileEDI),
    path("getFilesByClient/<str:pk>", views.getFilesByClient, name = "file-list"),
    path('getClient/<int:pk>', views.client_detail),
    path('getFile/<int:pk>', views.file_detail),
    path('updateClient/<int:pk>', views.client_detail_update),
    path('downloadFile/', views.downloadFileName, name = "upload-file"),
    path('seeFileContent', views.seeFileContent, name="seeFileContent"),
    path('createFileFromColumnAndRowsAndUpdate/', views.createFileFromColumnAndRowsAndUpdate, name="createFileFromColumnAndRowsAndUpdate"),
    path('createFileFromColumnAndRows/', views.createFileFromColumnAndRows, name="createFileFromColumnAndRowsAndUpdate"),
    path('DoInterventionAsAdminForEdiFileAndCorrectFile/', views.DoInterventionAsAdminForEdiFileAndCorrectFile, name="DoInterventionAsAdminForEdiFileAndCorrectFile"),
    path('DoInterventionAsAdminForEdiFileAndChangeFile/', views.DoInterventionAsAdminForEdiFileAndChangeFile, name="DoInterventionAsAdminForEdiFileAndChangeFile"),
    path('seeFileContentMADFile',views.seeFileContentMADFile , name= "seeFileContentMADFile"),
    path('seeAllFileContentMADFile',views.seeAllFileContentMADFile , name= "seeAllFileContentMADFile"),

]