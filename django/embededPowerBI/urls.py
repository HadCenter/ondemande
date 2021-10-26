from django.urls import path
from . import views
urlpatterns = [
    path("getSingleReport/<str:id>", views.getEmbedParamsForSingleReport, name = "get-single-report" ),
    path("getAllReports/", views.getMultipleReports, name = "get-single-report" ),
    path("getUserToken/", views.getUserToken, name = "get-user-token" ),
    path("resume/", views.resume, name = "resume-capacity" ),
    path("suspend/", views.suspend, name = "suspend-capacity" ),
    path("getCapacityState/", views.getCapacityState, name = "get-capacity-state" ),
    path("refreshReport/<str:id>", views.refreshReport, name = "refresh-report" ),
    path("getRefreshState/<str:id>", views.getRefreshState, name = "refresh-report" ),


]