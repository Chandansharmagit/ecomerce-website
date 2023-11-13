const jwt = require("jsonwebtoken");
const Ecommerce = require('../database/models/model')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, "mynameischandansharmaclassnepalsecondaryschool");
        console.log(verifyuser);

        const username = await Ecommerce.findOne({ _id: verifyuser._id });


        console.log(username);
        req.token = token;
        req.user = username;
        next();
    } catch (error) {
        res.status(404).render('loginatfirst')

    }
}

//exporting the auth 
module.exports = auth;