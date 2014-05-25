/* From https://gist.github.com/2579599
 * implementation heavily influenced by http://bl.ocks.org/1166403
 */
function create_graph(id) {
    // define dimensions of graph
    var m = [40, 20, 40, 40]; // margins
    var w = 1440-1152 - m[1] - m[3]; // width
    var h = 300 - m[0] - m[2]; // height
    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select('#'+id).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    return {g: graph, w: w, h: h};
}
function clear_graph() {
    d3.selectAll('svg path').remove();
    d3.selectAll('.axis').remove();
    // d3.selectAll('.legend').remove();
}
function plot(graph, data) {
    // var colors = colorbrewer.Set1[8];
    var colors = ['#ff4136', '#0074d9'];

    var h = graph.h,
        w = graph.w,
        graph = graph.g;
    // var data = [[3, 6, 2, 7, 5, 2], [0, 3, 8, 9, 2, 5]];
 
    var scaleX = d3.scale.linear().domain([0, data[0].length]).range([0, w]).nice();
    var extents = [d3.min(data.map(function(e){return d3.min(e);})),
                   d3.max(data.map(function(e){return d3.max(e);}))];
    var scaleY = d3.scale.linear().domain(extents).range([h, 0]).nice();
 
    // create a line function that can convert data[] into x and y points
    var line = d3.svg.line()
        .x(function(d,i) { return scaleX(i); })
        .y(function(d) { return scaleY(d); })
        .interpolate('cardinal').tension(0.9);

    // create xAxis
    var xAxis = d3.svg.axis().scale(scaleX).tickSize(-h);
    // Add the x-axis.
    graph.append("svg:g")
        .attr("id", "xaxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(scaleY).ticks(6).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
        .attr("id", "yaxis")
        .attr("class", "y axis")
        .attr("transform", "translate(-15,0)")
        .call(yAxisLeft);

    // Add the line by appending an svg:path element with the data line we created above
    // do this AFTER the axes above so that the line is above the tick-lines
    for (var i=0; i<data.length; i++) {
        var c = colors[i%colors.length];
        graph.append("svg:path").attr("d", line(data[i]))
            .attr('stroke', c)
            .attr('class', "venue_line")
            .attr('opacity', 0.85)
            .attr("stroke-width", 2);
        // graph.append("svg:path").attr("d", line(data[i]))
        //     .attr('id', 'shape_'+i)
        //     .attr('Xcolor', c.toString())
        //     .attr('Xname', names[i])
        //     .attr("stroke", "rgba(0,0,0,0.0)")
        //     .attr("stroke-width", 12)
        //     .on("mouseover", function() {      
        //         var info = d3.select(this);
        //         var color = info.attr('Xcolor'),
        //             name = info.attr('Xname');
        //         tooltip.html(name)  
        //         .style("left", (d3.event.pageX) + "px")     
        //         .style('background-color', d3.rgb(color).darker())
        //         .style("top", (d3.event.pageY - 40) + "px")    
        //         .style("opacity", 0.8);    
        //     })                  
        //     .on("mouseout", function() {       
        //            tooltip.style("opacity", 0);   
        //     });
    }
    // var legend = graph.append('g')
    //     .attr('class', 'legend')
    //     .attr("height", places.length*20)
    //     .attr("width", 200)
    //     .attr('transform', 'translate(-150,0)');
    // legend.selectAll('rect')
    //     .data(places)
    //     .enter()
    //     .append('rect')
    //     .attr('x', w - 20)
    //     .attr('y', function(d, i){return i *  20;})
    //     .attr('width', 10)
    //     .attr('height', 10)
    //     .style('fill', function(d) { return d.color; });
    //
    // legend.selectAll('text')
    //     .data(places)
    //     .enter()
    //     .append('text')
    //     .attr('x', w - 6)
    //     .attr('y', function(d, i){ return (i *  20) + 10;})
    //     .text(function(d){ return d.name; });

}

