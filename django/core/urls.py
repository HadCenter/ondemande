from django.urls import path
from . import views
from django.conf.urls import url


urlpatterns = [
	path("getClients/",views.clientList, name = "client-list"),
    path('file/', views.fileCreate, name='file-create'),
    path("getFiles/", views.fileList, name = "file-list"),
    path("getFilesByClient/", views.getFilesByClient, name = "file-list"),
    url(r'^getClient/(?P<pk>[0-9]+)$', views.client_detail),
    url(r'^getFile/(?P<pk>[0-9]+)$', views.file_detail),
    url(r'^updateClient/(?P<pk>[0-9]+)$', views.client_detail),
    path('downloadFile/', views.downloadFileName, name = "upload-file"),
    path('seeFileContent', views.seeFileContent, name="seeFileContent"),
    path('getNumberOfFilesPerClient/', views.numberOfFilesPerClient, name="numberOfFilesPerClient"),
    path('createFileFromColumnAndRowsAndUpdate/', views.createFileFromColumnAndRowsAndUpdate, name="createFileFromColumnAndRowsAndUpdate"),
    path('createFileFromColumnAndRows/', views.createFileFromColumnAndRows, name="createFileFromColumnAndRowsAndUpdate"),
    path('DoInterventionAsAdminForEdiFileAndCorrectFile/', views.DoInterventionAsAdminForEdiFileAndCorrectFile, name="DoInterventionAsAdminForEdiFileAndCorrectFile"),
    path('DoInterventionAsAdminForEdiFileAndChangeFile/', views.DoInterventionAsAdminForEdiFileAndChangeFile, name="DoInterventionAsAdminForEdiFileAndChangeFile"),
    path('kpi3/',views.kpi3 , name = "kpi3"),
    path('getNumberOfAnomaliesPerDate',views.getNumberOfAnomaliesPerDate , name = "getNumberOfAnomaliesPerDate"),
    path('getNumberOfAnomaliesPerDateAll',views.getNumberOfAnomaliesPerDateAll , name = "getNumberOfAnomaliesPerDate"),
    path('getNumberOfAnomaliesPerId',views.getNumberOfAnomaliesPerId , name = "getNumberOfAnomaliesPerId"),
    path('getNumberOfAnomaliesPerIdAll',views.getNumberOfAnomaliesPerIdAll , name = "getNumberOfAnomaliesPerIdAll"),
    path('getNumberOfAnomaliesWithFilters',views.getNumberOfAnomaliesWithFilters , name = "getNumberOfAnomaliesWithFilters"),
    path('getNumberOfInterventionsWithFilters',views.getNumberOfInterventionsWithFilters , name = "getNumberOfInterventionsWithFilters"),
    path('getNumberOfFilesWithFilters', views.getNumberOfFilesWithFilters,name="getNumberOfFilesWithFilters"),
    path('seeFileContentMADFile',views.seeFileContentMADFile , name= "seeFileContentMADFile"),
    path('seeAllFileContentMADFile',views.seeAllFileContentMADFile , name= "seeAllFileContentMADFile"),
    path('getNumberOfInterventionsPerDateAll', views.getNumberOfInterventionsPerDateAll, name="getNumberOfInterventionsPerDateAll"),
    path('getNumberOfFilesPerDateAll', views.getNumberOfFilesPerDateAll,name="getNumberOfFilesPerDateAll"),

]