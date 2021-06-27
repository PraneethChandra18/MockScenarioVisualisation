import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as flextree from 'd3-flextree';

import CompartmentImage from '../assets/Compartment.svg';
import VCNImage from '../assets/VCN.svg';
import SubnetImage from '../assets/Subnet.svg';
import InstanceImage from '../assets/Instance.svg';
import BlockVolumeImage from '../assets/BlockVolume.svg';
import NICImage from '../assets/NIC.svg';

const Tree2 = ({data}) => {

    const ref = useRef();

    useEffect(() => {

//        const MIN_ZOOM = 0.5;
//        const MAX_ZOOM = 2.0;
//        const ZOOM     = d3.zoom()
//                           .scaleExtent([MIN_ZOOM, MAX_ZOOM])
//                           .on("zoom", zoomed);

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

            var noOfChildren = 0;
            var resourceChildren = [];
            if(adjacencyList[source] != null) {
                adjacencyList[source].forEach((s) => {
                    var o = dfs(s);
                    noOfChildren = noOfChildren + 1;
                    resourceChildren.push(o);
                });
            }
            obj["noOfChildren"] = noOfChildren;
            obj["resourceChildren"] = resourceChildren;
            return obj;
        }

        function updateData(d) {

            d.resourceChildren = [];

            if(d.resources != null) {
                if(d.resources[0] != null) {
                    d.resources[0].items.forEach((vcn) => {
                        if(resourcesList[vcn]) {
                            d.resourceChildren.push(resourcesList[vcn]);
                        }
                    });
                }
            }

            if(d.children) {
                d.children.forEach(updateData);
            }
        }

        function calculateNodesPerLevel(d,depth,obj) {

            if(obj.nodesPerLevel.length >= depth+1) {
                obj.nodesPerLevel[depth] = obj.nodesPerLevel[depth] + 1;
            }
            else {
                obj.nodesPerLevel.push(1);
            }

            if(d.resourceChildren) {
                d.resourceChildren.forEach((child) => {
                    calculateNodesPerLevel(child,depth+1,obj);
                });
            }
        }

        function assignNodeSizes(d) {
            var obj = {nodesPerLevel : []}
            calculateNodesPerLevel(d,0,obj);

            obj.nodesPerLevel = obj.nodesPerLevel.slice(1);

            var maxi = 0;
            obj.nodesPerLevel.forEach((n) => {
                if(n > maxi) {
                    maxi = n;
                }
            });

            if(maxi === 0) {
                d.size = [100,100];
            }
            else {
                d.size = [Math.max(maxi*50,300) ,300]
            }

            if(d.children) {
                d.children.forEach(assignNodeSizes);
            }
        }

        function manipulateData() {

            createAdjacencyList();
            adjacencyList["VCN"].forEach((source) => {
                resourcesList[source] = dfs(source);
            });

            updateData(data.nodes[0]);

            assignNodeSizes(data.nodes[0]);

            return data.nodes;
        }

        var compartments = manipulateData();

        var margin = {top: 20, right: 90, bottom: 30, left: 90};

        var i = 0,
            duration = 750,
            root;

        var div = d3.select(ref.current).append("div")
                             .attr("class", "tooltip")
                             .style("display", "inline")
                             .style("position", "fixed")
                             .style("opacity", 0);

        var svg = d3.select(ref.current)
                    .append("svg")
                    .attr("width", 10000)
                    .attr("height", 10000)
                    .attr("viewBox", "0,0,10000,10000")

        var gCanvas = svg.append("g")
                         .attr("transform", "translate(" + window.innerWidth + "," + margin.top + ")");

        var outerTree = flextree.flextree().spacing((nodeA, nodeB) => nodeA.path(nodeB).length + 100);

        root = outerTree.hierarchy(compartments[0], function(d) {
            return d.children;
        });

        console.log(root);

        root.x0 = window.innerWidth / 2;
        root.y0 = 10;

        collapse(root);

        makeCompartmentsTree(root);

        buildInnerTrees(compartments[0]);

        function collapse(d) {
            if(d.resourceChildren) {
                d._resourceChildren = d.resourceChildren;
                d.children.forEach(collapse);
                d.resourceChildren = null;
            }
        }

        function click(event, d) {
            if (d.resourceChildren) {
                d._resourceChildren = d.resourceChildren;
                d.resourceChildren = null;
              } else {
                d.resourceChildren = d._resourceChildren;
                d._resourceChildren = null;
              }
            makeCompartmentsTree(d);
        }

        function showImage(d) {
            if(d.includes("compartment")) return CompartmentImage;
            else if(d.includes("VCN")) return VCNImage;
            else if(d.includes("subnet")) return SubnetImage;
            else if(d.includes("instance")) return InstanceImage;
            else if(d.includes("blockVolume")) return BlockVolumeImage;
            else return NICImage;
        }

        function makeCompartmentsTree(source) {

            var data = outerTree(root);

            var nodes = data.descendants(),
                links = data.descendants().slice(1);

            nodes.forEach(function(d,i){
                d.x = d.x - 100;
                d.y = d.depth * 400;
            });

            var node = gCanvas.selectAll('g.outerNode')
                          .data(nodes, function(d) {return d.id || (d.id = ++i); });

            var nodeEnter = node.enter().append('g')
                  .attr('class', 'outerNode')
                  .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                  });

            nodeEnter.append("image")
                     .attr("xlink:href", function(d) {
                        return showImage(d.data.id);
                     })
                     .attr("width",20)
                     .attr("height",20)
                  .attr('class', 'node')
                  .attr("x", -60)
                  .attr("y", -10)
                  .on('click', click);

            nodeEnter.append('text')
                  .attr("dy", ".35em")
                  .attr("x", -35)
                  .attr("text-anchor", function(d) {
                      return d.children ? "bottom" : "top";
                  })
                  .text(function(d) { return d.data.id; })
                  .on('click', click);

            var nodeData = nodeEnter.append('g')
                                    .attr("class","nodeData")
                                    .attr("id", function(d) {
                                        return d.data.id;
                                    })
                                    .attr("transform", "translate(-60 15)");

            nodeData.append('rect')
                     .attr("width", function(d) {
                          return d.xSize-30;
                     })
                     .attr("height", function(d) {
                           return d.ySize-30;
                     })
                     .style("fill","white")
                     .style("stroke","black");

            var nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select('image.node')
                .attr('cursor', 'pointer');

            nodeUpdate.select("text")
                  .style("fill-opacity", 1)
                  .attr('cursor', 'pointer');

            var nodeExit = node.exit().transition()
                  .duration(duration)
                  .attr("transform", function(d) {
                      return "translate(" + source.x + "," + source.y + ")";
                  })
                  .remove();

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            var link = gCanvas.selectAll('path.outerLink')
                  .data(links, function(d) { return d.id; });

            var linkEnter = link.enter().insert('path', "g")
                  .attr("class", "outerLink")
                  .attr('d', function(d) {
                     var o = {x: source.x0, y: source.y0}
                     return diagonal(o,o)
                  })
                  .attr("stroke","black");

            var linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                  .duration(duration)
                  .attr('d',function(d) {
                    var o = {x: d.x, y: d.y - 10}
                    var t = {x: d.parent.x, y: d.parent.y + 10}
                    return diagonal(o,t)
                  })
                  .attr("stroke","black");

            link.exit().transition()
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

        function buildInnerTrees(d) {

            var tree = d3.tree().size([d.size[0] - 30, d.size[1] - 30]);

            var innerRoot = d3.hierarchy(d, function(x) {
                return x.resourceChildren;
            });

            var requiredNodeId = "#" + d.id.replaceAll(".", "\\.");
            var frame = d3.select("g.nodeData" + requiredNodeId);

            update(tree, innerRoot, frame);

            if(d.children) {
                d.children.forEach(buildInnerTrees);
            }
        }

        function update(tree, source, frame) {

            var data = tree(source);

            var nodes = data.descendants().slice(1),
                links = data.descendants().slice(1);

            nodes.forEach(function(d,i){
                d.y = d.depth * 50;
            });

            var node = frame.selectAll('g.node')
                          .data(nodes, function(d) {return d.id || (d.id = ++i); });

            var nodeEnter = node.enter().append('g')
                  .attr('class', 'node')
                  .attr("transform", function(d) {
                    return "translate(" + source.x + "," + source.y + ")";
                  })

            nodeEnter.append("image")
                     .attr('class', 'node')
                     .attr("xlink:href", function(d) {
                        return showImage(d.data.id);
                     })
                     .attr("width",20)
                     .attr("height",20)
                     .attr("x", -10)
                     .attr("y", -10)
                     .on("mouseover", function(event,d) {
                        div.transition()
                           .duration(200)
                           .style("opacity", .9);

                        div.html(d.data.id)
                           .style("left", (event.pageX) + "px")
                           .style("top", (event.pageY - 28) + "px");
                     })
                     .on('mouseout', d => {
                       div.transition() .duration(500) .style("opacity", 0);
                     });

//            nodeEnter.append('text')
//                  .attr("dy", ".35em")
//                  .attr("y", function(d) {
//                      return d.children || d._children ? -10 : -10;
//                  })
//                  .attr("text-anchor", function(d) {
//                      return d.children || d._children ? "bottom" : "top";
//                  })
//                  .text(function(d) { return d.data.id; });

            var nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

//            nodeUpdate.select("text")
//                  .style("fill-opacity", 1);

            node.exit().transition()
                      .duration(duration)
                      .attr("transform", function(d) {
                          return "translate(" + source.x + "," + source.y + ")";
                      })
                      .remove();

//            nodeExit.select('text')
//                .style('fill-opacity', 1e-6);

            var link = frame.selectAll('path.link')
                  .data(links, function(d) { return d.id; });

            var linkEnter = link.enter().insert('path', "g")
                  .attr("class", "link")
                  .attr('d', function(d) {
                     var o = {x: source.x, y: source.y}
                     return diagonal(o,o)
                  })
                  .attr("stroke","black");

            var linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                  .duration(duration)
                  .attr('d',function(d) {
                    var o = {x: d.x, y: d.y - 10}
                    var t = {x: d.parent.x, y: d.parent.y + 10}

                    if(d.data.id.includes("VCN")) return diagonal(o,o);
                    return diagonal(o,t)
                  })
                  .attr("stroke","black");

            link.exit().transition()
                  .duration(duration)
                  .attr('d', function(d) {
                    var o = {x: source.x, y: source.y}
                    return diagonal(o,o)
                  })
                  .remove();

            function diagonal(s, d) {

               var path = `M ${s.x} ${s.y}
                        L ${d.x} ${d.y}`

                return path
              }
        }


//        svg.call(ZOOM);

//        function zoomed(event) {
//            const {transform} = event;
//            gCanvas.attr("transform", transform);
//        }

    }, [data]);

    return (
        <div className="container-data" style={{height : window.innerHeight-100, width : window.innerWidth-10, overflow : "scroll"}} ref={ref} />
    );
}

export default Tree2