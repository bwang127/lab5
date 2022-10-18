let coffee_data;

async function loadData(d){
    let data = await d3.csv(d, d3.autoType);
    return data;
}

async function main(){
    const url = "coffee-house-chains.csv";
    coffee_data = await loadData(url)
    coffee_data.sort(function(a,b){
      return parseInt(b.stores) - parseInt(a.stores);
    });

    var margin = {top: 20, right: 10, bottom: 20, left: 45};
    const width = 650 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;
    const svg = d3.select(".bar-chart")
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const company = [];
    const stores = [];
    const revenue = [];
    coffee_data.forEach(a => company.push(a.company));
    coffee_data.forEach(a => stores.push(a.stores));
    coffee_data.forEach(a => revenue.push(a.revenue));
    
    let storeRange = d3.extent(stores);
    let revRange = d3.extent(revenue);
    let xScale = d3.scaleBand()
                .domain(company)
                .rangeRound([0, width])

    let yScale = d3.scaleLinear()
                .domain([storeRange[1], 0])
                .range([0, height]);

    let xAxis = d3.axisBottom()
	      .scale(xScale);

    let yAxis = d3.axisLeft()
	      .scale(yScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(0, ${width}`)
        .call(yAxis);

  
    let title = svg.append("text")
        .attr("class", "y-axis-title")
        .attr('x', -15)
        .attr('y', -5)
        .text("Stores")

    let type = "stores";
    let sort = "desc";
    let num = 0;
    
    let bars = svg.selectAll("barChart")
                    .data(coffee_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("y", d => yScale(d.stores))
                    .attr("x", function(d, i){
                        return(i * xScale.bandwidth() + 0.5);
                    })
                    .attr("width", xScale.bandwidth() - 7)
                    .attr("height", d => height - yScale(d.stores))
                    .attr("fill", "rgb(88, 142, 192)")

    //UPDATE DATA AND APPEND CHART
    document.getElementById('group-by').onchange = function(){
        type = document.querySelector("option:checked").value;
        update(coffee_data, type, sort);
    };

    //SORT VALUE
    d3.select("#sort").on('click', () => {
        num += 1;
        if (num % 2 == 0){
            sort = "desc";
        }
        else{
            sort = "asc";
        }
        update(coffee_data, type, sort);
    })


    function update(coffee_data, type, sort){
        //UPDATE SCALES
        if (sort == "asc"){
            if (type == "stores"){
                coffee_data.sort(function(a, b){
                return parseInt(a.stores) - parseInt(b.stores);
                });
            }
            else{
                coffee_data.sort(function(a, b){
                    return parseFloat(a.revenue) - parseFloat(b.revenue);
                });
            }
            
        }
        else{
            if (type == "stores"){
                coffee_data.sort(function(a, b){
                    return parseInt(b.stores) - parseInt(a.stores);
                });
            }
            else{
                coffee_data.sort(function(a, b){
                    return parseFloat(b.revenue) - parseFloat(a.revenue);
                });
            }
            
            
        }

        xScale.domain(coffee_data.map(d=>d.company));

        storeRange = d3.extent(stores);
        revRange = d3.extent(revenue);

        if (type == "stores"){
            yScale.domain([storeRange[1], 0])
            const t = "Stores"
        }
        else{
            yScale.domain([revRange[1], 0])                        
            const t = "Billion USD"
        }

        console.log(xScale.domain());

        bars.data(coffee_data)
              .attr("class", "bar")
            //.attr("y", d => yScale(d.type))
              .transition()
              .duration(1000)
              .attr("y", function(d){
                 if (type == "stores")
                      return yScale(d.stores);
                  else    
                      return yScale(d.revenue);
                })
              .attr("x", function(d, i){
                  return(i * xScale.bandwidth() + 0.5);
                })
              .attr("width", xScale.bandwidth() - 7)
              .attr("height", function(d){
                  if (type == "stores"){
                      return height - yScale(d.stores);
                  }
                  else{
                      return height - yScale(d.revenue);
                  }
              })
              .attr("fill", "rgb(88, 142, 192)")

          bars.exit().remove();

          title.transition()
                    .duration(1000)
                    .text(t)
        
          xAxis = d3.axisBottom(xScale);
                
          yAxis = d3.axisLeft(yScale);
                  
          svg.select(".x-axis").transition()
                  .duration(1000).call(xAxis);
                    

          svg.select(".y-axis").transition()
                  .duration(1000).call(yAxis);
            
    }   
}

main();
  
  