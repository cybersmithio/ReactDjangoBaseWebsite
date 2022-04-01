from django.urls import path
from api.views import users_views as views
 
urlpatterns = [
    path('register/', views.registerUser, name='register_user'),
]
