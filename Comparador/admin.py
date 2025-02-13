from django.contrib import admin
from .models import Region
from .models import Comuna
from .models import Prestador
from .models import PrestadorSucursal
from .models import Servicio
from .models import PrestadorCategoria
from .models import ServicioTipo

class RegionAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)

class ComunaAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)

class PrestadorCategoriaAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)

class PrestadorAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)

class PrestadorSucursalAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)    

class ServicioTipoAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion')
    readonly_fields = ("fechaCreacion",)

class ServicioAdmin(admin.ModelAdmin):
    list_display = ('id','descripcion','prestado_descripcion')
    readonly_fields = ("fechaCreacion",)            
    def prestado_descripcion(self, obj):
        return obj.prestador.descripcion
    prestado_descripcion.short_description = 'descripcion'

# Register your models here.

admin.site.register(Region, RegionAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(PrestadorCategoria, PrestadorCategoriaAdmin)
admin.site.register(Prestador, PrestadorAdmin)
admin.site.register(PrestadorSucursal, PrestadorSucursalAdmin)
admin.site.register(ServicioTipo, ServicioTipoAdmin)
admin.site.register(Servicio, ServicioAdmin)