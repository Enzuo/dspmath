import * as d3 from "d3"

function renderGraph (svg, data) {
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Init force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-200).distanceMin(10))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", "#aaa")

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(drag(simulation));

  node.append("circle")
    .attr("r", 20)
    .style("fill", function(d) { return d.type === 'building' ? '#00bbff' : '#003333' })

  node.append("title")
    .text(function(d) { return d.id; });

  var defs = node.append("defs")
    .append('clipPath')
    .attr("id",d => d.id.replaceAll(' ', ''))
    .append("rect")
    .attr("x",d => iconC(d).x)
    .attr("y",d => iconC(d).y)
    .attr("width",24)
    .attr("height",24)
  node.append("image")
    .attr("xlink:href", "icons-24.png")
    .attr("transform", d => "translate(" + (-iconC(d).x -12) + "," + (-12 - iconC(d).y) + ")")
    .attr("width", 312)
    .attr("height", 288)
    .attr("clip-path",d => 'url(#'+d.id.replaceAll(' ', '')+')')
    .attr("pointer-events","none")

  // var force = d3.layout.force()
  //   .gravity(0.05)
  //   .distance(100)
  //   .charge(-100)
  //   .size([width, height]);

  // Let's list the force we wanna apply on the network
  // var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
  //     .force("link", d3.forceLink()                               // This force provides links between nodes
  //           .id(function(d) { return d.id; })                     // This provide  the id of a node
  //           .links(data.links)                                    // and this the list of links
  //     )
  //     .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
  //     .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
  //     // .on("end", ticked);
  //     .on("tick", ticked);


  simulation
      .on("tick", ticked)

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      // .attr("cx", function (d) { return d.x+6; })
      // .attr("cy", function(d) { return d.y-6; });
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
  }

}

const drag = simulation => {
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}




function iconC(d){
  var x = d.icon ? (d.icon[0]-1) * 24 : 0
  var y = d.icon ? (d.icon[1]-1) * 24 : 0
  return {x, y}
}

const d3mall = {
  renderGraph
}

export default d3mall
