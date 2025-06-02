$(document).ready(function () {

    obtenerData();
});


function obtenerData() {
    const noticias = 'noticias/';
    $.get(url + noticias, "", function(noticias) {
        if (noticias.length > 0) {


            noticias.forEach(function(noticia) {
                let tarjeta = generarTarjeta(
                    noticia.slug,
                    noticia.titulo,
                    noticia.contenido,
                    noticia.fecha_publicacion,
                    urlMedia + "noticias/" + noticia.imagen_cid // Asegúrate de que este campo existe en tu objeto noticia
                );
                $('#dvData').append(tarjeta);
            });


        } else {
            if (page === 1) {
                $('#dvData').html('<h3 style="text-align:center">No hay noticias disponibles.</h3>');
            }

        }

        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").hide();
    }).fail(function() {
        $('#dvData').html('<p>Error al obtener la lista de noticias.</p>');
        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
    });
}

function generarTarjeta(slug, titulo, contenido, fecha, imagenURL) {
    return `
    <div class="noticia-card">
        <a href="/noticias/${slug}/" class="noticia-link">
            <div class="noticia-img" style="background-image: url('${imagenURL}')"></div>
            <div class="noticia-content">
                <h4 class="noticia-titulo">${titulo}</h4>
                <p class="noticia-resumen">${contenido.substring(0, 120)}...</p>
                <p class="noticia-fecha">${new Date(fecha).toLocaleDateString('es-CL')}</p>
            </div>
        </a>
    </div>`;
}

// Ejemplo de cómo agregar una card (ajusta según tu estructura de datos)
const cardHtml = `
<div class="noticia-card">
    <a href="${detalleUrl}" class="noticia-link">
        <div class="noticia-img" style="background-image: url('${imagenUrl}');"></div>
        <div class="noticia-content">
            <div class="noticia-titulo">${titulo}</div>
            <div class="noticia-resumen">${resumen}</div>
            <div class="noticia-fecha">${fecha}</div>
        </div>
    </a>
</div>
`;
// Agrega cardHtml a #dvData