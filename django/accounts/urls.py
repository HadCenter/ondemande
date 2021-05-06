from .api import LoginAPI, RegisterAPI, UserAPI
from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
	path("login/", LoginAPI.as_view()), #cv
	path("forgetPassword/", views.forgetPassword, name="forget-Password"),
	path("register/", RegisterAPI.as_view()), #cv
	path("user/", UserAPI.as_view()), #cv
	path("getUsers/",views.userList, name = "user-list"), #cv
	url(r'^getUser/(?P<pk>[0-9]+)$', views.user_detail), #cv
	url(r'^updateUser/(?P<pk>[0-9]+)$', views.user_detail), #cv
	url("updatePasswordUser/", views.update_user_password), #cv
	url("updateResetPasswordUser/", views.update_reset_user_password),
	url("getTokenStatus/", views.token_status), #cv
	url("getRestTokenStatus/", views.token_rest_status),


]