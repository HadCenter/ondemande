
# Create your models here.

from .managers import CustomUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

# class Profile(models.Model):
#     label = models.CharField(max_length=200)
#     def __str__(self):
#         return self.label

class Account(AbstractBaseUser, PermissionsMixin):
    # email =  models.EmailField(_('email address'), unique=True)
    # username = models.CharField(_('username'), unique=True, max_length=30)
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'), max_length=255)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    # profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username',]

    objects = CustomUserManager()

class UserUniqueToken(models.Model):
    user_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    token = models.CharField(max_length=100)
    # datetime = models.DateField(default=timezone.now)  # for token expiration
    datetime = models.DateTimeField(auto_now=True)




