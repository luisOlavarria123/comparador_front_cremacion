# comparadorApp/context_processors.py

from django.conf import settings

def global_variables(request):
    return {
        'URL_API': settings.URL_API,
        'URL_MEDIA': settings.URL_MEDIA,
        'PORTALCODE': settings.PORTALCODE,
    }