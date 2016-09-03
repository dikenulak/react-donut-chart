import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';

class DonutChart extends Component {
    componentDidMount(){
        this.renderChart(this.props.data);
    }
    renderChart(data){
        var width = this.props.width,
            height = this.props.height,
            radius = Math.min(width, height) / 2;

        var divNode = d3.select("body").node();
        var color = d3.scale.ordinal().range(["#6BAED6", "#9ECAE1", "#C6DBEF", "#3182BD"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 80);

        var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.7)
            .outerRadius(radius * 1.1);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var svg = d3.select("#"+this.props.class).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width/ 2.4 + "," + height / 1.9 + ")");

        var defs = svg.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height","130%");

        filter.append("feGaussianBlur")
            .attr("in","SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");

        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 3)
            .attr("dy", 3)
            .attr("result", "offsetBlur");
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");


        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.name); })
            .on("mousemove", function(d) {
                d3.select(this)
                    .attr("stroke","#fff")
                    .attr("stroke-width","2px")
                    .style("filter", "url(#drop-shadow)");
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('elastic')
                    .attr('transform',function(d){
                        var dist = 1;
                        d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
                        var x = Math.sin(d.midAngle) * dist;
                        var y = Math.cos(d.midAngle) * dist;
                        return 'translate(' + x + ',' + y + ')';
                    });
                var mousePos = d3.mouse(divNode);
                d3.select("#mainTooltip")
                    .style("left", mousePos[0] - 40 + "px")
                    .style("top", mousePos[1] - 40 + "px")
                    .select("#value")
                    .attr("text-anchor", "middle")
                    .html(d.data.name + "<br />" + d.data.count.toLocaleString());

                d3.select("#mainTooltip").classed("hidden", false);
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .attr("stroke","none")
                    .style("filter","none");
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .attr('transform','translate(0,0)');

                d3.select("#mainTooltip").classed("hidden", true);
            });
        svg.append('circle')
            .attr('fill','#42A5F5')
            .attr('r','62');

        svg.append('text')
            .style('fill', '#F2F2F2')
            .style("font-size", "64px")
            .style("font-weight", "bold")
            .attr("transform", "translate(0," + 15 + ")")
            .attr("text-anchor", "middle")
            .html(data.length);

        svg.append("g")
            .attr("class", "labelName");
        svg.append("g")
            .attr("class", "lines");
        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labelName").selectAll("text")
            .data(pie(data), function(d){ return d.data.name });

        text.enter()
            .append("text")
            .attr("dx","-1em")
            .attr("dy", "-.10em")
            .text(function(d) {
                return (d.data.name);
            });

        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text
            .transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .text(function(d) {
                return (d.data.name);
            });
        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), function(d){ return d.data.name });

        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });
    }
    render(){
        return(
                <div className={this.props.class}>
                    <div id={this.props.class}></div>
                    <div id="mainTooltip" className="hidden">
                        <p> <span id="value"> </span></p>
                    </div>
                </div>
        );
    }
}

export default DonutChart;
