from django.shortcuts import render
import os

def comparador(request):

    URL_API = os.getenv("URL_API")
    URL_MEDIA = os.getenv("URL_MEDIA")
    PORTALCODE = os.getenv("PORTALCODE")
    return render(request,'comparador.html',{"URL_API":URL_API,"URL_MEDIA":URL_MEDIA,"PORTALCODE":PORTALCODE})

