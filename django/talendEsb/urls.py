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
    path("deleteTransaction/", views.deleteTransaction, name = "deleteTransaction" ), #en cours de dev
]