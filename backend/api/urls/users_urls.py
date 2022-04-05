from django.urls import path
from api.views import users_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
 
urlpatterns = [
    path('register/', views.registerUser, name='register_user'),
    path('email/verify/', views.verifyUser, name='verify_user'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.userProfile, name='user_profile'),
    path('profile/update/', views.updateUserProfile, name='update_user_profile'),
    path('password/forgot/', views.forgotPassword, name='forgot_password'),
    path('password/reset/', views.resetPassword, name='reset_password'),
]
