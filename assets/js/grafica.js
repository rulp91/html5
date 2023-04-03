// Cargar los datos
d3.json("assets/data/engagement.json").then(data => {
    // Convertir los datos al formato requerido por StackedBarChart
    const transformedData = data.reduce((accumulator, item) => {
        accumulator.push({
            x: item.user_id,
            y: item.followers_count,
            z: 'Retweets',
            value: item.media_retweets
        });
        accumulator.push({
            x: item.user_id,
            y: item.followers_count,
            z: 'Favoritos',
            value: item.media_favoritos
        });
        return accumulator;
    }, []);

    const chart = StackedBarChart(transformedData, {
        x: d => d.x,
        y: d => d.y,
        z: d => d.z,
        xDomain: data.map(d => d.user_id),
        yDomain: [0, d3.max(data, d => d.followers_count)],
        zDomain: ['Retweets', 'Favoritos'],
        yLabel: 'Followers Count',
        colors: ['#1f77b4', '#ff7f0e'],
        width: 800,
        height: 400,
        marginLeft: 100
    });

    $("#grafica").html(chart);
});