$(document).ready(function () {
    const noticias = 'noticias';
    $.get(`${url}${noticias}/${slug}/`, function (data) {
        $('#titulo').text(data.titulo);
        $('#fecha').text(new Date(data.fecha_creacion).toLocaleDateString('es-CL'));
        $('#contenido').text(data.contenido);


        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").hide();
    }).fail(function() {
        $('#dvData').html('<p>Error al obtener la lista de noticias.</p>');
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
    });
});

