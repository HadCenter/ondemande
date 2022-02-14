from django.urls import path
from . import views
urlpatterns = [
    path("getSingleReport/<str:id>", views.getEmbedParamsForSingleReport, name = "get-single-report" ),
    path("getAllReports/", views.getMultipleReports, name = "get-all-reports" ),
    path("getUserReports/<str:id>", views.getUserReports, name = "get-user-reports" ),
    path("getUserToken/", views.getUserToken, name = "get-user-token" ),
    path("resume/", views.resume, name = "resume-capacity" ),
    path("suspend/", views.suspend, name = "suspend-capacity" ),
    path("getCapacityState/", views.getCapacityState, name = "get-capacity-state" ),
    path("refreshReport/<str:id>", views.refreshReport, name = "refresh-report" ),
    path("getRefreshState/<str:id>", views.getRefreshState, name = "refresh-report" ),
    path("refreshDatabase", views.refreshDatabase, name = "refresh-database" ),
    path("updatePowerBiRefreshButtonStatus", views.updatePowerBiRefreshButtonStatusWS, name = "updatePowerBiRefreshButtonStatus" ),
    path("getPowerBiRefreshButtonStatus", views.getPowerBiRefreshButtonStatus, name = "getPowerBiRefreshButtonStatus" ),


]