from .api import LoginAPI, RegisterAPI, UserAPI
from django.urls import path
from knox import views as  knox_views
from . import views
from django.conf.urls import url
from .views import PasswordTokenCheckAPI

urlpatterns = [
	path("login/", LoginAPI.as_view()),
	path("forgetPassword/", views.forgetPassword, name="forget-Password"),
	path("register/", RegisterAPI.as_view()), #cv
	path("user/", UserAPI.as_view()),
	path("logout/", knox_views.LogoutView.as_view()),
	path("getUsers/",views.userList, name = "user-list"),
	url(r'^getUser/(?P<pk>[0-9]+)$', views.user_detail),
	url(r'^updateUser/(?P<pk>[0-9]+)$', views.user_detail),
	url("updatePasswordUser/", views.update_user_password),
	url("updateResetPasswordUser/", views.update_reset_user_password),
	path('password-reset/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
	url("getTokenStatus/", views.token_status),
	url("getRestTokenStatus/", views.token_rest_status),


]