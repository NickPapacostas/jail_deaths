var Airtable = require('airtable');

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyiUyROsiT6hATuI'
});
var base = Airtable.base('appIo1lqaLGrB5dLz');


export const getPopPerCap = () => {
  return new Promise( (resolve, reject) => {
    let results = []

    base('Table 1').select({
        view: 'Grid view'
    }).firstPage(function(err, records)
    {    if (err) { console.error(err); return; }
        records.map(function(record) {
            results.push({state: record.get('State'), jailPop: record.get('Jail Population per capita')});
        });
    });
    console.log('results received')
    resolve(results);
  })
}