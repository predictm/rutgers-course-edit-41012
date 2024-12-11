# Crowdbotics Email Templates Module Documentation

Welcome to the Crowdbotics Email Templates module, a powerful tool built around the Django Post Office package for seamless email handling in your Django projects.

## Setup

To integrate this module into your project, follow these simple steps:

1. Add "post_office" to `INSTALLED_APPS` in your `settings.py` file:

    ```python
    INSTALLED_APPS = [
        # ...
        'post_office',
        # ...
    ]
    ```

2. Run migrations:

    ```bash
    python manage.py migrate
    ```

3. Set `post_office.EmailBackend` as your `EMAIL_BACKEND` in `settings.py`:

    ```python
    EMAIL_BACKEND = 'post_office.EmailBackend'
    ```

## Sending Simple Emails

Sending a basic email is straightforward:

```python
from post_office import mail

mail.send(
    'recipient@example.com',  # List of email addresses also accepted
    'from@example.com',
    subject='My email',
    message='Hi there!',
    html_message='Hi <strong>there</strong>!',
)
```

## Using Templates

If you prefer using templates, ensure that Django's admin interface is enabled. Create an `EmailTemplate` instance via the admin panel and then use it in your code:

```python
from post_office import mail

mail.send(
    'recipient@example.com',  # List of email addresses also accepted
    'from@example.com',
    template='welcome_email',  # Could be an EmailTemplate instance or name
    context={'foo': 'bar'},
)
```

For more detailed information and advanced usage, refer to the [project documentation](https://pypi.org/project/django-post-office/).

Feel free to explore the capabilities of the Crowdbotics Email Templates module and enhance your Django project's email functionality effortlessly!