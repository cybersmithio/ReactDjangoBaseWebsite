from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
 
User = get_user_model()
 
class UserTestCase(TestCase):
    def helper_create_user(self):
        user = User.objects.create(
            name="James Smith",
            email='james@example.com',
            password=make_password('LetMeIn123!')
        )
        return user
 
class RegisterUserAPITests(UserTestCase):
    def test_user_can_be_registered(self):
        self.assertRaises(User.DoesNotExist, User.objects.get,email='james@example.com' )
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(email='james@example.com')
        self.assertIsNotNone(user)
 
    def test_registered_user_has_correct_settings(self):
        self.assertRaises(User.DoesNotExist, User.objects.get,email='james@example.com' )
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com', 'password': 'LetMeIn123!'})
        user = User.objects.get(email='james@example.com')
        self.assertEqual(user.name, "James Smith")
        self.assertEqual(user.email, "james@example.com")
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.sent_verification_email)
        self.assertFalse(user.verified_email)
 
    def test_missing_name_returns_bad_request(self):
        response = self.client.post('/api/users/register/', data={'email': 'james@example.com', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
 
    def test_missing_email_returns_bad_request(self):
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'password': 'LetMeIn123!'})
        self.assertEqual(response.status_code, 400)
 
    def test_missing_password_returns_bad_request(self):
        response = self.client.post('/api/users/register/', data={'name': 'James Smith', 'email': 'james@example.com'})
        self.assertEqual(response.status_code, 400)