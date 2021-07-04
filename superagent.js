exports
    .inviteUser = function (req, res) {
    var invitationBody = req.body;
    var shopId = req.params.shopId;
    var authUrl = "https://url.to.auth.system.com/invitation";

    superagent.post(authUrl).send(invitationBody).end(
        function (err, invitationResponse) {
            if (invitationResponse.status === 201) {
                User.findOneAndUpdate({authId: invitationResponse.body.authId},
                    {authId: invitationResponse.body.authId, email: invitationBody.email},
                    {upsert: true, new: true},
                    function (err, createdUser) {
                        Shop.findById(shopId).exec(
                            function (err, shop) {
                                if (err || !shop) {
                                    return res.status(500).send(err || {message: 'No shop found'});
                                }
                                if (shop.invitations.indexOf(invitationResponse.body.invitationId)) {
                                    shop.invitations.push(invitationResponse.body.invitationId);
                                }
                                if (shop.users.indexOf(createdUser._id) === -1) {
                                    shop.users.push(createdUser);
                                }
                                shop.save();
                            });
                    }
                );
            } else if (invitationResponse.status === 200) {
                res.status(400).json({error: true, message: 'User already invited to this shop'});
                return;
            }
            res.json(invitationResponse);
        });
};

/*

FindOneAndupdate - only update one email. "createdUser" wrong.

What do you think is wrong with the code, if anything?
Wrong condition in middle if?
Verschachtelte functions()
if else if
parameter.parameter.parameter
use constants for literals, e.g. return codes
Wrong 500? 404?

Can you see any potential problems that could lead to exceptions?
no check on req.body before passing to uperagent.

"new"
parameter.parameter.parameter

How would you refactor this code to:
- Make it easier to read
switch/case
- Increase code reusability
define functions outside, no anonymous
- Improve the stability of the system
param.param.param
- Improve the testability of the code
separate access to Users/Shop. persitence module

- How might you use the latest JavaScript features to refactor the code?
?

Mongoose
findOneAndUpdate
findById

*/

