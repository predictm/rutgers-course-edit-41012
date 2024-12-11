from ...models import Announcement, AnnouncementNotification
from rest_framework import serializers

# Code

class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for the Announcement model.

    This serializer is used to convert Announcement model instances to JSON data and vice versa.
    It specifies the fields to be included in the serialization.

    Attributes:
        Meta: A nested class that defines the model and fields to be serialized.
    """

    class Meta:
        model = Announcement
        fields = '__all__'


class AnnouncementNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = AnnouncementNotification
        fields = "__all__"