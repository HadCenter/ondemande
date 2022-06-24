from django.urls import path

from . import views

urlpatterns = [
    path('startEngineOnEdiFiles', views.startEngineOnEdiFiles),
    path('integrerMADFile', views.integrerMADFile),
    path('genererMADFile', views.genererMADFile),
    path('correctExceptionFile', views.correctExceptionFile),
    path('correctMetadataFile', views.correctMetadataFile),
    path('correctMADFile', views.correctMADFile),
    path('correctLivraisonFile', views.correctLivraisonFile),
    path('correctAllFiles', views.correctAllFiles),
    path('getAllTransactionMadLivraison', views.getAllTransactionMadLivraison),
    path('getSingleTransactionMadLivraison/<int:pk>', views.getSingleTransactionMadLivraison),
    path('startEngineOnMagistorFiles', views.startEngineOnMagistorFiles),
    path('updateMetaDataFileInTableTransactionsLivraison', views.updateMetaDataFileInTableTransactionsLivraisonWS, name="updateMetaDataFileInTableTransactionsLivraison"),
    path('downloadLivraisonFile', views.downloadLivraisonFile, name= "downloadLivraisonFile"),
    path('getAllFacturationTransport/', views.getAllFacturationTransport, name= "getAllFacturationTransport"),
    path('downloadFacturationTransport/', views.downloadFacturationTransport, name= "downloadFacturationTransport"),
    path('GetAllFacturePDFFromSalesforce/', views.GetAllFacturePDFFromSalesforce, name= "GetAllFacturePDFFromSalesforce"),
    path('checkFacturationForFile/', views.checkFacturationForFile, name= "checkFacturationForFile"),
    path('downloadFacturePDFFromSalesforce/', views.downloadFacturePDFFromSalesforce, name= "downloadFacturePDFFromSalesforce"),
    path('changeFacturePrice/', views.changeFacturePriceSF, name= "changeFacturePriceSF"),
    path('getAllJobPlans/', views.getAllJobPlans, name= "getAllJobPlans"),
    path('launchPlan/', views.launchPlan, name= "launchPlan"),
    path('changePlanStatusWS/', views.changePlanStatusWS, name= "changePlanStatusWS"),
    path('checkFileMAD/', views.checkFileMAD, name= "checkFileMAD"),
    path("removeclientsandCopyMADFile/", views.removeclientsandCopyMADFile, name = "removeclientsandCopyMADFile" ), #en cours de dev

    path('test/', views.test, name= "test"),

]