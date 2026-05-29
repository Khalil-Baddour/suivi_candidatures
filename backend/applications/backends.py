from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        lookup = email or username
        if not lookup:
            return None
        users = User.objects.filter(email=lookup)
        for user in users:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        return None
