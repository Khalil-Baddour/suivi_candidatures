from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics, viewsets, filters
from .models import Application, City
from .serializers import ApplicationSerializer, CitySerializer


# Create your views here.
def index(request):
    return HttpResponse("Bienvenu dans mon apploication Mes Candidatures")


class ApplicationListCreate(generics.ListCreateAPIView):
    """
    qui gère automatiquement le GET (liste) et le POST (création)
    envoyer et recevoir les données (en integralité)
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
