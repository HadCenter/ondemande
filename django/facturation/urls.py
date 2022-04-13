from django.urls import path
from . import views
urlpatterns = [
    path("getListClient/", views.getListClient, name = "getListClient"), #en utilisation et à voir la liste des clients après
    path("getMatricePerParam/", views.getMatriceByParam, name = "getMatriceByParam"), #n'est pas utilisé
    path("getMatricePerClient/", views.getMatriceByClient, name = "getMatriceByClient"),#en utilisation
    path("updateMatrice/", views.updateMatriceForClient, name = "update-matrice-pour-client" ), #n'est pas utilisé
    path("updateAllMatrice/", views.updateAllMatriceForClient, name = "update-all-matrice-pour-client" ), #obsoléte
    path("updateAllMatriceV2/", views.updateAllMatriceForClientV2, name = "update-all-matrice-pour-client-v2" ),#en utilisation
    path("caculateFacturationForClient/", views.caculateFacturationForClient, name = "caculateFacturationForClient" ), #pour test
    path("caculateFacturationByManut/", views.caculateFacturationByUnite, name = "caculateFacturationForClientUnité Manutention" ),#en cours de dev
    path("caculateFacturationByDate/", views.caculateFacturationByDate, name = "caculateFacturationByDate" ),# pour test
    path("addFacturation/", views.addFacturation, name = "addFacturationinDB" ), #en utilisation
    path("addMonthFacturation/", views.addMonthFacturation, name = "addMonthFacturationinDB" ), #n'est pas utilisé
    path("getFacturationForClient/", views.getFacturation, name = "getFacturationfromDB" ), #en utilisation
    path("getMonthListFacturationForClient/", views.getMonthFacturation, name = "getMonthFacturationfromDB" ),#en utilisation
    path("getMonthFacturationWithTotal/", views.getMonthFacturationWithTotal, name = "getMonthFacturationfromDBWithTotal" ),#en cours de dev
    path("CalculateRealUM/", views.CalculateRealUM, name = "CalculateRealUM" ),#en cours de dev 
]