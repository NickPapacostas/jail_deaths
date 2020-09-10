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

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform);
}));

const choroplethColor = (d, states, data) => {
  let stateData = data.filter((r) => r.state == d.properties.name)[0]

  if (stateData) {
    d.jailPopPerCap = stateData.jailPop
  }

  return colorScale(d.jailPopPerCap)
}

const stateClick = (d) => {
  console.log('clicked', d)
}

function render(states, jailPopPerCap) {
  g.selectAll('path').data(states.features)
  .enter().append('path')
    .attr('class', 'state')
    .attr('d', pathGenerator)
    .attr('fill', (d) => choroplethColor(d, states, jailPopPerCap))
  .on("click", stateClick)
}

loadAndProcessData(render)