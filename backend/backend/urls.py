"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import os

urlpatterns = [
    path('api/users/', include('api.urls.users_urls')),
]

if os.getenv('DJANGO_ADMIN') is not None and os.getenv('DJANGO_ADMIN') == 'True':
    print("Django admin site enabled")
    urlpatterns.insert(0,path('admin/', admin.site.urls),)
else:
        print("Django admin site disabled")

