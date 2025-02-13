$(document).ready(function () {

    const $d3 = $(".js-range-slider").ionRangeSlider({
        skin: "round",
        min: 0,
        max: 3000000,
        from: 3000000,
        step: 1000,
        prettify_separator: ",",
        onFinish: function (data) {
            var valor = data.from; // Obtiene el valor del slider
            
            $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
            $("#lblmsjeData").show();
            obtenerData(valor);    // Ejecuta la función cuando el usuario suelta el mouse
        }
    });
    $('#iBoxPrice').children('.ibox-content').toggleClass('sk-loading');
    $('#iBoxOrden').children('.ibox-content').toggleClass('sk-loading');

    $("#frmContactar").submit(function(event) {
        event.preventDefault();         
        let nombre = $("#txtNombre").val();
        let apellido = $("#txtApellido").val();
        let rut = $("#txtRut").val();
        let dv = $("#txtDv").val();
        let correo = $("#txtCorreo").val();
        let telefono = $("#txtTelefono").val();
        let idServicio = $("#hServicioID").val();
        let prestador = $("#lblmPrestador").html(); // Asumiendo que tienes el nombre del prestador en este campo
        let servicio = $("#lblmServicio").html(); // Asumiendo que tienes el nombre del servicio en este campo
        let valor = $("#hValor").val(); // Asumiendo que tienes el valor del servicio en este campo
    
        if (!nombre || !apellido || !rut || !correo || !telefono) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }
    
        var dataCliente = { 
            "nombre": nombre, 
            "apellido": apellido, 
            "rut": rut, 
            "dv": dv, 
            "telefono": telefono, 
            "correo": correo, 
            "estado": "IN" 
        };
    
        $.ajax({
            url: url + 'clientes/', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataCliente),  
            success: function(response) {
                var dataClienteContacto = { 
                    "servicio": idServicio, 
                    "cliente": response.id, 
                    "rating": null, 
                    "comentario": null, 
                    "estado": "IN" 
                };
    
                $.ajax({
                    url: url + 'servicio-clienteContacto/', 
                    type: 'POST', 
                    contentType: 'application/json',
                    data: JSON.stringify(dataClienteContacto),  
                    success: function(response) {
                        console.log('ClienteContacto creado exitosamente:', response);
                        let whatsappURL = `https://wa.me/56933700142?text=Hola, %20mi%20nombre%20es%20${encodeURIComponent(nombre+ ' '+ apellido)}%20y%20quiero%20contactarme%20con%20la%20funeraria%20${encodeURIComponent(prestador)}%20por%20el%20servicio%20${encodeURIComponent(servicio)}%20que%20tiene%20un%20valor%20de%20${encodeURIComponent(valor)}`;
                        window.open(whatsappURL, '_blank');
                        limpiarForm();
                        $("#detalleModal").modal("hide");

                    },
                    error: function(xhr, status, error) {
                        console.error('Error al crear el ClienteContacto:', error);
                        alert("Error al crear el ClienteContacto. Intenta nuevamente.");
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error al crear el cliente:', error);
                alert("Error al crear el cliente. Intenta nuevamente.");
            }
        });
    
        return false;
    });
    

    $(document).on("click", ".region-checkbox", function () {
        let regionId = $(this).data('region-id');
        let isChecked = $(this).is(':checked');
        $(`.comuna-checkbox[data-region-id="${regionId}"]`).prop('checked', isChecked);

        var $inp = $($d3);
        var valor = $inp.prop("value");
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").show();
        obtenerData(valor);
    });

    $(document).on("click", ".comuna-checkbox", function () {
        var $inp = $($d3);
        var valor = $inp.prop("value");
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").show();
        obtenerData(valor);
    });

    $("#btnContactarDetalle").click(function () {
        if ($(this).html() === "Contactar") {
            // Cambiar texto, clases y mostrar/ocultar secciones
            $(this).html("Ver Detalles");
            $(this).removeClass("btnN").addClass("btnV");
            $("#rowDetalles").hide();
            $("#rowContactar").show();
        } else {
            // Cambiar texto, clases y mostrar/ocultar secciones
            $(this).html("Contactar");
            $(this).removeClass("btnV").addClass("btnN");
            $("#rowContactar").hide();
            $("#rowDetalles").show();
        }
        $(this).blur();
    });
    
    cargarRegiones();
    obtenerData(3000000);

    // Mostrar el menú de filtros al hacer clic en el botón
    $('#btnMostrarFiltros').on('click', function() {
        $('#dvFiltros').toggleClass('active'); // Muestra u oculta el filtro
        $('#dvData').toggleClass('content-blur'); // Difumina el contenido cuando el filtro está abierto

        // Cambia el texto del botón según el estado del filtro
        if ($('#dvFiltros').hasClass('active')) {
            $('#btnMostrarFiltros').text('Ocultar Filtros');
        } else {
            $('#btnMostrarFiltros').text('Mostrar Filtros');
        }
    });




    $("#selOrden").on('change', function(){
        var $inp = $($d3);
        var valor = $inp.prop("value"); // reading input value
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").show();
        obtenerData(valor);
    })

    $(".toggleRegion").on('click', function() {
        let regionId = $(this).attr('id').split('_')[1];
        if(!$('#'+$(this).attr('id')).hasClass('rowDown'))
        {
            $("#"+$(this).attr('id')).addClass("rowDown");
            $(`#icon-${regionId}`).removeClass('fa-chevron-right').addClass('fa-chevron-down'); // Cambia la flecha hacia abajo
        }
        else
        {
            $("#"+$(this).attr('id')).removeClass("rowDown");
            $(`#icon-${regionId}`).removeClass('fa-chevron-down').addClass('fa-chevron-right'); // Cambia la flecha hacia abajo
        }
        
    });

});

function obtenerData(precioMax, page = 1) {
    const serv = 'servicios/';
    let comunas = [];

    $(".ckf:checkbox:checked").each(function() {
        comunas.push($(this).val());
    });
    let orden = $("#selOrden").val();
    let parametros = {
        comunas: comunas.join(','),
        precio_max: precioMax,
        page: page,
        orden:orden,
        categoria:portalCode
    };

    $.get(url + serv, parametros, function(data) {
        if (data.results.length > 0) {
            if (page === 1) {
                $("#sNroResultados").html(data.count);
                $('#dvData').children(':not(#dvLoadData)').remove();
            }

            data.results.forEach(function(servicio) {
                let tarjeta = generarTarjeta(
                    servicio.id,
                    servicio.descripcion,
                    servicio.valor,
                    servicio.prestador_nombre,
                    servicio.region_nombre,
                    servicio.comuna_nombre,
                    servicio.direccionCalle,
                    servicio.direccionNumero,
                    servicio.prestador_logo,
                    servicio.rating_promedio,
                    servicio.servicios_principales
                );
                $('#dvData').append(tarjeta);
            });

            // Control del botón "Cargar más"
            if (data.next) {
                $('#btnCargarMas')
                    .show()
                    .off('click') // Eliminamos eventos previos para evitar duplicados
                    .on('click', function() {
                        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
                        obtenerData(precioMax, page + 1);
                    });
            } else {
                $('#btnCargarMas').hide();
            }

        } else {
            if (page === 1) {
                $('#dvData').html('<h3 style="text-align:center">No hay servicios disponibles.</h3>');
            }
            $('#btnCargarMas').hide();
        }

        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").hide();
    }).fail(function() {
        $('#dvData').html('<p>Error al obtener la lista de servicios.</p>');
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").hide();
    });
}

function cargarPrestaciones(servicioId) {
    const apiUrl = url+ `servicio-prestaciones/?servicio_id=${servicioId}`;

    $.get(apiUrl, function(data) {
        data.forEach(function(item) {
            const prestacion = item.prestacion;
            const tipo = item.tipo;

            let liElement = `<li class="list-group-item" >
                                <i class="iDetail ${prestacion.icono}"></i>
                                <span>${prestacion.descripcion}: ${item.detalle}</span>
                             </li>`;

            if (tipo === 'PR') {
                $('#ulPrincipal').append(liElement);
            } else if (tipo === 'AD') {
                $('#ulAdicional').append(liElement);
            }
            
        });
        $('#iboxServicios').children('.ibox-content').toggleClass('sk-loading');
    }).fail(function() {
        console.log("Error al cargar las prestaciones.");
        $('#iboxServicios').children('.ibox-content').toggleClass('sk-loading');
    });
}

function cargarResenias(servicioId) {
    const apiUrl = url + `servicio-clienteContacto/?servicio_id=${servicioId}`;

    $.get(apiUrl, function(data) {
        // Limpiamos el contenedor antes de añadir las nuevas reseñas
        if(data.length>0){
            data.forEach(function(item) {
                const usuario = item.usuario_nombre+ ' ' + item.usuario_apellido;
                const rating = item.rating;
                const comentario = item.comentario;
                const fecha = new Date(item.fechaCreacion).toLocaleDateString();

                // Generamos la estructura HTML de la tarjeta
                let tarjetaHtml = `
                    <div class="card mb-4">
                        <div class="card-body">
                            <p>${comentario}</p>

                            <div class="d-flex justify-content-between">
                                <div class="d-flex flex-row align-items-center">
                                    <i class='fa-solid fa-user stari mx-2 fa-xs iDetail' style="margin-top: -0.16rem;"></i>
                                    <p class="small mb-0 ms-2">${usuario} ${fecha}</p>
                                </div>
                                <div class="d-flex flex-row align-items-center">
                                    <p class="small text-muted mb-0">Valoración</p>
                                    <i class='fa-solid fa-star stari mx-2 fa-xs iDetail' style="margin-top: -0.16rem;"></i>
                                    <p class="small text-muted mb-0">${rating}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Añadimos la tarjeta al contenedor de reseñas
                $('#dvResenias').append(tarjetaHtml);
            });
        }
        else
        {
            let tarjetaHtml = `
                    <div class="card mb-4">
                        <div class="card-body" style='text-align:center'>
                            <p>No se encontraron comentarios para este servicio</p>
                        </div>
                    </div>
                `;
                $('#dvResenias').append(tarjetaHtml);
        }
        $('#iboxValoraciones').children('.ibox-content').toggleClass('sk-loading');
    }).fail(function() {
        console.log("Error al cargar las reseñas.");
        $('#iboxValoraciones').children('.ibox-content').toggleClass('sk-loading');
    });
}

function cargarRegiones() {
    $.ajax({
        url: url + "regiones?categoria="+portalCode,
        type: 'GET',
        async: false,
        success: function(data) {
            let regionContainer = $('#regionContainer');

            data.forEach(function(region) {
                let regionHtml = `
                    <div class="region-item">
                        <div class="region-header d-flex align-items-center">
    
                            <i class="fas fa-chevron-right collapse-icon mr-2" id="icon-${region.id}"></i> 
 
                            <input class="region-checkbox" type="checkbox" checked="checked" id="region-${region.id}" data-region-id="${region.id}">
   
                            <label for="region-${region.id}" class="mb-0">
                                <a href="#collapse-region-${region.id}" data-toggle="collapse" id="tr_${region.id}" class="toggleRegion ml-1" style="text-decoration:none;" aria-expanded="false">
                                    ${region.descripcion}
                                </a>
                            </label>
                        </div>
                        <div id="collapse-region-${region.id}" class="collapse">
                            <div class="comunas-list">
                `;

                // Genera los checkboxes para las comunas
                region.comunas.forEach(function(comuna) {
                    regionHtml += `
                        <div class="form-check ckf">
                            <input class="form-check-input comuna-checkbox ckf" checked="checked" type="checkbox" value="${comuna.id}" data-region-id="${region.id}" id="comuna-${comuna.id}">
                            <label class="form-check-label" for="comuna-${comuna.id}">
                                ${comuna.descripcion}
                            </label>
                        </div>
                    `;
                });

                regionHtml += `
                            </div>
                        </div>
                    </div>
                `;

                regionContainer.append(regionHtml);
            });
            $('#iBoxUbicacion').children('.ibox-content').toggleClass('sk-loading');
        },
        error: function(error) {
            console.log('Error:', error);
            $('#iBoxUbicacion').children('.ibox-content').toggleClass('sk-loading');
        }
    });
}

function generarTarjeta(id, desc, valor, prestador, region, comuna, dir, num,logo,rating,servicios_principales) {
    let estrellasHTML = ""; // Aquí generamos las estrellas dinámicamente
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            // Pintar estrella amarilla
            estrellasHTML += "<i class='fa-solid fa-star stari' style='color:gold'></i>";
        } else {
            // Pintar estrella gris (no activa)
            estrellasHTML += "<i class='fa-solid fa-star stari' style='color:lightgray'></i>";
        }
    }
    let serviciosHTML = "";
    servicios_principales.forEach(servicio => {
        serviciosHTML += `
            <div class='col' style='text-align:center; border-left:1px #dee2e6 solid'>
                <i class='iDetail ${servicio.icono}' aria-hidden='true'></i><br />
                <small style='font-weight: bold;'>${servicio.prestacion}</small><br />
                <small>${servicio.detalle}</small>
            </div>`;
    });

    let card = "<div class='row g-0 p-3 border rounded overflow-hidden ml-2 mr-2 mb-4' style='background-color:white'>"+
             // Contenedor de la imagen con flexbox
             "<div class='col-12 col-lg-3 d-lg-flex justify-content-center align-items-center' style='display: flex; justify-content: center; align-items: center; max-height: 180px;min-height:80px'>"+ // Aseguramos flexbox
             "    <a>"+
             "        <img src='"+urlMedia+"prestadores/"+logo+"' alt='"+prestador+"' class='logoServicio'>"+ // Ajuste automático de la imagen
             "    </a>"+
             "</div>"+
             // Información del servicio
             "<div class='col-lg-7 col-12 d-flex flex-column position-static dvDetalle'>"+
             "    <strong class='d-inline-block mb-2' style='color:#0097B2' id='lblRegion_"+id+"'> Región "+region+"</strong>"+
             "    <h4 class='mb-0' style='color:#343232' id='hServicioCr_"+id+"'> "+desc+" </h4>"+
             "    <h5 class='mb-0' style='color:#7a7878' id='hNombreCr_"+id+"'> "+prestador+" </h5>"+
             "    <label id='lblDireccion_"+id+"' class='lblDir'><i class='fa-solid fa-location-dot' style='color:#0097B2;margin-right:4px'> </i>"+dir+" "+num+", "+comuna+"</label>"+
             "    <div class='row' style='border-top: 1px #dee2e6 solid;padding-top:10px'><div class='col-12 col-lg-3' style='text-align:center'><div class='mb-1 text-body-secondary' style='color:#0097B2'><b> Valoración:</b></div>"+
             "    <div>"+
                  estrellasHTML+
             "    </div> "+
             "    </div>"+
                  serviciosHTML+
            "</div>"+
             "</div>"+
             "<div class='col-lg-2 col-12 d-lg-block dvPrice'>"+
             "    <h4 class='mb-0' style='padding-bottom:5px' id='lblDesdeValor_"+id+"'>"+
                    "<span style='font-size:16px'>DESDE <br /></span>"+
                    "<label id='lblValor_"+id+"'>$"+Intl.NumberFormat("es-MX").format(valor)+"</label>"+
                  "</h4>"+
             "    <input type='button' class='pulse-button btnc' value='Contactar' onclick='verDetalles("+id+",1)' /><br />"+
             "    <input type='button' class='form-control btnc btnV' onclick='verDetalles("+id+",0)' value='Ver detalles' />"+
             "</div>"+
             "</div>";
     
     return card;
 }
 
 function verDetalles(id,detalle)
 {
    let region =$("#lblRegion_"+id).html();
    let prestador =$("#hNombreCr_"+id).html();
    let servicio =$("#hServicioCr_"+id).html();
    let direccion =$("#lblDireccion_"+id).html();
    let valor =$("#lblDesdeValor_"+id).html();
    let soloValor = $("#lblValor_"+id).html();
    $('#ulPrincipal').empty();
    $('#ulAdicional').empty();
    $('#dvResenias').empty();
    $("#lblmServicio").html(servicio);
    $("#lblmPrestador").html(prestador);
    $("#lblmDireccion").html(direccion+", "+region);
    $("#lblmValor").html(valor);
    
    if(detalle == 0){
        $("#btnContactarDetalle").html("Contactar");
        $("#btnContactarDetalle").removeClass("btnV").addClass("btnN");
        $("#rowContactar").hide();
        $("#rowDetalles").show();
    }
    else
    {
        $("#btnContactarDetalle").html("Ver Detalles");
        $("#btnContactarDetalle").removeClass("btnN").addClass("btnV");
        $("#rowDetalles").hide();
        $("#rowContactar").show();
    } 
    $("#btnContactarDetalle").blur();
    $("#hServicioID").val(id);
    $("#hValor").val(soloValor);

    $('#iboxServicios').children('.ibox-content').toggleClass('sk-loading');
    $('#iboxValoraciones').children('.ibox-content').toggleClass('sk-loading');
    $("#detalleModal").modal("show");
    cargarPrestaciones(id);
    cargarResenias(id);
 }

 function limpiarForm()
 {
    $("#txtNombre").val("");
    $("#txtApellido").val("");
    $("#txtRut").val("");
    $("#txtDv").val("");
    $("#txtCorreo").val("");
    $("#txtTelefono").val("");
 }