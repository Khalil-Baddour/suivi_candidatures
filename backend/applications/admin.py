from django.contrib import admin
from .models import Application, City

#admin.site.register(Application)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    # Obligatoire pour que l'autocomplétion fonctionne ailleurs
    search_fields = ['nom_standard', 'nom_standard_majuscule']

    # 1. Empêcher l'ajout de nouvelles villes
    def has_add_permission(self, request):
        return False

    # 2. Empêcher la modification des villes existantes
    def has_change_permission(self, request, obj=None):
        return False
    
    #3. Empêcher la suppression des villes
    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    # Transforme le menu déroulant en barre de recherche
    autocomplete_fields = ['city']

    readonly_fields = ('next_action',) # bloquer la modification manuelle, django va gérer le remplissage de ce champ en fct des conditions mises dans save()


    #voir les colonnes dans la liste principale (ce qui peut déjà existait dans la BDD)
    list_display = ('company', 'position', 'status', 'city', 'next_action')

    list_filter = ('status', 'next_action')
    search_fields = ('company', 'position')