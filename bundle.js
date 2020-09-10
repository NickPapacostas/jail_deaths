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
              return {state: r.fields.State, jailPop: r.fields["Jail Population per capita"]}
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

  svg.call(d3.zoom().on('zoom', function () {
    g.attr('transform', d3.event.transform);
  }));

  loadAndProcessData(render);

  var choroplethColor = function (d, states, data) {
    var stateData = data.filter(function (r) { return r.state == d.properties.name; })[0];

    if (stateData) {
      d.jailPopPerCap = stateData.jailPop;
    }

    return colorScale(d.jailPopPerCap)
  };


  function render(states, jailPopPerCap) {
    g.selectAll('path').data(states.features)
    .enter().append('path')
      .attr('class', 'state')
      .attr('d', pathGenerator)
      .attr('fill', function (d) { return choroplethColor(d, states, jailPopPerCap); });
  }

}(d3, topojson));
//# sourceMappingURL=bundle.js.map
