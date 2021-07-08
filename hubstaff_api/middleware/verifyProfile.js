
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    if (authorizationHeader) {
        const access_token = authorizationHeader.split('Bearer ')[1];
        const decoded = jwt.verify(access_token, process.env.PRIVATE_KEY_FOR_JWT);
   // I'll have to finnish this part, this variant is not safe 
        console.log(decoded.id);
        if (!decoded.id) {
            res.status(404).send({
                message: 'Profile not found'
            });
            return;
        }
        next();

    } else {
        res.status(404).send({
            message: 'Profile not found'
        });
        return;
    };

    
    // const user = await User.findByPk(decoded.id).catch((err) => {
    //     res.status(400).send({
    //         message: 'bad request'
    //     })
    // }
    // )

}