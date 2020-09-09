import {
  select,
  geoAlbersUsa,
  geoPath,
  zoom,
  event,
  scaleQuantize,
  scaleThreshold,
  schemeBlues,
  max
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';
import { getPopPerCap } from './airtableClient';

const colorScale = scaleQuantize().domain([1, 500]).range(schemeBlues[9])
const svg = select('svg');

const projection = geoAlbersUsa().scale(1100).translate([487.5, 305]);
const pathGenerator = geoPath()

const g = svg.append('g');

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform);
}));
loadAndProcessData(render)

function render(states, jailPopPerCap) {
  console.log(states, jailPopPerCap)
  g.selectAll('path').data(states.features)
  .enter().append('path')
    .attr('class', 'state')
    .attr('d', pathGenerator)
    .attr('fill', (d) => {
      let stateData = jailPopPerCap.filter((r) => r.state == d.properties.name)[0]

      if (stateData) {
        console.log('in state data', jailPopPerCap)
        d.jailPopPerCap = stateData.jailPop
      }

      if(d.jailPopPerCap) { console.log(d.jailPopPerCap) }
      return colorScale(d.jailPopPerCap)
  })
}