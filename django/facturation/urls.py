from django.urls import path
from . import views
urlpatterns = [
    path("getListClient/", views.getListClient, name = "getListClient"), #en utilisation et à voir la liste des clients après
    path("getMatricePerClient/", views.getMatriceByClient, name = "getMatriceByClient"),#en utilisation
    path("updateAllMatriceV2/", views.updateAllMatriceForClientV2, name = "update-all-matrice-pour-client-v2" ),#en utilisation
    path("caculateFacturationByManut/", views.caculateFacturationByUnite, name = "caculateFacturationForClientUnité Manutention" ),#en cours de dev
    path("addFacturation/", views.addFacturation, name = "addFacturationinDB" ), #en utilisation
    path("getFacturationForClient/", views.getFacturation, name = "getFacturationfromDB" ), #en utilisation
    path("getMonthFacturationWithTotal/", views.getMonthFacturationWithTotal, name = "getMonthFacturationfromDBWithTotal" ),#en cours de dev
    path("CalculateRealUM/", views.CalculateRealUM, name = "CalculateRealUM" ),#en cours de dev 
    path("getHolidays/", views.getHolidays, name = "get-holidays" ),#en cours de dev 
    path("updateHolidays/", views.updateHolidays, name = "update-holidays" ),#en cours de dev 
    path("downloadFacturationPreparation/", views.downloadExcelFacturation, name = "downloadExcelFacturation" ), #en cours de dev

]