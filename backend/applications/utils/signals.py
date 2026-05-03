import os
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from .mailer import send_custom_email


HOST_URL = os.getenv("HOST", "http://localhost:5173")  # variable globale

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Déclenché quand un utilisateur demande un reset.
    """
    # URL de ton interface React qui devra gérer le nouveau mot de passe
    reset_url = f"{HOST_URL}/reset-password?token={reset_password_token.key}"

    subject = "Réinitialisation de votre mot de passe"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé de réinitialiser votre mot de passe pour votre compte Candidature.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <div style="margin: 20px 0;">
            <a href="{reset_url}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Réinitialiser mon mot de passe
            </a>
        </div>
        <p>Ce lien expirera dans 30 minutes.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
    </div>
    """

    # Envoi via Resend
    send_custom_email(
        subject=subject,
        to_email=reset_password_token.user.email,
        html_content=html_content
    )