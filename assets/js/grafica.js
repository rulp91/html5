d3.json("assets/data/engagement3.json").then(data => {

    const transformedData = data.reduce((accumulator, item) => {
        accumulator.push({
            x: item.name_user,
            y: item.followers_count,
            z: 'Retweets',
            value: item.media_retweets
        });
        accumulator.push({
            x: item.name_user,
            y: item.followers_count,
            z: 'Favoritos',
            value: item.media_favoritos
        });
        return accumulator;
    }, []);

    const influenciaLookup = data.reduce((acc, item) => {
        acc[item.name_user] = item.influencia;
        return acc;
    }, {});

    const barWidthScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.influencia)])
        .range([10, 80]); // Ajustando esto pudemos ajustar el ancho de la barra

    const chart = StackedBarChart(transformedData, {
        x: d => d.x,
        y: d => d.y,
        z: d => d.z,
        xDomain: data.map(d => d.name_user),
        yDomain: [0, d3.max(data, d => d.followers_count)],
        zDomain: ['Retweets', 'Favoritos'],
        yLabel: 'Número de seguidores',
        colors: ['#1f77b4', '#ff7f0e'],
        width: 1800,
        height: 600,
        marginLeft: 100,
        barWidth: (i) => barWidthScale(influenciaLookup[transformedData[i].x])
    });


    $("#id-grafica-svg").html(chart);
});