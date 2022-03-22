from django.urls import path
from . import views
urlpatterns = [
    path("getListClient/", views.getListClient, name = "getListClient"),
    path("getMatricePerParam/", views.getMatriceByParam, name = "getMatriceByParam"),
    path("getMatricePerClient/", views.getMatriceByClient, name = "getMatriceByClient"),
    path("updateMatrice/", views.updateMatriceForClient, name = "update-matrice-pour-client" ),
    path("updateAllMatrice/", views.updateAllMatriceForClient, name = "update-all-matrice-pour-client" ),
    path("caculateFacturationForClient/", views.caculateFacturationForClient, name = "caculateFacturationForClient" ),
    path("caculateFacturationByDate/", views.caculateFacturationByDate, name = "caculateFacturationByDate" ),
    path("addFacturation/", views.addFacturation, name = "addFacturationinDB" ),
    path("getFacturationForClient/", views.getFacturation, name = "getFacturationfromDB" ),

]