const express = require('express');
const app = express();

const nodemailer = require('nodemailer');

const hbs = require('hbs');
const path = require("path")

const bcrypt = require('bcrypt')

//using the middle ware to access the database and models
require('./database/databases');
const New_eccomerce_website = require("./database/models/model")

const port = process.env.port || 3000;

//accesing the hsb file in the node js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const static_path = path.join(__dirname, "../public");
const static_patilas = path.join(__dirname, "../templated/views")

//using the middleweat
app.set("view engine", "hbs");
app.set("views", static_patilas);

app.use(express.static(static_path));


app.get('/index', (req, res) => {
    res.render("index")
})

app.get('/chandan', (req, res) => {
    res.render("chandan")
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


app.get('/sign_up', (req, res) => {
    res.render('sign_up')
})

app.get('/sign_in', (req, res) => {
    res.render('sign_in');
})


app.post('/sign-up', async (req, res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirm_password;
        if (password === confirmpassword) {
            const sending_sending = new New_eccomerce_website({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirm_password,
                location: req.body.location,
                contact: req.body.contact,


            })
            const verify_email = await sending_sending.save();
            res.status(200).render('index');
            console.log(sending_email)
        } else {
            res.send("password does not match")
        }



    } catch (error) {
        console.log(error)
    }

})



app.post('/Register', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const checking_email = await New_eccomerce_website.findOne({ email: email });
        const password_checking = await bcrypt.compare(password, checking_email.password)


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



app.listen(port, "127.0.0.1", () => {
    try {
        console.log(`your port has been listened on ${port}`)
    } catch (error) {
        console.log(error + "port has connected fail")
    }
})
