from django.urls import path

from . import views

urlpatterns = [
    path('startEngineOnEdiFiles', views.startEngineOnEdiFiles),
    path('integrerMADFile', views.integrerMADFile),
    path('genererMADFile', views.genererMADFile),
    path('correctExceptionFile', views.correctExceptionFile),
    path('correctMetadataFile', views.correctMetadataFile),
    #TODO MAD FILE AFTER ZIED TALEND JOB IS DONE
    #path('correctMADFile', views.correctMetadataFile),

    path('getAllTransactionMadLivraison', views.getAllTransactionMadLivraison),
    path('getSingleTransactionMadLivraison/<int:pk>', views.getSingleTransactionMadLivraison)
]