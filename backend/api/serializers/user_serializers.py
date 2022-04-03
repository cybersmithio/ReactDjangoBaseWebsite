from rest_framework import serializers
from api.models import *

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
 
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name']
   
    def get_name(self,obj):
        return obj.name