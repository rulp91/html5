d3.json("assets/data/engagement.json").then(data => {

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

    const chart = StackedBarChart(transformedData, {
        x: d => d.x,
        y: d => d.y,
        z: d => d.z,
        xDomain: data.map(d => d.name_user),
        yDomain: [0, d3.max(data, d => d.followers_count)],
        zDomain: ['Retweets', 'Favoritos'],
        yLabel: 'Número de seguidores',
        colors: ['#1f77b4', '#ff7f0e'],
        width: 1400,
        height: 600,
        marginLeft: 100
    });


    $("#id-grafica-svg").html(chart);
});