from django.contrib import admin
 
# Register your models here.
from django.contrib.auth.admin import UserAdmin
 
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser
 
 
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('name','email', 'is_staff', 'is_active','date_joined','sent_verification_email','verified_email','last_login','date_email_verified')
    list_filter = ('name','email', 'is_staff', 'is_active','date_joined','sent_verification_email','verified_email','last_login','date_email_verified')
 
    fieldsets = (
        (None, {'fields': ('name','email', 'password','date_joined','sent_verification_email','verified_email','last_login','date_email_verified')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active','last_login','date_email_verified')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
 
admin.site.register(CustomUser, CustomUserAdmin)