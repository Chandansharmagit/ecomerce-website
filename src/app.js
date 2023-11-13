require('dotenv').config();


const express = require('express');
const app = express();

const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")

const hbs = require('hbs');
const path = require("path")
// const query = require('query-string');

//using the cors value 
const cors = require('cors');
const cookie_parser = require('cookie-parser');

//for uploading files in the github
app.use(cors({
    origin: ["http://localhost:3000/index"]
}))

const bcrypt = require('bcrypt')

const randomstring = require('randomstring')

//using the middle ware to access the database and models
require('./database/databases');
const Ecommerce = require("./database/models/model");
const auth = require('../src/middlewear/auth')


const port = process.env.port || 3000;

//accesing the hsb file in the node js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const static_path = path.join(__dirname, "../public");
const static_patilas = path.join(__dirname, "../templated/views")

//app for the cookieparder
app.use(cookie_parser());

//using the middleweat
app.set("view engine", "hbs");
app.set("views", static_patilas);

app.use(express.static(static_path));


app.get('/index', (req, res) => {
    res.render("index")
})

app.get('/sign_in', (eq, res) => {
    res.render("sign_in")
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/send_email', (req, res) => {
    res.render('send_email')
})


app.get('/view', (req, res) => {
    res.render('view')
})

app.get('/secret', auth, (req, res) => {
    res.render('secret')
})

    /
    app.get('/sign', (req, res) => {
        res.render('sign')
    })

//buy and sellin the goods
app.get('/chandansharma', auth, (req, res) => {
    res.render('chandansharma')
})

app.get('/buytheshoes', auth, (req, res) => {
    res.render('buytheshoes')
})

app.get('/placeordor',auth,(req,res) => {
    res.render('placeordor');
})



app.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.user);

        //for single logout from single devices
        // req.user.tokens = req.user.tokens.filter((currElemet) => {
        //     return currElemet.token !== req.token;
        // })

        //logout from all devices
        req.user.tokens = [];



        res.clearCookie("jwt");
        console.log("logout succesfull...")
        await req.user.save();
        res.render("index");

    } catch (error) {
        res.status(500).send(error)
    }
})

//sending massage to the user

const sending_email = async (name, email, massage) => {
    const send = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'utamsharma57@gmail.com',
            pass: 'mpmr osmp sdba joyv'
        }
    })
    let details = {
        from: email,
        to: 'utamsharma57@gmail.com',
        subject: 'for query massage',
        html: `<h3><i> name : ${name} <br><hr> email : ${email} <br><hr> massage : ${massage} `,
    }
    send.sendMail(details, function (error, info) {
        if (error) {
            console.log(error + " massage sent fail")
        } else {
            console.log("massage has been sent succesfull...to " + email)
        }
    })
}


app.post('/send_massage', async (req, res) => {
    try {
        //accessing the name,emal and lastname of the user
        names = req.body.name;
        email = req.body.email;
        massage = req.body.massage;

        sending_email(req.body.name, req.body.email, req.body.massage);
        res.send("<h1><i>massage has been succesfully sent </i></h1>")

    } catch (error) {
        console.log(error)
    }
})



//creating the databas with the mongodb

app.post('/login_id', async (req, res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            const heyman = new Ecommerce({
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            })

            //accesing the token part

            const token = await heyman.generateAuthToken();
            console.log("this is the token part : " + token)


            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })
            console.log(`this  is the token part ${req.cookies.jwt}`)



            const registration = await heyman.save();
            console.log("the token part is " + registration);



            const saving_data = await heyman.save();
            res.status(200).render('index');
            console.log(saving_data);
        } else {
            res.status(200).send("password not match to confirm password")
        }

    } catch (error) {
        console.log(error)
    }
})

//login at first

app.get('/loginatfirst', (req, res) => {
    res.render('loginatfirst')
})

app.post('/loginatfirst', async (req, res) => {
    //to the users who already have an account

    try {
        var email = req.body.email
        var password = req.body.password

        //checkign the email matched with database or not

        var email_checking = await Ecommerce.findOne({ email: email });
        //checking password with database
        var password_checking = await bcrypt.compare(password, email_checking.password);



        const token = await email_checking.generateAuthToken();
        console.log("the token part is : " + token);


        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (email_checking.password === password) {
            res.status(200).send(req.user)


        } else {
            res.send('please check your password')
        }





    } catch (error) {
        res.status(400).send("please check your email and try again")
        console.log(error)
    }


})






app.post('/sign', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const checking_email = await Ecommerce.findOne({ email: email });
        const password_checking = await bcrypt.compare(password, checking_email.password)



        //generating the token

        const token = await checking_email.generateAuthToken();
        console.log("this is the token part: " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
        })

        if (checking_email.password === password) {
            res.status(200).render('index')
        } else {
            res.send('please check your password')
        }
    } catch (error) {

        res.status(400).send('email not match')
        console.log(error)
    }
})


//creating the forgot password options 

const sending_forgot_email = async (name, email, token) => {
    try {
        const email_sending = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'utamsharma57@gmail.com',
                pass: "mppe uspm dfnl nekk",
            }
        })
        const email_sending_details = {
            from: 'utamsharma57@gmail.com',
            to: email,
            subject: 'Reset your password',
            html: 'hey ' + name + ' please copy the link <a href="http://127.0.0.1:3000/forgotten?token=' + token + ' "> click here  </a> and reset your password '
        }

        email_sending.sendMail(email_sending_details, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("mail has been send", info.response)
            }
        })
    } catch (error) {
        console.log(error)
    }



}


app.post('/send_link', async (req, res) => {
    try {
        const email = req.body.email;
        const forgot = await Ecommerce.findOne({ email: email });

        if (forgot) {
            const randomString = randomstring.generate();
            sending_forgot_email(forgot.name, forgot.email, randomString);
            const data_form = await Ecommerce.updateOne({ email: email }, { $set: { token: randomString } });
            res.status(200).send("<h1><i>Please Check your Inbox of Mail And Reset Your Password</i></h1>")

        } else {
            res.status(200).send("<h1><i>this email does not exist in your database.</i></h1>")
        }

    } catch (error) {
        console.log(error)
    }
})

//for reeseting the password to confirm password





//forgot password token and sending the email to the user
// app.get('/forgotten', async (req, res) => {
//     try {
//         const token = req.query.token;
//         const tokenData = await Ecommerce.findOne({ token: token })
//         if (tokenData) {
//              res.render('forgotten', { user_id: tokenData._id })

//         } else {
//              res.send("<h1><i>this link has been used</i></h1>")

//         }

//     } catch (error) {
//         console.log(error)
//     }

// })


app.post('/forgotpasswordload', async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) {
            const user_data = await Ecommerce.findByIdAndUpdate({ _id: user_id }, { $set: { confirmpassword: confirmpassword, password: password, token: '' } }, { new: true })
            res.render('index');
        } else {
            res.send("your confirmpassword doesnot match to password")
        }



    } catch (error) {
        console.log(error)
    }

})
app.get('/forgotten', async (req, res) => {
    try {
        const token = req.query.token;
        const tokendata = await Ecommerce.findOne({ token: token })


        if (tokendata) {
            res.render('forgotten', { user_id: tokendata._id });

        } else {
            res.send("token not found yet");
        }
    } catch (error) {
        console.log(error);
    }
})





app.listen(port, "127.0.0.1", () => {
    try {
        console.log(`your port has been listened on ${port}`)
    } catch (error) {
        console.log(error + "port has connected fail")
    }
})
