import { feature } from 'topojson';
import { tsv, json } from 'd3';

export const loadAndProcessData = (render =>
  json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json')
    .then((topoJSONdata) => {
      const states = feature(topoJSONdata, topoJSONdata.objects.states);

      fetch("https://api.airtable.com/v0/appIo1lqaLGrB5dLz/Table%201?maxRecords=100&view=Grid%20view", {
        headers: new Headers({
          "Authorization": `Bearer keyiUyROsiT6hATuI`
        })
      }).then( response => {
        response.json().then( jailPopPerCap => {
          const populationData = jailPopPerCap.records.map( (r) => {
            return {state: r.fields.State, jailPop: r.fields["Jail Population per capita"]}
          })

          render(states, populationData)
        })
      })

    }))