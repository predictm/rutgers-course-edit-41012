from rest_framework import status
from rest_framework.renderers import JSONRenderer


def parse_error(errors):
    response = None

    if isinstance(errors, str):
        response = errors
    elif isinstance(errors, dict):
        for i in errors.keys():
            if isinstance(errors[i], list):
                response = parse_error(errors[i][0])
            elif isinstance(errors[i], str):
                response = errors[i]
            elif isinstance(errors[i], dict):
                response = parse_error(errors[i])
            break
    elif isinstance(errors, list):
        if isinstance(errors[0], list):
            response = parse_error(errors[0])
        elif isinstance(errors[0], str):
            response = errors[0]
        elif isinstance(errors[0], dict):
            response = parse_error(errors[0])
    return response


def get_error_data(errors, status_text):
    try:
        error_data = parse_error(errors)
    except Exception:
        error_data = ''
    return error_data if error_data else status_text


class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        # reformat the response
        status_code = renderer_context['response'].status_code
        response_status = "success"
        response_data = data
        errors = []
        if isinstance(data, dict):
            response_message = data.pop('response_message', '')
        elif isinstance(data, str):
            response_message = data
        else:
            response_message = ''

        if status.is_client_error(status_code) or status.is_server_error(status_code):
            response_status = 'failure'
            errors = response_data
            response_data = []
            if not response_message:
                response_message = get_error_data(errors, renderer_context['response'].status_text)

        custom_data = {"status": response_status, "status_code": status_code,
                       "message": response_message,
                       "errors": errors, "data": response_data}
        # call super to render the response
        response = super(CustomJSONRenderer, self).render(
            custom_data, accepted_media_type, renderer_context
        )

        return response
