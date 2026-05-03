from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics, viewsets, filters
from .models import Application, City
from .serializers import ApplicationSerializer, CitySerializer

from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
def index(request):
    return HttpResponse("Bienvenu dans mon apploication Mes Candidatures")


class ApplicationListCreate(generics.ListCreateAPIView):
    """
    qui gère automatiquement le GET (liste) et le POST (création), DELELTE, PUSH
    envoyer et recevoir les données (en integralité)
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    à utiliser uniquement dans les router (dans urls : router.register)
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class ApplicationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    vue pour GET détail + PATCH + PUT + DELETE
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class CityViewSetList(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    # Activer la fonctionnalité de recherche de Django REST Framework (sur les champs en bas)
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom_standard', 'nom_sans_accent', 'nom_standard_majuscule']


@api_view(['POST'])
@permission_classes([AllowAny]) # Tout le monde peut créer un compte
def register_user(request):
    data = request.data
    
    try:
        # 1. Vérification si l'utilisateur existe déjà
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'detail': 'Ce nom d\'utilisateur est déjà pris.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Création de l'utilisateur
        user = User.objects.create_user(
            username=data['username'],
            email=data.get('email', ''), # .get pour éviter l'erreur si l'email est vide
            password=data['password']
        )
        
        return Response(
            {'detail': 'Utilisateur créé avec succès !'}, 
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )