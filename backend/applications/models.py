from django.db import models

# Create your models here.
from django.db import models


class City(models.Model):
    nom_standard = models.CharField(max_length=100)
    nom_sans_pronom = models.CharField(max_length=100)
    nom_sans_accent = models.CharField(max_length=100)
    nom_standard_majuscule = models.CharField(max_length=100)
    reg_nom = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nom_standard}"




class Application(models.Model):

    STATUS_CHOICES = [
        ('TO_PREPARE', 'A préparer'),
        ('SENT', 'Envoyé'),
        ('INTERVIEW', 'Entretien'),
        ('REJECTED', 'Refusé'),
        ('NO_RESPONSE', 'Sans réponse'),
        ('ACCEPTED', 'Accepté'),
    ]

    ACTIONS_STATUS = [
        ('TO_FOLLOW_UP', 'Relancer'),
        ('TO_PREPARE_INTERVIEW', "Préparer l'entretien"),
        ('NONE', 'Aucune'),
        ('SEND_APPLICATION', 'Envoyer la candidature')
    ]

    CONTRACT_TYPE = [
        ('PERMANENT', 'CDI'),
        ('FIXED_TERM', 'CDD'),
        ('INTERNSHIP', 'Stage'),
        ('APPRENTICE_SHIP', 'Alternance'),
        ('FREELANCE', 'Freelance'),
        ('OTHER', 'Autre')
    ]

    company = models.CharField(max_length=255)
    contact = models.CharField(max_length=255, null=True, blank=True)       # optionnel
    email = models.EmailField(null=True, blank=True)                        # optionnel
    role_contact = models.CharField(max_length=255, null=True, blank=True)  # optionnel

    position = models.CharField(max_length=255)    
    job_contract_type = models.CharField(max_length=50, choices=CONTRACT_TYPE) 
    job_mission = models.TextField(null=True, blank=True) # Un TextField s'affiche comme une grande zone de texte
    offer_link = models.URLField(max_length=2000, null=True, blank=True)
    date_apply = models.DateField(null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES) 
    next_action = models.CharField(max_length=255, choices=ACTIONS_STATUS, default='NONE')
    next_action_date = models.DateField(null=True, blank=True)


    cv = models.FileField(upload_to='cvs/', null=True, blank=True)
    cover_letter = models.FileField(upload_to='cover_letters/', null=True, blank=True)

    notes = models.TextField(null=True, blank=True) # 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """
        Logique automatique : on définit la prochaine action 
        en fonction du statut choisi.
        """
        if self.status == 'TO_PREPARE':
            self.next_action = 'SEND_APPLICATION'
        elif self.status in ['SENT','NO_RESPONSE']:
            self.next_action = 'TO_FOLLOW_UP'
        elif self.status == 'INTERVIEW':
            self.next_action = 'TO_PREPARE_INTERVIEW'
        elif self.status in ['REJECTED', 'ACCEPTED']:
            self.next_action = 'NONE'

        # Appelle la méthode save d'origine pour enregistrer en base de données
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.company} - {self.position or 'No position'}"
    