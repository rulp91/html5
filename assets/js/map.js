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
    let urlBaseApiWikipedia = "https://es.wikipedia.org/w/api.php";
    group.on("click", function(d) {

        $("#id-spinner").css("display", "block");

        let provincia = d.properties.name;
        let searchString = "provincia de "+provincia+" España";
        if(provincia==="Madrid")
            searchString = "Comunidad de "+provincia+" España";

        $.ajax({
            url: urlBaseApiWikipedia,
            data: {action: 'query', generator: 'images', list: 'search', srprop: 'snippet', format:'json', origin: '*', srsearch: searchString},
            crossDomain: true,
            dataType: "jsonp",
        }).done(function (data) {

            console.log(data)
            let item = data.query.search[0]
            let pageId = item.pageid;
            let title = item.title;
            $("#id-cabecera-titulo").html(title);

            $.ajax({
                url: urlBaseApiWikipedia,
                data: {action: 'query', prop: 'extracts', format:'json', origin: '*', exintro: '', explaintext: '', pageids: pageId},
                crossDomain: true,
                dataType: "jsonp",
            }).done(function (data) {
                console.log(data)
                let info = data.query.pages[pageId].extract;
                let cleanInfo = info.replace(/\[.*\]/gmi, '').replace(/&{2,}/gmi, '')
                $("#id-contenido-dinamico").html(cleanInfo);
            });

            $.ajax({
                url: urlBaseApiWikipedia,
                data: {action: 'query', prop: 'pageimages', format:'json', origin: '*',pithumbsize:500 ,pageids: pageId},
                crossDomain: true,
                dataType: "jsonp",
            }).done(function (data) {

                console.log(data);
                let image = data.query.pages[pageId].thumbnail;
                $("#id-imagen-dinamica").attr("src", image.source);
                $("#id-spinner").css("display", "none");
            });
        });

    })
});