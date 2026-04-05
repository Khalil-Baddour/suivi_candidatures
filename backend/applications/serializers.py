from rest_framework import serializers
from .models import Application, City



class ApplicationSerializer(serializers.ModelSerializer):
    '''
    Ceci envoie un JSON comme : 
    {
    "status": "SENT",
    "status_label": "Envoyé",
    "next_action": "TO_FOLLOW_UP",
    "next_action_label": "Relancer",
    'contract_type' : 'PERMANENT',
    'contract_type_label' : 'CDI'
    }
    '''
    # On crée deux nouveaux champs qui récupèrent les labels automatiques de Django
    status_label = serializers.CharField(source='get_status_display', read_only=True)   # get_FOO_display : méthode que Django génère automatiquement pour chaque champ qui possède l'argument choices
    next_action_label = serializers.CharField(source='get_next_action_display', read_only=True)
    city_name = serializers.CharField(source='city.nom_standard', read_only=True)
    contract_type_label = serializers.CharField(source='get_job_contract_type_display', read_only=True) 

    class Meta:
        model = Application  # le model (table)
        fields = '__all__' #renvoi tous les champs de la table + ceux créé en dessous à l'aide des choices label défini dans le model

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City  # le model (table City)
        fields = '__all__' #renvoi tous les champs de la table  City

 