from rest_framework import serializers
from .models import Application



class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application  # le model (table)
        fields = '__all__' # Envoie tous les champs (id, company, status, etc.)