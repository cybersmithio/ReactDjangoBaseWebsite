from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

User = get_user_model()

@api_view(['POST'])
def registerUser(request):
    message={'message': 'user could not be registered'}
 
    if 'password' in request.data and 'email' in request.data and 'name' in request.data:
        try:
            user = User.objects.create_user(
                email=request.data['email'],
                name=request.data['name'],
                password=make_password(request.data['password']),
                is_active=False,
                is_staff=False,
                is_superuser=False,
                sent_verification_email=False,
                verified_email=False
                )
            return Response(status=status.HTTP_200_OK)
        except:
            message={'message': 'user could not be registered'}
    else:
        message={'message': 'user information missing'}
    return Response(message,status=status.HTTP_400_BAD_REQUEST)
 

