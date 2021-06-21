import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Tree = ({data}) => {

    const ref = useRef();

    var adjacencyList = {};
    var resourcesList = {};

    function createAdjacencyList() {

        var vcnList = [];
        var edgesList = data.edges;

        if(edgesList != null) {
            edgesList.forEach((edge) => {
                if(edge.source.substring(5,8) === "VCN") vcnList.push(edge.source);
                adjacencyList[edge.source] = edge.target;
            });
        }

        adjacencyList["VCN"] = vcnList;
    }

    function dfs(source) {

        var obj = {};
        obj["id"] = source;

        var resourceChildren = [];
        if(adjacencyList[source] != null) {
            adjacencyList[source].forEach((source) => {
                resourceChildren.push(dfs(source));
            });
        }
        obj["children"] = resourceChildren;
        return obj;
    }

    function updateData(d) {

        var resourceChildren = [];

        if(d.resources != null) {
            if(d.resources[0] != null) {
                d.resources[0].items.forEach((vcn) => {
                    if(resourcesList[vcn]) {
                        resourceChildren.push(resourcesList[vcn]);
                    }
                });
            }
        }

        if(d.children) {
            d.children.forEach(updateData);
        }

        resourceChildren.forEach((child) => {
            d.children.push(child);
        });
    }

    function manipulateData() {

        createAdjacencyList();
        adjacencyList["VCN"].forEach((source) => {
            resourcesList[source] = dfs(source);
        });

        updateData(data.nodes[0]);

        console.log(data);

        return data.nodes;
    }

    useEffect(() => {

        var compartments = manipulateData();

        var margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;



        var svg = d3.select(ref.current)
                    .append("svg")
                    .attr("id","svgcontainer")
                    .classed("svg-content", true)
                    .attr("width", 10000)
                    .attr("height", 10000)
                    .style("background-color","white")
                    .attr("overflow", "scroll")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tree = d3.tree().size([window.innerWidth, window.innerHeight]);

        root = d3.hierarchy(compartments[0], function(d) {
            return d.children;
        });

        root.x0 = window.innerWidth / 2;
        root.y0 = 10;

        root.x = window.innerWidth / 2;
        root.y = 10;

        if(root.children)
            root.children.forEach(collapse);

        update(root);

        function collapse(d) {
            if(d.children) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }

        function click(event, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
            update(d);
        }

        function update(source) {

            var data = tree(root);

            var nodes = data.descendants(),
                links = data.descendants().slice(1);

            nodes.forEach(function(d,i){
                if(i==0)
                {
                    d.x = window.innerWidth / 2;
                    d.x0 = window.innerWidth / 2;
                }
                d.y = d.depth * 100;
            });

            var node = svg.selectAll('g.node')
                          .data(nodes, function(d) {return d.id || (d.id = ++i); });

            var nodeEnter = node.enter().append('g')
                  .attr('class', 'node')
                  .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on('click', click);

            nodeEnter.append('circle')
                  .attr('class', 'node')
                  .attr('r', 1e-6)
                  .style("fill", function(d) {
                      return d._children ? "lightsteelblue" : "black";
                  });

            nodeEnter.append('text')
                  .attr("dy", ".35em")
                  .attr("y", function(d) {
                      return d.children || d._children ? -10 : 10;
                  })
                  .attr("text-anchor", function(d) {
                      return d.children || d._children ? "bottom" : "top";
                  })
                  .text(function(d) { return d.data.id; });

            var nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select('circle.node')
                .attr('r', 5)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "black";
                })
                .attr('cursor', 'pointer');

            nodeUpdate.select("text")
                  .style("fill-opacity", 1);

            var nodeExit = node.exit().transition()
                  .duration(duration)
                  .attr("transform", function(d) {
                      return "translate(" + source.x + "," + source.y + ")";
                  })
                  .remove();

            nodeExit.select('circle')
                .attr('r', 1e-6);

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            var link = svg.selectAll('path.link')
                  .data(links, function(d) { return d.id; });

            var linkEnter = link.enter().insert('path', "g")
                  .attr("class", "link")
                  .attr('d', function(d) {
                     var o = {x: source.x0, y: source.y0}
                     return diagonal(o,o)
                  })
                  .attr("stroke","black");

            var linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                  .duration(duration)
                  .attr('d',function(d) {
                    var o = {x: d.x, y: d.y}
                    var t = {x: d.parent.x, y: d.parent.y}
                    return diagonal(o,t)
                  })
                  .attr("stroke","black");

            var linkExit = link.exit().transition()
                  .duration(duration)
                  .attr('d', function(d) {
                    var o = {x: source.x, y: source.y}
                    return diagonal(o,o)
                  })
                  .remove();



            nodes.forEach(function(d){
                d.x0 = d.x;
                d.y0 = d.y;
              });

            function diagonal(s, d) {

               var path = `M ${s.x} ${s.y}
                        L ${d.x} ${d.y}`

                return path
              }
        }

    }, [data]);

    return (
        <div className="container-data" ref={ref} />
    );
}

export default Tree