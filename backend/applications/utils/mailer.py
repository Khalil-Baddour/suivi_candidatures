import resend
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_custom_email(subject, to_email, html_content):
    """
    Envoie un email via le SDK Resend de manière sécurisée.
    """
    if not settings.RESEND_API_KEY:
        logger.error("RESEND_API_KEY non configurée.")
        return None

    resend.api_key = settings.RESEND_API_KEY

    try:
        params = {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
        }
        
        email = resend.Emails.send(params)
        logger.info(f"Email envoyé avec succès à {to_email}. ID: {email['id']}")
        return email
    except Exception as e:
        logger.error(f"Erreur Resend : {e}")
        return None