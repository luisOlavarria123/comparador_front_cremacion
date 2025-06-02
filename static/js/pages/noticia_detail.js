$(document).ready(function () {
    const noticias = 'noticias';
    $.get(`${url}${noticias}/${slug}/`, function (data) {
        $('#titulo').text(data.titulo);

        // Formatea la fecha ISO a dd/mm/yyyy
        const fechaISO = data.fecha_publicacion || data.fecha_creacion;
        const fechaObj = new Date(fechaISO);
        const fechaFormateada = fechaObj.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        $('#fecha').text(fechaFormateada);

        let contenido = data.contenido;
        let fragmentos = [];

        // Si no hay <p>, divide en frases
        if (!contenido.includes('<p')) {
            fragmentos = contenido
                .split(/(?<=[.?!])\s+/) // divide por punto, signo de exclamación o interrogación
                .map(frase => `<span>${frase.trim()}</span>`);
        } else {
            // Si viene en HTML, divide por cierre de párrafo
            fragmentos = contenido.split(/(<\/p>)/i).filter(Boolean);
        }

        // Inserta la imagen después de la mitad de los fragmentos
        const mitad = Math.ceil(fragmentos.length / 1.4);
        const imagenUrl = urlMedia + "noticias/" + data.imagen_cid;
        const imgTag = `<img src="${imagenUrl}" class="img-col2" alt="Imagen noticia">`;
        fragmentos.splice(mitad, 0, imgTag);

        $('#contenido').html(fragmentos.join(''));

        $('#iBoxData').children('.ibox-content').toggleClass('sk-loading');
        $("#lblmsjeData").hide();
    });
});

