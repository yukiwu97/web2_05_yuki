const data_url = "https://gist.githubusercontent.com/yukiwu97/ab2ca20406853e073ba1cc50833efe66/raw/7338de15439fc9ce284d218f1c4b9ecf6f0b2167/name_2005-2017.csv";
const startYear = 2005;
const svgWidth = 1200, svgHeight = 600, barPadding = 5;
var yearSet = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
var yearSvg = d3.selectAll(".years").append('svg').attr("width", 1200).attr("height", 50);
var yearCircleGroup = yearSvg.selectAll("year_circle_g").data(yearSet).enter()
    .append("g")
    .attr("transform", function (d, i) {
        var translate = [50 * i, 0];
        return "translate(" + translate + ")";
    })
    .on("click", function (d) {
        yearCircleGroup.selectAll("circle").style("fill", "rgb(215, 247, 217)");
        d3.select(this).select("circle").style("fill", "lightgreen");
        loadPage(d);
    })
    .on("mouseover", function(d) {
        yearCircleGroup.selectAll("text").style("font-size", "11px");
        d3.select(this).select("text").style("font-size", "12px");
    })

yearCircleGroup.append("circle")
    .attr('cx', 50)
    .attr('cy', 20)
    .attr('r', 20)
    .style("fill", 'rgb(215, 247, 217)')

yearCircleGroup.append("text")
    .text(function (d) { return d })
    .style("font-family", 'Krona One')
    .style("font-size", "11px")
    .attr("dy", "2.2em")
    .attr("dx", "2.6em")

loadPage(2005);

function loadPage(year) {
    var barchart = d3.select('.bar-chart');
    barchart.selectAll('svg').remove();
    var barSvg = barchart.append('svg').attr("width", svgWidth).attr("height", svgHeight);

    d3.csv(data_url).then(function (data) {
        var dataM = []
        var dataF = []
        var maxCount = 0;
        data.forEach(element => {
            if (element.year == year) {
                if (element.gender == "Male") {
                    dataM.push(element);
                } else {
                    dataF.push(element);
                }
                // get the max count
                maxCount = Math.max(maxCount, parseInt(element.count, 10));
            }
        });
        console.log("max count=" + maxCount);

        var barWidth = (svgHeight / dataM.length);

        var xScale = d3.scaleLinear()
            .domain([0, maxCount])
            .range([0, svgWidth / 2]);

        var maleBarGroup = barSvg.selectAll("m.bar")
            .data(dataM)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d, i) {
                var translate = [0, barWidth * i];
                return "translate(" + translate + ")";
            });
        maleBarGroup.append("rect")
            .attr("x", svgWidth / 2)
            .attr("height", barWidth - barPadding)
            .attr("width", function (d) {
                return xScale(d.count)
            })
            .attr("fill", "lightblue");

        maleBarGroup.append("text")
            .text(function (d) {
                return d.name;
            })
            .attr("x", function (d) {
                return svgWidth / 2 + 5;
            })
            .style("fill", "white")
            .attr("dy", "1em");

        maleBarGroup.append("text")
            .text(function (d) {
                return d.count;
            })
            .attr("x", function (d) {
                return svgWidth / 2 + xScale(d.count) - 5;
            })
            .style("text-anchor", "end")
            .style("fill", "white")
            .attr("dy", "1em");

        var femaleBarGroup = barSvg.selectAll("f.bar")
            .data(dataF)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d, i) {
                var translate = [0, barWidth * i];
                return "translate(" + translate + ")";
            });

        femaleBarGroup.append("rect")
            .attr("x", function (d) {
                return svgWidth / 2 - xScale(d.count)
            })
            .attr("height", barWidth - barPadding)
            .attr("width", function (d) {
                return xScale(d.count)
            })
            .attr("fill", "pink");

        femaleBarGroup.append("text")
            .text(function (d) {
                return d.name;
            })
            .attr("x", function (d) {
                return svgWidth / 2 - 5;
            })
            .style("text-anchor", "end")
            .style("fill", "white")
            .attr("dy", "1em");

        femaleBarGroup.append("text")
            .text(function (d) {
                return d.count;
            })
            .attr("x", function (d) {
                return svgWidth / 2 - xScale(d.count) + 5;
            })
            .style("fill", "white")
            .attr("dy", "1em");
    })
}

