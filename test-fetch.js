const https = require('https');

https.get('https://api.pokemontcg.io/v2/cards?pageSize=1', (res) => {
    console.log('Status Code:', res.statusCode);
    res.on('data', d => process.stdout.write(d));
}).on('error', (e) => {
    console.error('Error:', e);
});
