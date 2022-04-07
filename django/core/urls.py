from django.urls import path
from . import views
from django.conf.urls import url


urlpatterns = [
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', views.fileCreate, name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
    path("getArchivedFiles/", views.archivedFileList, name = "archived-file-list"),
    path("deleteFileEDI/", views.delete_fileEDI),
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
    path('logisticFile/', views.LogisticFileCreate, name='logistic-file-create'),
    path("getLogisticFiles/", views.logisticFileList, name = "logistic-file-list"),
    path('getLogisticFile/<int:pk>', views.logistic_file_detail),
    path('seeLogisticFileContent', views.seeLogisticFileContent, name="seeLogisticFileContent"),
    path('validateLogisticFile', views.validateLogisticFileWS, name= "validateLogisticFile"),
    path('downloadImportedLogisticFile', views.downloadImportedLogisticFileWS, name= "downloadImportedLogisticFile"),
    path('deleteNotValidateLogisticFile', views.deleteNotValidateLogisticFileWS, name= "deleteNotValidateLogisticFile"),
    path('updateMetaDataFileInTableCoreEDIFile', views.updateMetaDataFileInTableCoreEDIFileWS, name= "updateMetaDataFileInTableCoreEDIFile"),
    path('updateMetaDataFileInTableCoreLogisticFile', views.updateMetaDataFileInTableCoreLogisticFileWS,name="updateMetaDataFileInTableCoreLogisticFile"),
    path('createLogisticFile', views.createLogisticFileFromColumnAndRows, name="createLogisticFileFromColumnAndRows"),
    path('createLogisticFileAndValidateFile', views.createLogisticFileAndValidateFile, name="createLogisticFileAndValidateFile"),

]