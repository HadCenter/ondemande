from django.urls import path
from . import views
from django.conf.urls import url


urlpatterns = [
    path('getNumberOfFilesPerClient/', views.numberOfFilesPerClient, name="numberOfFilesPerClient"),
    path('kpi3/', views.kpi3 , name = "kpi3"),
    path('getNumberOfAnomaliesPerDate',views.getNumberOfAnomaliesPerDate , name = "getNumberOfAnomaliesPerDate"),
    path('getNumberOfAnomaliesPerDateAll',views.getNumberOfAnomaliesPerDateAll , name = "getNumberOfAnomaliesPerDate"),
    path('getNumberOfAnomaliesPerId',views.getNumberOfAnomaliesPerId , name = "getNumberOfAnomaliesPerId"),
    path('getNumberOfAnomaliesPerIdAll',views.getNumberOfAnomaliesPerIdAll , name = "getNumberOfAnomaliesPerIdAll"),
    path('getNumberOfAnomaliesWithFilters',views.getNumberOfAnomaliesWithFilters , name = "getNumberOfAnomaliesWithFilters"),
    path('getNumberOfInterventionsWithFilters',views.getNumberOfInterventionsWithFilters , name = "getNumberOfInterventionsWithFilters"),
    path('getNumberOfFilesWithFilters', views.getNumberOfFilesWithFilters,name="getNumberOfFilesWithFilters"),
    path('getNumberOfInterventionsPerDateAll', views.getNumberOfInterventionsPerDateAll, name="getNumberOfInterventionsPerDateAll"),
    path('getNumberOfFilesPerDateAll', views.getNumberOfFilesPerDateAll,name="getNumberOfFilesPerDateAll"),

]