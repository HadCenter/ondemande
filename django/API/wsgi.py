"""
WSGI config for API project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.wsgi import get_wsgi_application
import websocket.urls
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'API.settings')

#application = get_wsgi_application()


application = ProtocolTypeRouter({
  "HTTP": get_wsgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket.urls.websocket_urlpatterns
        )
    ),
})