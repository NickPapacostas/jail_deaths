import {
  select,
  geoAlbersUsa,
  geoPath,
  zoom,
  mouse,
  event,
  scaleQuantize,
  scaleThreshold,
  schemeReds,
  max
} from 'd3';

import { legend } from './legend'
import { loadAndProcessData } from './loadAndProcessData';
// import { colorLegend } from './colorLegend';

const colorScale = scaleQuantize().domain([1, 500]).range(schemeReds[9])
const svg = select('svg');
const pathGenerator = geoPath()
const g = svg.append('g');

const zoomBehavior = zoom().scaleExtent([.6,3]).on('zoom', () => {
  g.attr('transform', event.transform);
})

svg.call(zoomBehavior)

const tooltip = select("#map-view").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const choroplethColor = (d, states, data) => {
  let stateData = data.filter((r) => r.state == d.properties.name)[0]

  if (stateData) {
    d.jailPopPerCap = stateData.jailPop
    d.avgDailyPop = stateData.avgDailyPop
    d.mortalityRate = stateData.mortalityRate
  }

  return colorScale(d.jailPopPerCap)
}

const stateClick = (d) => {
  console.log('clicked', d)
}

const stateHTML = (d) => {
  return `
    <div class="state-details">
      <h3 class="w3-opacity">${d.properties.name} </h3>
      <div>
        <h3 class="state-stat">
          Mortaility rate per 100,000:
        </h3>
        ${d.mortalityRate}
      </div>
      <div>
        <h3 class="state-stat">
          Jail Population per 100,000:
        </h3>
        ${d.jailPopPerCap}
      </div>
      <div>
        <h3 class="state-stat">
          Number of people held in jails on an average day:
        </h3>
        ${parseInt(d.avgDailyPop).toLocaleString()}
      </div>
      <div><a class="w3-button button-border" "document.getElementById('more-data-modal').style.display='block'"> More data </a></div>
    </div>
  `
}

function render(states, jailPopPerCap) {
  g.selectAll('path').data(states.features)
  .enter().append('path')
    .attr('class', 'state')
    .attr('d', pathGenerator)
    .attr('fill', (d) => choroplethColor(d, states, jailPopPerCap))
    .on("click", function(d) {
      tooltip.transition()
          .duration(500)
          .style("opacity", .9);
      tooltip.html(stateHTML(d))
    })

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

loadAndProcessData(render)
