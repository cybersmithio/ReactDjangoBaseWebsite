from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
 
from .managers import CustomUserManager
 
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    sent_verification_email = models.BooleanField(default=False)
    verified_email = models.BooleanField(default=False)
    verification_email_secret = models.CharField(max_length=100, default=None, null=True)
    reset_password_secret = models.CharField(max_length=100, default=None, null=True)
    date_email_verified = models.DateTimeField(default=None, null=True)
 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
 
    objects = CustomUserManager()
 
    def __str__(self):
        return self.email