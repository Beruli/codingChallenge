exports.inviteUser = function (req, res) {
    let invitationBody = req.body;
    let shopId = req.params.shopId;
    let authUrl = "https://url.to.auth.system.com/invitation";

    // Check for missing input before triggering superagent.
    if (!shopId) {
        res.status(400).json({error: true, message: 'Missing parameter shopId'});
        return;
    }

    if (!invitationBody.email) {
        res.status(400).json({error: true, message: 'Missing email'});
        return;
    }

    // Extract inner callback and make it synchronous so we can provide the response back in Express.
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

        // Make supeagent call synchronous so we can provide the response back in Express.
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

