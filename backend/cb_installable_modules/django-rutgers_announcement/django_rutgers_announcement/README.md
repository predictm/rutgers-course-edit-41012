# Welcome to the Crowdbotics Django Announcement Module

This module, specifically designed for Rutgers and its associated apps, serves as a robust solution for sending bulk in-app notifications to users. The Django Announcement Module enables users to schedule announcements for future dates, with the added convenience of utilizing the Celery periodic service for efficient notification delivery.

## Module Features

- **Bulk In-App Notifications:** Easily send bulk in-app notifications to users, keeping them informed about important updates or events.

- **Scheduled Announcements:** Schedule announcements for future dates to ensure timely communication with users.

- **Celery Periodic Service:** Leverage the power of Celery periodic service for seamless and efficient delivery of scheduled announcements.

- **API Endpoints:** Convenient API endpoints are exposed for creating announcements and retrieving lists of notifications.

## Usage Guidelines

To integrate and use the Django Announcement Module, follow these steps:

1. Add the module to your app.

2. Run the migration command:

    ```bash
    python manage.py migrate
    ```

3. Navigate to `modules/django_rutgers_announcement` and open the `tasks.py` file.

4. Uncomment the entire code and replace the first line of the file with your project's Celery app. Save the changes. (Assuming Celery service is already installed and configured in your project.)

5. With these steps completed, the module is ready for use.

Please note that this module relies on the Celery service to run periodic tasks. You can customize the module to use your own periodic service if needed.

Thank you,
Crowdbotics Module Development Team