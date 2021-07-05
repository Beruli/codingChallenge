const express = require('express')
const https = require('https');
const superagent = require('superagent');

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

exports.inviteUser = function (req, res) {
    var invitationBody = req.body;
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";

    // Check for missing input before triggering superagent.
    if (!shopId) {
        res.status(400).json({error: true, message: 'Missing parameter shopId'});
        return;
    }

    if (!invitationBody.email) {
        res.status(400).json({error: true, message: 'Missing email'});
        return;
    }

    let updateShop = async function (user, invitationId) {
        try {
            const shop = await Shop.findById(shopId).exec();
            if (!shop) {
                res.status(500).send({message: 'No shop found'});
                return;
            }
            if (shop.invitations.indexOf(invitationId) === -1) {
                shop.invitations.push(invitationId);
            }
            if (shop.users.indexOf(user._id) === -1) {
                shop.users.push(user);
            }
            shop.save();
        } catch (error) {
            res.status(500).send(err || {message: 'No shop found'})
        }
    }

    (async () => {
        try {
            const invitationResponse = await superagent.post(authUrl).send(invitationBody);
            let responseBody = invitationResponse.body;
            switch (invitationResponse.status) {
                case 201:
                    User.findOneAndUpdate({authId: responseBody.authId},
                        {authId: responseBody.authId, email: invitationBody.email},
                        {upsert: true, new: true},
                        function (err, createdUser) {
                            updateShop(createdUser, responseBody.invitationId);
                        }
                    );
                    break;
                case 200:
                    res.status(400).json({error: true, message: 'User already invited to this shop'});
                    return;
            }
            res.json(invitationResponse);
        } catch (error) {
            res.status(500).send(error || {message: 'Unkown error'});
        }
    })();
};

