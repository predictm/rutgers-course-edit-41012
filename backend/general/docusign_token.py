import time
from cryptography.hazmat.primitives import serialization as crypto_serialization
from jose import jws
from django.conf import settings
from contract.models import DocusignKey
from general.cache_helper import CacheHelper


def generate_docusign_token():
    iat = int(time.time())
    exp = iat + 3600
    payload = {
        "sub": settings.CLIENT_USER_ID,
        "iss": settings.CLIENT_AUTH_ID,
        "iat": iat,  # Session start time
        "exp": exp,  # Session end time
        "aud": settings.CLIENT_APP_ENV_URI,
        "scope": "signature impersonation"
    }

    # with open('general/private_key.pem', "rb") as key_file:
    #     private_key = crypto_serialization.load_pem_private_key(key_file.read(), password=None)

    # key = private_key.private_bytes(
    #     crypto_serialization.Encoding.PEM,
    #     crypto_serialization.PrivateFormat.PKCS8,
    #     crypto_serialization.NoEncryption()
    # )
    docusign_key = DocusignKey.objects.first()
    if not docusign_key:
        raise ValueError("No DocusignKey instance found.")

    private_key = docusign_key.private_key

    jwt_token = jws.sign(payload, private_key, algorithm='RS256')
    CacheHelper.set_to_cache('docusign_token', jwt_token, timeout=3500)
    return jwt_token
