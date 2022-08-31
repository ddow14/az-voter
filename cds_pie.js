// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#pie")
  .append("svg")
    .attr("height", 450)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0,-3])
    .direction("e")
    .html(function(d) {
        return  "<p>Partisan Imbalance: " + "<span style='color:red background:yellow'>" + formatRound(d.data.value.Republicans/d.data.value.Democrats) + "</span></p>"
        +"<p>Republicans: " + "<span style='color:blue'>" + formatComma(d.data.value.Republicans)+"</span> </p>"
        +"<p>Democrats: " + "<span style='color:blue'>" + formatComma(d.data.value.Democrats)+"</span> </p>"
        +"<p>Independents: " + "<span style='color:purple'>" + formatComma(d.data.value.Independents)+"</span> </p>"
        +"<p>Greens: " + "<span style='color:green'>" +formatComma(d.data.value.Greens)+"</span> </p>"
        +"<p>Libertarians: " + "<span style='color:pink'>" +formatComma(d.data.value.Libertarian)+"</span> </p>"
        ;
    })

svg.call(tip);

var formatComma = d3.format(",");
var formatRound = d3.format(".1f")

//Radius and the arc
const arcPath = d3.arc()
                .outerRadius(radius)
                .innerRadius(0)

d3.csv("cds.csv").then(function(data) {
// set the color scale

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(["red", "white", "blue", "yellow", "purple", "green", "pink", "grey", "orange"])
  


// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value.Republicans/d.value.Democrats })
  
var data_ready = pie(d3.entries(data))

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)
svg
  .selectAll('Slices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.3)
  .on("mouseover", tip.show)
  .on("mouseout",  tip.hide)
  .transition()
  .duration(2000)
  .attrTween("d", arcAnimation)
  // Now add the annotation. Use the centroid method to get the best coordinates
svg
.selectAll('Slices')
.data(data_ready)
.enter()
.append('text')
.text(function(d){
        if(d.data.value.congressional_district<10){
                 return "CD :"  + d.data.value.congressional_district
    }}
    )
.attr("transform", (d)  => "translate(" + arcGenerator.centroid(d) + ")")
.style("text-anchor", "middle")
.style("font-size", 17)




})

//Tween Animation
const arcAnimation = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t) {
        d.startAngle = i(t);

        return arcPath(d);
    }
}

// A function that finishes to draw the chart for a specific device size.
function drawChart() {

  // get the current width of the div where the chart appear, and attribute it to Svg
  currentWidth = parseInt(d3.select('#pie').style('width'), 10)
  Svg.attr("width", currentWidth)

  // Update the X scale and Axis (here the 20 is just to have a bit of margin)
  x.range([ 20, currentWidth-20 ]);
  xAxis.call(d3.axisBottom(x))

  // Add the last information needed for the circles: their X position
  myCircles
    .attr("cx", function(d){ return x(d)})
  }

// Initialize the chart
drawChart()

// Add an event listener that run the function when dimension change
window.addEventListener('resize', drawChart );
