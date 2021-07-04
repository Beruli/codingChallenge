const express = require('express')
const https = require('https');

// Lookup all albums from Miley Cyrus
const ITUNES_URL = 'https://itunes.apple.com/lookup?id=137057909&entity=album&limit=100';

const codeChallengeServer = express()
const port = 8765


let albums = [];


let transformResponse = function (response) {
    let removeDuplicate = new Set();
    return Array.from(response.results)
        // Filter entries with no album name nor thumbnail
        .filter((item) => {
            return (!!item.collectionName && !!item.artworkUrl100);
        })
        // Filter duplicate album names
        .filter((item) => {
            if (removeDuplicate.has(item.collectionName)) {
                return false;
            } else {
                removeDuplicate.add(item.collectionName);
                return true;
            }
        })
        // Produce result with only necessary entries
        .map((item) => ({
            "name": item.artistName,
            "album": item.collectionName,
            "thumbnail": item.artworkUrl100
        }));
}


https.get(ITUNES_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', (d) => {
        let parsedResults = JSON.parse(data);
        if (data !== '' && parsedResults?.resultCount) {
            albums = transformResponse(parsedResults);
        }

        console.log('Albums transformed: ' + albums.length);
    });

}).on('error', (err) => {
    console.error('Cannot get data from iTune: ' + err);
});


codeChallengeServer.get('/codechallenge', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
    res.send(albums);
});


codeChallengeServer.listen(port, () => {
    console.log(`Code challenge app listening at http://localhost:${port}`)
});


module.exports = {
    transformResponse
}


