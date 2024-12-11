from rest_framework.authentication import SessionAuthentication
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening



class NetIDBackend(ModelBackend):
    def authenticate(self, request, net_id=None):
        try:
            user = User.objects.get(net_id=net_id)
            return user if self.user_can_authenticate(user) else None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
