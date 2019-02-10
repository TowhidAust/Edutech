import * as d3 from "d3";

class BarChart{
    
    init(container,inputData) {
       
       
       // SETUP
        $(container).append(/* html*/`
        <svg class="svg-bar" width="100%"></svg>
        `
        );

        let svg = d3.select("svg");
        let margin = { top: 20, right: 20, bottom: 30, left: 40 };
        let x = d3.scaleBand().padding(0.1);
        let y = d3.scaleLinear();
        let theData = undefined;
        let theData2 = inputData.graphValues;
        
            let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            g.append("g")
            .attr("class", "axis axis--x");
        
            g.append("g")
                .attr("class", "axis axis--y");
            // y-axis name
            g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -20+"%")
                .attr("x", -5+"%")
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("y-axis");
            // x-axis name
                g.append("text")
                .attr("transform", "rotate(0)")
                .attr("x", 80 + "%")
                .attr("y", 79 + "%")
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("x-axis");

                let title = d3.select(container);
                    title
                    .append('h4')
                    .data(theData2)
                    .classed("bar_title", true)
                    .style("text-align", "center")
                    .style("margin-top", "-5px")
                    .html(function(d){return d.title});

                // d3.select(container)
                // .append('h3')
                // .classed("bar_title", true)
                // .style("text-align", "center")
                // .html("this is a title");

            // title
                // g.append("text")
                // .attr("transform", "rotate(0)")
                // .attr("x", 45+ "%")
                // .attr("y", 80 + "%")
                // .attr("dy", "0.71em")
                // .attr("text-anchor", "end")
                // .text("title");
        
        
        
     // DRAWING

        function draw() {

                let bounds = svg.node().getBoundingClientRect(),
                width = bounds.width - margin.left - margin.right,
                height = bounds.height - margin.top - margin.bottom;
                x.rangeRound([0, width]);
                y.rangeRound([height, 0]);

                g.select(".axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

                g.select(".axis--y")
                .call(d3.axisLeft(y));

                let bars = g.selectAll(".bar")
                .data(theData);

                // ENTER
                bars
                    .enter().append("rect")
                    .attr("class", "bar")
                    .style("fill", function (d) {
                        return d.color;
                    })
                    .attr("x", function (d) { return x(d.name); })
                    .attr("y", function (d) { return y(d.value); })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) { return height - y(d.value); });

                // UPDATE
                bars.attr("x", function (d) { return x(d.name); })
                    .attr("y", function (d) { return y(d.value); })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) { return height - y(d.value); });

                    
                   
                // EXIT
                bars.exit()
                .remove();
                    }
                    
                    // LOADING DATA

                function loadData() {
                    theData = inputData.readings;
                    // theData2 = inputData.graphValues;
                    // theData2.map(function (d) { return d.title; });
                    x.domain(theData.map(function (d) { return d.name; }));
                    y.domain([0, d3.max(theData, function (d) { return d.value; })]);
                    draw();
                }
               
                // START!
                window.addEventListener("resize", draw);
                loadData();
                }

    

    
}
export default BarChart;
