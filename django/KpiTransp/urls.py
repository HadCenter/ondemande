from django.urls import path
from . import views
urlpatterns = [
    path("KPITransport", views.KPIHTList, name = "KPITransport"),#en utilisation et à voir la liste des clients après
    #indicecarburantAdd
    #path("AddIndiceCarburant", views.indicecarburantAdd, name = "AddIndiceCarburant"),#en utilisation et à voir la liste des clients après
    

]