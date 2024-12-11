from django.conf import settings
from django.http import JsonResponse
from django.utils.encoding import force_str
from rest_framework import status
from rest_framework.exceptions import APIException, _get_error_details
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response:
        if response.status_code == 403:
            response.data = {'status': status.HTTP_403_FORBIDDEN,
                             'message': response.data['detail']}
        if response.status_code != 403 and response.status_code != 200:
            resp_data = response.data
            if 'detail' in resp_data:
                resp_data = resp_data["detail"]
                response.data = resp_data
            response.data = {'status': response.status_code,
                             'message': str(resp_data)}
        return response

    if not settings.DEBUG:
        return Response({'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': str(exc)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def custom_server_error(request, *args, **kwargs):
    """
    Generic 500 error handler.
    """
    data = {
        "status": 'failure',
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "message": 'Error Message(500)',
        "errors": [],
        "data": []
    }
    return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def custom_bad_request(request, exception, *args, **kwargs):
    """
    Generic 400 error handler.
    """
    data = {
        "status": 'failure',
        "status_code": status.HTTP_400_BAD_REQUEST,
        "message": 'Bad Request (400)',
        "errors": [],
        "data": []
    }
    return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)


class InvalidStatusChange(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = '{message}'

    def __init__(self, message, detail=None, code=None):
        if detail is None:
            detail = force_str(self.default_detail).format(message=message)
        super().__init__(detail, code)

