from django.urls import path
from .views import ApplicationListCreate, ApplicationDetail

"""
L'utilité de ce deuxième fichier urls.py est le découpage modulaire qui a pour utilité :

Modularité : Chaque application est autonome, ce qui permet de copier-coller tout le dossier applications dans un autre projet sans rien casser.
Clarté : le fichier urls.py principal (dossier config) reste propre et court, évitant  les centaines de lignes quand le projet va grossir.
Organisation : Cela permet de préfixer facilement toutes les routes d'un module (ex: toutes les URLs de mon app commencent par /api/) en une seule ligne.
et ça facilité la maintenance et assure la scalabilité
"""

urlpatterns = [
    path('applications/', ApplicationListCreate.as_view(), name='app-list'),
    path('applications/<int:pk>/', ApplicationDetail.as_view()),  # avec l'id de la candidature
]


