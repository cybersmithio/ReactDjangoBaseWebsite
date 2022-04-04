from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError
from django.core.mail import send_mail
from django.conf import settings
import sys
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from api.serializers.user_serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
 
        token['name'] = user.name
 
        return token
 
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    verification_secret = get_random_string(length=32)

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
                verified_email=False,
                verification_email_secret=verification_secret,
                )
        except IntegrityError:
            return Response({'message': 'user already exists'},status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'message': 'user could not be registered'},status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(
                f'Verify your user account for {settings.WEB_SITE_NAME}',
                f'To verify your user account for {settings.WEB_SITE_NAME}, please go to {settings.VERIFICATION_URL}{verification_secret}',
                settings.SENDER_EMAIL,
                [request.data['email']],
                fail_silently=False,
                html_message=f'Please <a href="{settings.VERIFICATION_URL}{verification_secret}">click this link</a> to verify your user account for {settings.WEB_SITE_NAME}.',
 
            )
            user.sent_verification_email=True
            user.save()
        except:
            print("send_mail exception:",sys.exc_info())
            return Response({'message': 'Verification email could not be sent.'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'user registered'},status=status.HTTP_200_OK)
    return Response({'message': 'user information missing'},status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['GET'])
def verifyUser(request, verification_secret):
    try:
        user = User.objects.get(verification_email_secret=verification_secret)
        user.verified_email=True
        user.is_active=True
        user.save()
        return Response({'message': 'user verified'},status=status.HTTP_200_OK)
    except:
        return Response({'message': 'unable to verify user'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    update_flag=False
    user = User.objects.get(email=request.user)
    if "name" in request.data:
        user.name=request.data['name']
        update_flag=True
    if "password" in request.data:
        user.password=make_password(request.data['password'])
        update_flag=True
    if update_flag:
        user.save()
    access_token = RefreshToken.for_user(user)
    access_token['name'] = user.name
    return Response({'access': str(access_token.access_token), 'refresh': str(access_token)},status=status.HTTP_200_OK)

@api_view(['POST'])
def forgotPassword(request):
    if "email" in request.data:
        reset_secret = get_random_string(length=32)
        try:
            user = User.objects.get(email=request.data['email'])
            user.reset_password_secret=reset_secret
            user.save()        
        except:
            return Response(status=status.HTTP_200_OK)
        try:
            send_mail(
                f'Password reset for your account on {settings.WEB_SITE_NAME}',
                f'To reset your password for {settings.WEB_SITE_NAME}, please go to {settings.RESET_PASSWORD_URL}{reset_secret}',
                settings.SENDER_EMAIL,
                [request.data['email']],
                fail_silently=False,
                html_message=f'Please <a href="{settings.RESET_PASSWORD_URL}{reset_secret}">click this link</a> to reset your password for {settings.WEB_SITE_NAME}.'

            )
        except:
            pass        
        return Response(status=status.HTTP_200_OK)     
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def resetPassword(request):
    try:
        user = User.objects.get(reset_password_secret=request.data['reset_secret'])
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)