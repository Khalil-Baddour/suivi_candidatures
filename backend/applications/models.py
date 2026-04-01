from django.db import models

# Create your models here.
from django.db import models

class Application(models.Model):

    STATUS_CHOICES = [
        ('TO_APPLY', 'To Apply'),
        ('SENT', 'Sent'),
        ('INTERVIEW', 'Interview'),
        ('REJECTED', 'Rejected'),
        ('NO_RESPONSE', 'No Response'),
        ('ACCEPTED', 'Accepted'),
    ]

    company = models.CharField(max_length=255)
    contact = models.CharField(max_length=255, null=True, blank=True)       # optionnel
    email = models.EmailField(null=True, blank=True)                        # optionnel
    role_contact = models.CharField(max_length=255, null=True, blank=True)  # optionnel
    position = models.CharField(max_length=255)    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES) 

    next_action = models.CharField(max_length=255, null=True, blank=True)
    next_action_date = models.DateField(null=True, blank=True)

    city = models.CharField(max_length=100)

    cv = models.FileField(upload_to='cvs/', null=True, blank=True)
    cover_letter = models.FileField(upload_to='cover_letters/', null=True, blank=True)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company} - {self.position or 'No position'}"