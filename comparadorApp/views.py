from django.shortcuts import render
import os

def comparador(request):

    return render(request,'comparador.html')

def index(request):
    return render(request,'index.html')

def blog(request):

    return render(request,'blog/noticia_list.html')

def detalle_noticia_template(request, slug):
    return render(request, 'blog/noticia_detail.html', {'slug': slug})