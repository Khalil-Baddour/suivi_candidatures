from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics
from .models import Application
from .serializers import ApplicationSerializer


# Create your views here.
def index(request):
    return HttpResponse("Bienvenu dans mon apploication Mes Candidatures")


class ApplicationListCreate(generics.ListCreateAPIView):
    """
    qui gère automatiquement le GET (liste) et le POST (création)
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

