from rest_framework.permissions import BasePermission, SAFE_METHODS
from general.enum_helper import UserType


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated or (request.user.is_superuser or request.user.user_type==UserType.ADMIN.value))


class IsAdminForPOST(BasePermission):
    """
    Custom permission to allow any authenticated user to access any method except for POST,
    which is restricted to admin users.
    """
    def has_permission(self, request, view):
        # Allow any user to access any method except for POST
        if request.method != "POST":
            return bool(request.user and request.user.is_authenticated)
        # Allow admin users to use POST
        return bool(request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.user_type==UserType.ADMIN.value))

class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request, so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the snippet.
        return bool(request.user and request.user.is_authenticated and obj.user == request.user)
