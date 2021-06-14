import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CompartmentData = ({compartments}) => {

    const ref = useRef();

    useEffect(() => {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var svg = d3.select(ref.current)
                    .append("svg")
                    .attr("id","svgcontainer")
                    .classed("svg-content", true)
                    .attr("width",width)
                    .attr("height",height)
                    .style("background-color","grey");

        var node = svg.selectAll('g').data(compartments)
                                     .enter()
                                     .append('g')
                                     .attr("transform", function(d, i) {
                                          return "translate(" + i * 500 + ",0)";
                                     });

        node.append("rect")
            .attr("width",200)
            .attr("height",100)
            .style("fill","white")
            .attr("x",width/2 - 100)
            .attr("y",50);

        node.append("text")
            .attr("x", width/2 - 75)
            .attr("y",100)
            .text(function(d) {
                return d.id;
            });

        node.append("rect")
            .attr("width",200)
            .attr("height",100)
            .style("fill","white")
            .attr("x",20)
            .attr("y",200);

      }, []);

    return (
        <div>
            <div className="container-data" ref={ref} >


            </div>
        </div>
    );
}

export default CompartmentData