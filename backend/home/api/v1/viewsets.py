import datetime
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from rest_framework import viewsets, status
from rest_framework import authentication
# from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.permissions import AllowAny
from appointment.models import Appointment
from rest_framework.views import APIView
from contract.models import Contract
from home.api.v1.serializers import (
    AnnouncementSerializer,
    AvailableTokenSerializer,
    EmailTemplateSerializer,
    SignupSerializer,
    UserCreateUpdateSerializer,
    UserGetSerializer,
    UserSerializer,
    AuthTokenSerializer,
)
from rest_framework.decorators import action
from django.db.models import Q
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from home.models import Announcement, AvailableToken, EmailTemplate
from general.permissions import IsAdmin, IsAdminForPOST
from notification.models import Notification
from general.enum_helper import AppointmentStatus, ContractStatus, UserType
from django_cas_ng.views import LoginView, LogoutView
from logging import Logger
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.serializers import serialize
from django.http import QueryDict
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
import json
from django.core.mail import EmailMultiAlternatives

logger = Logger(__name__)


User = get_user_model()


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]
    permission_classes = [AllowAny]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing user information.

    Provides CRUD (Create, Retrieve, Update, Delete) operations for users.

    Attributes:
        queryset (QuerySet): Contains all users.
        serializer_class (Serializer): The serializer class for users.

    Custom Methods:
        toggle_user_status(self, request, pk=None): Toggles the active status of a user.

    Example Usage:
        To toggle the active status of a user:
        POST /users/1/toggle-status

        Response:
        {
            "response_message": "User status has been toggled to [new_status]"
        }
    """
    queryset = User.objects.all()
    serializer_class = UserGetSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ('department_users__dept__subj_cd', 'department_users__unit__offering_unit_cd', 'user_type')
    search_fields = ['net_id', 'name']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserGetSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserGetSerializer

    def perform_create(self, serializer):
        new_user = serializer.save(modified_by=self.request.user)
        admin = self.request.user
        admin_name = admin.name
        for user in User.objects.filter(user_type=UserType.ADMIN.value):
            message = f"{admin_name} created a User {new_user.name}"
            Notification.objects.create(user=user, title="New User Access", notification_type="USER_CREATE", message=message)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

    @action(detail=True, methods=['POST'], url_path='toggle-status')
    def toggle_user_status(self, request, pk=None):
        """
        Toggles the active status of a user.

        Args:
            request (HttpRequest): The HTTP request object.
            pk: The primary key of the user to toggle.

        Returns:
            Response: A JSON response indicating the status of the toggle operation.

        Example Usage:
            To toggle the active status of a user:
            POST /users/1/toggle-status

            Response:
            {
                "response_message": "User status has been toggled to [new_status]"
            }
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        if request.user == user:
            return Response({'detail': 'You are not allowed to change your own status.'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response({'response_message': f'User status has been toggled to {user.is_active}'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['PATCH', 'PUT'], url_path='update-profile-image')
    def update_profile_image(self, request, pk=None):
        """
        Updates the profile image of a user.

        Args:
            request (HttpRequest): The HTTP request object.
            pk: The primary key of the user to update.

        Returns:
            Response: A JSON response indicating the status of the profile image update.

        Example Usage:
            To update the profile image of a user:
            PUT /users/1/update-profile-image
            (with form data containing the profile_image field)

            Response:
            {
                "response_message": "Profile image has been updated successfully."
            }
        """
        user = self.get_object()
        profile_image = request.data.get('profile_image')
        if not profile_image:
            return Response({'detail': 'Profile image is required in the form data.'}, status=status.HTTP_400_BAD_REQUEST)
        user.profile_image = profile_image
        user.save()
        return Response({'response_message': 'Profile image has been updated successfully.'}, status=status.HTTP_200_OK)
    

class AvailableTokenViewSet(ModelViewSet):
    """
    A ViewSet for managing available tokens.

    Provides CRUD (Create, Retrieve, Update, Delete) operations for available tokens.
    
    Requires administrative privileges for POST requests (permission class: IsAdminForPOST).

    Attributes:
        queryset (QuerySet): Contains all available tokens.
        serializer_class (Serializer): The serializer class for available tokens.
    """
    queryset = AvailableToken.objects.all()
    serializer_class = AvailableTokenSerializer
    permission_classes = [IsAdminForPOST]


class EmailTemplateViewSet(ModelViewSet):
    """
    A ViewSet for managing email templates.

    Provides CRUD (Create, Retrieve, Update, Delete) operations for email templates.

    Attributes:
        queryset (QuerySet): Contains all email templates.
        serializer_class (Serializer): The serializer class for email templates.
    """
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the Announcement model.

    This viewset provides a set of CRUD operations (Create, Retrieve, Update, Delete) for the Announcement model.
    It also includes search and ordering capabilities for the model fields.

    Attributes:
        queryset: The set of Announcement model instances to be used in the viewset.
        serializer_class: The serializer class to use for serializing and deserializing Announcement instances.
        filter_backends: The filter backends to enable filtering and searching capabilities.
        search_fields: The fields on which searching can be performed.
        ordering_fields: The fields on which ordering can be applied.
        authentication_classes: The authentication classes required for accessing this viewset.
        permission_classes: The permissions required for accessing this viewset.

    Methods:
        perform_create: A custom method to set the 'modified_by' field with the current user on creation.
        perform_update: A custom method to set the 'modified_by' field with the current user on update.
    """
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    filter_backends = [filters.SearchFilter,]
    search_fields = ['title', 'type', 'start_date', 'end_date']
    # filterset_class = AnnouncementFilter
    permission_classes = [IsAdmin]

    def get_queryset(self):
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')    
        title = self.request.query_params.get('title')
        type = self.request.query_params.get('type')
        queryset = Announcement.objects.all()
        if month and year:
            queryset = queryset.filter(start_date__month=month, start_date__year=year)
        if title:
            queryset = queryset.filter(title__icontains=title)
        if type:
            queryset = queryset.filter(type=type)
        return queryset

    def perform_create(self, serializer):
        """
        Custom method to set the 'modified_by' field with the current user on creation.

        Args:
            serializer: The serializer instance used for creating an Announcement.

        This method is called when a new Announcement instance is created. It sets the 'modified_by'
        field to the current user who is making the request.

        Note:
            'request.user' is automatically populated by Django Rest Framework for authenticated users.
        """
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        """
        Custom method to set the 'modified_by' field with the current user on update.

        Args:
            serializer: The serializer instance used for updating an Announcement.

        This method is called when an existing Announcement instance is updated. It sets the 'modified_by'
        field to the current user who is making the request.

        Note:
            'request.user' is automatically populated by Django Rest Framework for authenticated users.
        """
        serializer.save(modified_by=self.request.user)


class DashboardAnalytics(APIView):
    
    def get(self, request, *args, **kwargs):
        appointments_pending = Appointment.objects.filter(Q(appointment_status=AppointmentStatus.PENDING.value) | Q(appointment_status__isnull=True) | Q(appointment_status='')).count()
        appointments_approved = Appointment.objects.filter(appointment_status=AppointmentStatus.APPROVED)
        app_to_be_excluded = Contract.objects.filter(
                    is_active=True,
                    status__in=[ContractStatus.HCM_ENTER.value, ContractStatus.HCM_READY.value, ContractStatus.SEND_FOR_SIGNATURE.value]
                ).values_list('appointments', flat=True)
        appointments_approved = appointments_approved.exclude(id__in=app_to_be_excluded).count()
        response_data = {
            'appointments_pending': appointments_pending,
            'appointments_approved': appointments_approved,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    

class CreateSuperUserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        user.net_id = 'admin'
        user.save()
        return Response({'message': 'Superuser created'}, status=201)
    
class TestingMailViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            email = request.query_params.get('email')
            subject = "Sample Email"
            to = email
            message = "Hello, this is a sample email."
            recipient_list = [to]
            # Create the email message
            email = EmailMultiAlternatives(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
            email.attach_alternative(message, "text/html")  # Set the email content as HTML
            # Send the email
            email.send()
            return Response({'message': 'Email sent'}, status=200)
        except Exception as e:
            return Response({'message': 'Error sending email', 'error': str(e)}, status=500)


class CustomLoginView(LoginView):
    
    def successful_login(self, request: HttpRequest, next_page: str) -> HttpResponse:
        body = self.request.body.decode('utf-8')
        logger.error(f"{body=}")
        logger.error(f"{self.request.user=}")
        logger.error(f"{self.request.user.is_authenticated=}")
        logger.error(f"{self.request.user.is_active=}")
        logger.error(f"{self.request=}")
        # Check if the user is authenticated
        if self.request.user.is_authenticated:
            token = Token.objects.get_or_create(user=self.request.user)[0].key
            # Construct the redirect URL with serialized data and token
            redirect_url = f"{next_page}?token={token}"

            # Redirect the user to the next page with the serialized data and token
            return HttpResponseRedirect(redirect_url)
        else:
            # If user is not authenticated, handle the situation accordingly
            # For example, redirect to login page
            redirect_url = f"{request.scheme}://{request.get_host()}/auth/login-failed?errorMessage=Access Denied"
            return HttpResponseRedirect(redirect_url)

    def get(self, request: HttpRequest) -> HttpResponse:
        try:
            res = super().get(request)
        except Exception as e:
            logger.error(f"{e=}")
            redirect_url = f"{request.scheme}://{request.get_host()}/auth/login-failed?errorMessage=Access Denied"
            return HttpResponseRedirect(redirect_url)
        return res


class UserDataAPIView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
