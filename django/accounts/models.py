
# Create your models here.

from .managers import CustomUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField( unique=True)
    username = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    role = models.CharField(max_length=200)
    created_at = models.DateTimeField(null=True)
    reports_id = models.CharField(blank=True,null=True,max_length=20000)
    canUpdateCapacity = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_superuser = None
    last_login = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username',]
    objects = CustomUserManager()

class Tokensforgetpassword(models.Model):
    token = models.CharField(max_length= 255)
    account = models.ForeignKey(Account,db_column="account_id",on_delete=models.DO_NOTHING , blank=True, null=True)





