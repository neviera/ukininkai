d3.json('./data/output_data.json').then(function(articles) {
    // Set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 60, left: 60}, // Increased bottom margin for labels
        width = 1800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Select the tooltip div and define its behavior
    const tooltip = d3.select("#tooltip");

    // Place for storing article info
    const articleTxtDiv = d3.select('#article_txt');

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates and sort the articles by date
    articles.forEach(function(d) {
        d.date = new Date(d.date);
    });
    articles.sort((a, b) => a.date - b.date);

    // Set up X axis
    const x = d3.scaleTime()
        .domain(d3.extent(articles, d => d.date))
        .range([0, width]);

    // Append X axis and customize to only show labels, hiding the axis line and ticks
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call(g => g.select(".domain").remove()) // Remove axis line
        .call(g => g.selectAll("line").remove()) // Remove ticks
        .selectAll("text")
            .attr("y", 0)
            .attr("x", -15)
            .attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");
    
    // After setting up the axis, manually add the first and last labels
    // Assuming the first and last articles correspond to the first and last columns
    const firstArticleDate = articles[0].date; // First article date
    const lastArticleDate = articles[articles.length - 1].date; // Last article date

    // Append label for the first column
    svg.append("text")
        .attr("transform", `translate(${x(firstArticleDate)},${height + 20}) rotate(-90)`) // Adjust y position as needed
        .attr("x", -15)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // Align the text to start
        .style("font-size", "11px") // Set font size
        .text(d3.timeFormat("%b %d")(firstArticleDate));

    // Append label for the last column
    svg.append("text")
        .attr("transform", `translate(${x(lastArticleDate)},${height + 20}) rotate(-90)`) // Adjust y position as needed
        .attr("x", -15)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // Align the text to start
        .style("font-size", "11px") // Set font size
        .text(d3.timeFormat("%b %d")(lastArticleDate));

    // Set up Y axis but do not display it
    const maxY = d3.max(articles, function(d) { return d.y_value; });
    const y = d3.scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);

    // Calculate the maximum count of distinct dates
    const maxDateCount = d3.rollup(articles, v => v.length, d => d.date).size;

    // Calculate the dynamic stroke width based on the maximum count of distinct dates
    const lineWidth = Math.max(10, 0.9 * width / (maxDateCount-1));

    // Draw lines for each article
    articles.forEach((article) => {
        const line = svg.append("line")
            .attr("x1", x(article.date))
            .attr("x2", x(article.date))
            .attr("y1", y(article.y_value))
            .attr("y2", y(article.y_value) + 10)
            .attr("stroke", "royalblue")
            .attr("stroke-width", lineWidth)
            .datum(article);

        line.on("mouseover", function(event) {
            const d = d3.select(event.currentTarget).datum();
            tooltip.style("display", "block")
                .html(`Title: ${d.title}<br>Date: ${d3.timeFormat("%B %d, %Y")(d.date)}`);
            d3.select(event.currentTarget).attr("stroke", "orange");
            articleTxtDiv.html(d.article)
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function(event) {
            tooltip.style("display", "none");
            d3.select(event.currentTarget).attr("stroke", "royalblue");
        });
        line.on("click", function(event) {
            const d = d3.select(event.currentTarget).datum();
            const link = document.createElement("a");
            link.href = d.link;
            link.target = "_blank";
        
            const clickEvent = new MouseEvent("click", {
                bubbles: true,
                ctrlKey: true,  // Simulate Ctrl key pressed
                metaKey: true   // Simulate Command key pressed (for macOS)
            });
        
            link.dispatchEvent(clickEvent);
        });
   
        
    });
});
