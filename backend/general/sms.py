import json

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.conf import settings


class TiwilioClient(object):
    PHONE_NUMBER_PREFIX = "+"
    CONFIRM_STATUS = "approved"

    def __init__(self):
        self.client = Client(
            settings.TWILIO_CONFIG['TWILIO_ACCOUNT_SID'],
            settings.TWILIO_CONFIG['TWILIO_AUTH_TOKEN']
        )
        self.verify = self.client.verify.services(
            settings.TWILIO_CONFIG['TWILIO_SERVICE_ID']
        )
        self.notify_service = self.client.notify.services(
            settings.TWILIO_CONFIG['TWILIO_NOTIFY_SERVICE_ID']
        )

    def send_sms_by_notify_service(self, numbers, content):
        binding = map(lambda x: json.dumps({'binding_type': 'sms', 'address': x}), numbers)
        self.notify_service.notifications.create(
            to_binding=list(binding),
            body=content,
        )

    def send_text_message(self, phone_number, text):
        x = self.client.messages.create(
            to=phone_number,
            from_=settings.TWILIO_CONFIG['TWILIO_FROM_NUMBER'],
            body=text,
        )

    def send(self, phone_number):
        self.verify.verifications.create(
            to=phone_number,
            channel="sms"
        )

    def confirm(self, phone_number, phone_otp):
        try:
            result = self.verify.verification_checks.create(
                to=phone_number,
                code=phone_otp
            )
        except TwilioRestException:
            return False
        return result.status == self.CONFIRM_STATUS

    def send_email(self, email, template_id):
        self.verify.verifications.create(
            to=email,
            channel="email",
            channel_configuration={
                'template_id': template_id,
            }
        )

    def confirm_email(self, email, email_otp):
        try:
            result = self.verify.verification_checks.create(
                to=email,
                code=email_otp
            )
        except TwilioRestException:
            return False
        return result.status == self.CONFIRM_STATUS


class PhoneOTP:

    @classmethod
    def send(cls, *args):
        TiwilioClient().send(*args)

    @classmethod
    def confirm(cls, *args):
        return TiwilioClient().confirm(*args)


class EmailOTP:

    @classmethod
    def send(cls, *args):
        TiwilioClient().send_email(*args)

    @classmethod
    def confirm(cls, *args):
        return TiwilioClient().confirm_email(*args)
