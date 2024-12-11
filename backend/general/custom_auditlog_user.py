from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.deprecation import MiddlewareMixin


class SetUserIfTokenAuth(MiddlewareMixin):
    """ django-auditlog works via middleware.  Unfortunately, middleware triggers before DjangoRestFramework's
    TokenAuthentication.  This middleware checks for a Token and sets the User prior to Auditlog running.
    """

    def process_request(self, request):
        tauth = TokenAuthentication()
        try:
            user, token = tauth.authenticate(request)
            request.user = user
        except (TypeError, AuthenticationFailed):
            pass
        return None
