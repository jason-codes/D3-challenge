// @TODO: YOUR CODE HERE!

// Set svg width and height
var svgWidth = 800;
var svgHeight = 500;

// Set chart margins, width, and height
var margin = {
    top: 50,
    right: 50,
    bottom: 75,
    left: 75
};

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create svg wrapper
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// Append svg group and shift
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Read csv
d3.csv('assets/data/data.csv').then(function(fileData) {
    console.log(fileData);

    // Parse data
    fileData.forEach(function(state) {
        state.poverty = +state.poverty;
        state.healthcare = +state.healthcare;
    });

    // Create scales
    var xScale = d3.scaleLinear()
        //.domain(d3.extent(fileData, d => d.poverty))
        .domain([d3.min(fileData, d => d.poverty - 2), d3.max(fileData, d => d.poverty + 2)])
        .range([0, chartWidth]);
    
    var yScale = d3.scaleLinear()
        //.domain(d3.extent(fileData, d => d.healthcare))
        .domain([d3.min(fileData, d => d.healthcare - 2), d3.max(fileData, d => d.healthcare + 2)])
        .range([chartHeight, 0])
    
    // Create axis functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Create circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(fileData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', '10')
        .attr('fill', 'blue')
        .attr('opacity', '0.60');

    // Create texts "within" (actually layered above) circles
    var textCirclesGroup = chartGroup.selectAll('text')
        .data(fileData)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.poverty))
        .attr('y', d => yScale(d.healthcare))
        .attr('font-size', '9px')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'white')
        .text(d => d.abbr);

    // Initialize and create tooltip
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
            return(`<strong>${d.state}</strong><br>
                In Poverty: <strong>${d.poverty}%</strong><br>
                W/O Healthcare: <strong>${d.healthcare}%</strong>`);
        });
    
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tool tip
    // Also increase circle radius and give border over 500ms interval when mouseover
    circlesGroup.on('mouseover', function(d) {
        toolTip.show(d, this);
        d3.select(this)
            .transition()
            .duration(500)
            .attr('r', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', 3);
    })
        .on('mouseout', function(d) {
            toolTip.hide(d);
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r', 10)
                .attr('stroke', 'none')
                .attr('stroke-width', 'none');
        });

    // Append axes to chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append('g')
        .call(yAxis);

    // Create axes labels
    chartGroup.append('text')
      .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.top})`)
      .attr('class', 'axisText')
      .text('In Poverty (%)');

    chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 30)
    .attr('x', 0 - (chartHeight / 2))
    .attr('class', 'axisText')
    .text('Lacks Healthcare (%)');

});