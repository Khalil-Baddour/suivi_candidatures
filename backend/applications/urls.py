from django.urls import path, include
from .views import ApplicationListCreate, ApplicationDetail, CityViewSetList, ApplicationViewSet

from rest_framework.routers import DefaultRouter

from django.conf import settings
from django.conf.urls.static import static


"""
L'utilité de ce deuxième fichier urls.py est le découpage modulaire qui a pour utilité :

Modularité : Chaque application est autonome, ce qui permet de copier-coller tout le dossier applications dans un autre projet sans rien casser.
Clarté : le fichier urls.py principal (dossier config) reste propre et court, évitant  les centaines de lignes quand le projet va grossir.
Organisation : Cela permet de préfixer facilement toutes les routes d'un module (ex: toutes les URLs de mon app commencent par /api/) en une seule ligne.
et ça facilité la maintenance et assure la scalabilité
"""

router = DefaultRouter()
router.register(r'cities', CityViewSetList, basename='city')
router.register(r'applications', ApplicationViewSet, basename='application')



ApplicationListCreate


urlpatterns = [
    path('', include(router.urls)),
    path('applications/', ApplicationListCreate.as_view(), name='app-list'),  # tous, vont être après host/api/... (ex : http://127.0.0.1:8000/api/applications/ )
    path('applications/<int:pk>/', ApplicationDetail.as_view()),  # avec l'id de la candidature
]
# gere les media (docs, pdf..)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

