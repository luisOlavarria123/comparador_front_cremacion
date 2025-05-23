from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.index, name='index'),
    path('compara/', views.comparador, name='compara'),
    path('blog', views.blog, name='blog'),
    path('terminosCondiciones', views.terminosCondiciones, name='terminosCondiciones'),
    path('noticias/<slug:slug>/', views.detalle_noticia_template, name='detalle-noticia-template'),
    path('noticias/<slug:slug>/', views.detalle_noticia_template, name='noticia_detalle'),
]