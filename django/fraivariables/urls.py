from django.urls import path
from . import views
urlpatterns = [
    path("carburant", views.carburantList, name = "carburant"),#en utilisation et à voir la liste des clients après
    path("carburant/<int:pk>", views.carburantList_detail, name = "carburant"),#en utilisation et à voir la liste des clients après
    path("pnumatique", views.pnumatiqueList, name = "pnumatique"),#en utilisation et à voir la liste des clients après
    path("pnumatique/<int:pk>", views.pnumatiqueList_detail, name = "pnumatique"),
    path("entretien", views.entretienList, name = "entretien"),#en utilisation et à voir la liste des clients après
    path("entretien/<int:pk>", views.entretienList_detail, name = "entretien"),
    path("IndiceCarburant", views.indicecarburantList, name = "IndiceCarburant"),#en utilisation et à voir la liste des clients après
    path("IndiceCarburant/<int:pk>", views.IndiceCarburantList_detail, name = "IndiceCarburant"),
    #indicecarburantAdd
    #path("AddIndiceCarburant", views.indicecarburantAdd, name = "AddIndiceCarburant"),#en utilisation et à voir la liste des clients après
    

]