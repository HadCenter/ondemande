
# Create your models here.

from .managers import CustomUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'), max_length=255)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username',]
    objects = CustomUserManager()




