from setuptools import setup
from setuptools.command.build import build


# Override build command
class BuildCommand(build):
    def initialize_options(self):
        build.initialize_options(self)
        self.build_base = "/tmp"


setup(
    name="cb_django_email_templates",
    version="0.1",
    packages=["email_templates"],
    install_requires=["django-post_office"],
    cmdclass={"build": BuildCommand},
)