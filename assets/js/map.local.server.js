let svg = d3.select("#id-mapa-svg"),
    width = 1100,
    height = 1000;

// Creamos la proyección
let projection = d3.geoMercator()
    .scale(2200)
    .center([0, 40])
    .translate([width / 1.4, height / 3]);

// Creamos el path añadiendo la proyección
let path = d3.geoPath(projection);

// Creamos una rejilla que se repita cada 2 grados tanto
//   en direcciones norte-sur como este-oeste
let graticule = d3.geoGraticule().step([2, 2]);

// Añadimos la rejilla
svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// Obtenemos las provincias de España en formato geojson
const url = "assets/data/spain-provinces.geojson";
d3.json(url, function(error, spain){
    if (error) throw error;  // Manejamos cualquier posible error

    //  Creamos un grupo para cada provincia
    let group = svg.selectAll("g")
        .data(spain.features)
        .enter()
        .append("g");

    svg.selectAll("text")
        .data(spain.features)
        .enter()
        .append("svg:text")
        .text(function(d){
            return d.properties.name;
        })
        .attr("x", function(d){
            return path.centroid(d)[0];
        })
        .attr("y", function(d){
            return  path.centroid(d)[1];
        })
        .attr("text-anchor","middle")
        .attr('font-size','6pt');

    // Para cada grupo añadimos el path correspondiente
    let areas = group.append("path")
        .attr("d", path)
        .attr("class", "province");

    //Añadimos el evento onclick para realizar una petición ajax
    let localhostApiProject = "http://webserver.local/api/project/";
    group.on("click", function(d) {

        $("#id-spinner").css("display", "block");

        let provincia = d.properties.cod_prov;
        $.ajax({
            url: localhostApiProject + provincia,
            dataType: "json",
            responseType:'application/json',
        }).done(function (data) {

            console.log(data)
            let nombre = 'Provincia de ' + data.nombre;
            let descripcion = data.descripcion;
            let image_path = data.image_path;

            $("#id-cabecera-titulo").html(nombre);
            $("#id-contenido-dinamico").html(descripcion);
            $("#id-imagen-dinamica").attr("src", image_path);
            $("#id-spinner").css("display", "none");

        });

    })
});