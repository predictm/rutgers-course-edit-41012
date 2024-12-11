from docusign_esign import EnvelopeDefinition, Document, Signer, SignHere, Tabs, Recipients, ApiClient, EnvelopesApi, CarbonCopy, DateSigned, FullName, Notification, Attachment
from django.conf import settings
import datetime
from django.core.files.base import ContentFile
import base64

class DocuSignOperations:
    def create_api_client(self, token_provider):
        # Create an instance of the DocuSign API client
        api_client = ApiClient()
        api_client.host = f"{settings.CLIENT_ACCOUNT_BASE_URI}/restapi"
        api_client.set_default_header('Authorization', f'Bearer {token_provider["access_token"]}')

        return api_client

    def create_envelope_definition(self, document, signer_name, signer_email, email_subject, email_body):
        with open("general/email-attachment/BC-10 Unemployment Form.pdf", "rb") as file:
            file_content = file.read()
            base64_content = base64.b64encode(file_content).decode("utf-8")

        # Create a DocuSign envelope definition
        envelope_definition = EnvelopeDefinition(
            email_subject=email_subject,
            email_blurb=email_body,
            status="sent",
            documents=[document, Document(
                document_base64=base64_content,
                name="BC-10 Unemployment Form.pdf",
                file_extension="pdf",
                document_id="2"
            )],
            recipients=self.create_recipients(signer_name, signer_email),
            notification=Notification(
                use_account_defaults="true",
                # reminders={
                #     "reminder_enabled": "true",
                #     "reminder_delay": "1",
                #     "reminder_frequency": "2"
                # },
                # expirations={
                #     "expire_enabled": "true",
                #     "expire_after": "120",
                #     "expire_warn": "10"
                # }
            )
        )
        return envelope_definition

    def create_recipients(self, signer_name, signer_email):
        # Create recipients (signers and carbon copies)
        signer = Signer(
            email=signer_email,
            name=signer_name,
            recipient_id="1",
            tabs=self.create_tabs(),
        )
        #if you want to send an cc email then uncomment below code and you will have to create a carbon copy object
        # that will be added to the recipients object below in the code by adding the env values for cc email and name
        # cc1 = CarbonCopy(
        #     email=settings.CC_EMAIL,
        #     name=settings.CC_NAME,
        #     recipient_id="2",
        # )

        # Add recipients to the Recipients object
        # recipients = Recipients(signers=[signer], carbon_copies=[cc1])
        recipients = Recipients(signers=[signer])

        return recipients

    def create_tabs(self):
        # Create tabs for the signer
        sign_here_tab = SignHere(
            document_id="1",
            page_number="1",
            recipient_id="1",
            tab_label="SignHereTab",
            anchor_string="SIGNATURE",
            anchor_units="pixels",
            anchor_x_offset="10",
            anchor_y_offset="-40",
        )

        date_signed_tab = DateSigned(
            document_id="1",
            page_number="1",
            recipient_id="1",
            anchor_case_sensitive="true",
            anchor_match_whole_word="true",
            tab_label="DateSignedTab",
            anchor_string="DATE",
            anchor_units="pixels",
            anchor_x_offset="10",
            anchor_y_offset="-40",
            value=datetime.datetime.now().strftime("%Y-%m-%d"),
        )

        fullname_tab = FullName(
            document_id="1",
            page_number="1",
            recipient_id="1",
            tab_label="NameTab",
            anchor_string="NAME (please print)",
            anchor_units="pixels",
            anchor_x_offset="10",
            anchor_y_offset="-40",
        )

        # Add tabs to the Tabs object
        tabs = Tabs(sign_here_tabs=[sign_here_tab], date_signed_tabs=[date_signed_tab], full_name_tabs=[fullname_tab])

        return tabs

    def signature_by_email(self, token_provider, base64_file_content, signer_name, signer_email, email_subject, email_body):
        try:
            # Step 1: Create the document
            document = Document(
                document_base64=base64_file_content,
                name="Contract",  # Change the file name as needed
                file_extension="html",  # Change the file extension based on your document type
                document_id="1"
            )
            # Step 2: Create the DocuSign envelope definition
            api_client = self.create_api_client(token_provider)
            envelope_definition = self.create_envelope_definition(document, signer_name, signer_email, email_subject, email_body)
            # Step 3: Create and send the envelope
            envelope_api = EnvelopesApi(api_client)
            results = envelope_api.create_envelope(settings.CLIENT_ACCOUNT_ID, envelope_definition=envelope_definition)
            envelope_id = results.envelope_id

            return {'envelope_id': envelope_id, 'message': 'DocuSign envelope created successfully', 'error': None}

        except Exception as e:
            return {'envelope_id': None, 'message': 'Internal server error', 'error': str(e)}
