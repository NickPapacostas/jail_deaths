(function (d3, topojson) {
  'use strict';

  var Airtable = require('airtable');

  Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: 'keyiUyROsiT6hATuI'
  });
  var base = Airtable.base('appIo1lqaLGrB5dLz');

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

  var colorScale = d3.scaleQuantize().domain([1, 500]).range(d3.schemeBlues[9]);
  var svg = d3.select('svg');

  var projection = d3.geoAlbersUsa().scale(1100).translate([487.5, 305]);
  var pathGenerator = d3.geoPath();

  var g = svg.append('g');

  svg.call(d3.zoom().on('zoom', function () {
    g.attr('transform', d3.event.transform);
  }));
  loadAndProcessData(render);

  function render(states, jailPopPerCap) {
    console.log(states, jailPopPerCap);
    g.selectAll('path').data(states.features)
    .enter().append('path')
      .attr('class', 'state')
      .attr('d', pathGenerator)
      .attr('fill', function (d) {
        var stateData = jailPopPerCap.filter(function (r) { return r.state == d.properties.name; })[0];

        if (stateData) {
          console.log('in state data', jailPopPerCap);
          d.jailPopPerCap = stateData.jailPop;
        }

        if(d.jailPopPerCap) { console.log(d.jailPopPerCap); }
        return colorScale(d.jailPopPerCap)
    });
  }

}(d3, topojson));
//# sourceMappingURL=bundle.js.map
