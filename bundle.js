(function (d3, topojson) {
  'use strict';

  var loadAndProcessData = (function (render) { return d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json')
      .then(function (topoJSONdata) {
        var states = topojson.feature(topoJSONdata, topoJSONdata.objects.states);

        fetch("https://api.airtable.com/v0/appIo1lqaLGrB5dLz/Table%201?maxRecords=100&view=Grid%20view", {
          headers: new Headers({
            "Authorization": "Bearer keyiUyROsiT6hATuI"
          })
        }).then( function (response) {
          response.json().then( function (jailPopPerCap) {
            var populationData = jailPopPerCap.records.map( function (r) {
              return {
                state: r.fields.State,
                jailPop: r.fields["Jail Population per capita"],
                avgDailyPop: r.fields["Average number of people in jail"],
                mortalityRate: r.fields["Mortality Rate"]
              }
            });

            render(states, populationData);
          });
        });

      }); });

  // import { colorLegend } from './colorLegend';

  var colorScale = d3.scaleQuantize().domain([1, 500]).range(d3.schemeReds[9]);
  var svg = d3.select('svg');
  var pathGenerator = d3.geoPath();
  var g = svg.append('g');

  var zoomBehavior = d3.zoom().scaleExtent([.6,3]).on('zoom', function () {
    g.attr('transform', d3.event.transform);
  });

  svg.call(zoomBehavior);

  var tooltip = d3.select("#map-view").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var choroplethColor = function (d, states, data) {
    var stateData = data.filter(function (r) { return r.state == d.properties.name; })[0];

    if (stateData) {
      d.jailPopPerCap = stateData.jailPop;
      d.avgDailyPop = stateData.avgDailyPop;
      d.mortalityRate = stateData.mortalityRate;
    }

    return colorScale(d.jailPopPerCap)
  };

  var stateHTML = function (d) {
    return ("\n    <div class=\"state-details\">\n      <h3 class=\"w3-opacity\">" + (d.properties.name) + " </h3>\n      <div>\n        <h3 class=\"state-stat\">\n          Mortaility rate per 100,000:\n        </h3>\n        " + (d.mortalityRate) + "\n      </div>\n      <div>\n        <h3 class=\"state-stat\">\n          Jail Population per 100,000:\n        </h3>\n        " + (d.jailPopPerCap) + "\n      </div>\n      <div>\n        <h3 class=\"state-stat\">\n          Number of people held in jails on an average day:\n        </h3>\n        " + (parseInt(d.avgDailyPop).toLocaleString()) + "\n      </div>\n      <div><a class=\"w3-button button-border\" \"document.getElementById('more-data-modal').style.display='block'\"> More data </a></div>\n    </div>\n  ")
  };

  function render(states, jailPopPerCap) {
    g.selectAll('path').data(states.features)
    .enter().append('path')
      .attr('class', 'state')
      .attr('d', pathGenerator)
      .attr('fill', function (d) { return choroplethColor(d, states, jailPopPerCap); })
      .on("click", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", .9);
        tooltip.html(stateHTML(d));
      });

    var marks = [{long: -94.3, lat: 38}];
    svg.append("g")
      .data(marks)
      .enter()
      .append("image")
      .attr('class','mark')
      .attr('width', 20)
      .attr('height', 20)
      .attr("transform", function(d) {return "translate(" + pathGenerator.projection([d.long,d.lat]) + ")";});
  }

  loadAndProcessData(render);

}(d3, topojson));
//# sourceMappingURL=bundle.js.map
