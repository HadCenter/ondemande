from .api import LoginAPI, RegisterAPI, UserAPI
from django.urls import path
from knox import views as  knox_views
from . import views

urlpatterns = [
	path("login/", LoginAPI.as_view()),
	path("register/", RegisterAPI.as_view()),
	path("user/", UserAPI.as_view()),
	path("logout/", knox_views.LogoutView.as_view()),
	path("getRoles/", views.roleList, name="role-list"),

]