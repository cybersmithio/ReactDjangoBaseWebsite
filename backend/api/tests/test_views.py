from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from unittest.mock import patch
from django.conf import settings 
import jwt

User = get_user_model()
 
class UserTestCase(TestCase):
    def helper_create_user(self):
        user = User.objects.create(
            name="James Smith",
            email='james@example.com',
            password=make_password('LetMeIn123!')
        )
        return user

@patch('api.views.users_views.send_mail')
class RegisterUserAPITests(UserTestCase):
    def test_user_can_be_registered(self, mock_send_mail):
        self.assertRaises(User.DoesNotExist, User.objects.get,email='james@example.com' )
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(email='james@example.com')
        self.assertIsNotNone(user)
 
    def test_registered_user_has_correct_settings(self, mock_send_mail):
        self.assertRaises(User.DoesNotExist, User.objects.get,email='james@example.com' )
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        self.assertEqual(user.name, "James Smith")
        self.assertEqual(user.email, "james@example.com")
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.sent_verification_email)
        self.assertFalse(user.verified_email)
        self.assertNotEqual(user.verification_email_secret, "")
        self.assertIsNotNone(user.verification_email_secret)
 
    def test_missing_name_returns_bad_request(self, mock_send_mail):
        response = self.client.post('/api/users/register/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
 
    def test_missing_email_returns_bad_request(self, mock_send_mail):
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
 
    def test_missing_password_returns_bad_request(self, mock_send_mail):
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com'})
        self.assertEqual(response.status_code, 400)
    
    def test_existing_user_returns_error_message(self, mock_send_mail):
        self.helper_create_user()
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], "user already exists")

    def test_registered_user_gets_verification_email(self, mock_send_mail):
        self.assertRaises(User.DoesNotExist, User.objects.get,email='james@example.com' )
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        self.assertTrue(user.sent_verification_email)
        self.assertEqual(mock_send_mail.called, True)
        (subject, body, from_email, to_list), kwargs = mock_send_mail.call_args
        self.assertEqual(subject, f"Verify your user account for {settings.WEB_SITE_NAME}")
        self.assertEqual(body, f'To verify your user account for {settings.WEB_SITE_NAME}, please go to {settings.VERIFICATION_URL}{user.verification_email_secret}')
        self.assertRegex(body, f'To verify your user account for {settings.WEB_SITE_NAME}, please go to {settings.VERIFICATION_URL}[0-9A-Za-z]{{32}}$')  
        self.assertEqual(from_email, settings.SENDER_EMAIL)
        self.assertEqual(to_list,['james@example.com'])
        self.assertIn("html_message", kwargs)
        for key, value in kwargs.items():
            if key == "html_message":
                self.assertEqual(value, f'Please <a href="{settings.VERIFICATION_URL}{user.verification_email_secret}">click this link</a> to verify your user account for {settings.WEB_SITE_NAME}.')
                self.assertRegex(value, f'Please <a href="{settings.VERIFICATION_URL}[0-9A-Za-z]{{32}}">click this link</a> to verify your user account for {settings.WEB_SITE_NAME}\.$')

@patch('api.views.users_views.send_mail')
class VerifyUserEmailAPITests(UserTestCase):
    def test_verification_email_link(self, mock_send_mail):
        self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        response = self.client.get(f'/api/users/verify/{user.verification_email_secret}')
        user = User.objects.get(email='james@example.com')
        self.assertTrue(user.verified_email)
        self.assertTrue(user.is_active)
 
    def test_verification_email_link_returns_200(self, mock_send_mail):
        self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        response = self.client.get(f'/api/users/verify/{user.verification_email_secret}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], "user verified")
 
    def test_bogus_verification_does_not_work(self, mock_send_mail):
        self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        response = self.client.get(f'/api/users/verify/4BCDEFGH1JKLmNOpqrSTUVWXYZ')
        user = User.objects.get(email='james@example.com')
        self.assertFalse(user.verified_email)
        self.assertFalse(user.is_active)
 
    def test_bogus_verification_returns_400(self, mock_send_mail):
        self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        response = self.client.get(f'/api/users/verify/4BCDEFGH1JKLmNOpqrSTUVWXYZ')
        user = User.objects.get(email='james@example.com')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], "unable to verify user")

class UserAuthenticationTests(UserTestCase):
    def test_user_can_login(self):
        self.helper_create_user()
        response = self.client.post('/api/users/token/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 200)
 
    def test_user_with_bad_password(self):
        self.helper_create_user()
        response = self.client.post('/api/users/token/',data={'email': 'james@example.com', 'password': 'password'})
        self.assertEqual(response.status_code, 401)
 
    def test_user_login_api_returns_jwt(self):
        self.helper_create_user()
        response = self.client.post('/api/users/token/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertIsNotNone(response.data['access'])
 
    def test_user_jwt_has_name(self):
        self.helper_create_user()
        response = self.client.post('/api/users/token/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        decoded = jwt.decode(response.data['access'], settings.SECRET_KEY, algorithms=["HS256"])
        self.assertIn("name", decoded)
        self.assertEqual(decoded['name'],"James Smith")
 
    def test_user_login_api_fails_without_email_and_password(self):
        response = self.client.post('/api/users/token/')
        self.assertEqual(response.status_code, 400)
 
    def test_user_login_api_fails_without_email(self):
        response = self.client.post('/api/users/token/',data={'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
 
    def test_user_login_api_fails_without_password(self):
        response = self.client.post('/api/users/token/',data={'email': 'jsmith'})
        self.assertEqual(response.status_code, 400)
 
    def test_user_login_api_fails_with_non_existent_email(self):
        response = self.client.post('/api/users/token/',data={'email': 'jsmith', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 401)
 
    def test_user_login_api_fails_with_get_request(self):
        response = self.client.get('/api/users/token/')
        self.assertEqual(response.status_code, 405)

    def test_user_jwt_expires_in_7_days(self):
        self.helper_create_user()
        response = self.client.post('/api/users/token/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        decoded = jwt.decode(response.data['access'], settings.SECRET_KEY, algorithms=["HS256"])
        self.assertIn("exp", decoded)
        self.assertIn("iat", decoded)
        self.assertTrue((decoded['exp']-decoded['iat'] >= 604800))