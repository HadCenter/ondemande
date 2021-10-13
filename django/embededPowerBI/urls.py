from django.urls import path
from . import views
urlpatterns = [
    path("getSingleReport/<str:id>", views.getEmbedParamsForSingleReport, name = "get-single-report" ),
    path("getAllReports/", views.getMultipleReports, name = "get-single-report" ),
    path("getUserToken/", views.getUserToken, name = "get-user-token" ),

]