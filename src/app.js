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


//accesing the productjs
const product = require('../src/database/models/product')
const multer = require('multer')


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

app.get('/placeordor', auth, (req, res) => {
    res.render('placeordor');
})

app.get('/shoesdetail', (req, res) => {
    res.render('shoesdetail')
})


//accessing the addtoproducst
const Addtoproduct = require('./database/models/add-category')
//accessing the vendor with the id
const Vendor = require('./database/models/vendor')
//acessing the store id
const Store = require('./database/models/store_id')

//accessing the subcat_id
const Subcat_id = require('./database/models/subcatid')

//making the routes for the products
const products = require('./database/models/product');



//adding to the product for the consumeer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'), function (err, sucess) {
            if (err) {
                throw err;
            }
        })
    },
    filename: function (req, file, cb) {
        const names = Date.now() + '-' + file.originalname;
        cb(null, names, function (error, sucess) {
            if (err) {
                throw err;
            }
        });
    }
})

//for uploading the photo
const upload = multer({ storage: storage });



//making the post method for the 

app.post('/add-products',  async (req, res) => {
    try {
        // var arrimages = [];
        // for (let i = 0; i < req.files.length; i++) {
        //     arrimages[i] = req.files[i].filename;
        // }
        var products = new product({
            vendor_id: req.body.vendor_id,
            vendor: req.body.vendor,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            addcategory: req.body.addcategory,
            subcat: req.body.subcat,
            images: req.body.images,
        })
        const product_data = await products.save()
        res.status(200).send({ sucess: true, msg: "product details", data: product_data })

    } catch (error) {
        console.log(error)
    }
})




//making the api for the add to categpory for the user for of selling of products

app.post('/addtocategory', async (req, res) => {
    try {
        const mans = new Addtoproduct({
            addcategory: req.body.addcategory,
        })

        const menssaving = await mans.save();
        res.status(200).send({ sucess: true, msg: "product details", data: menssaving })

    } catch (error) {
        console.log(error)
    }
})

//for the vendor id

app.post('/vendor_id', async (req, res) => {
    try {
        const newnew = new Vendor({
            vendor_id: req.body.vendor_id,
        })
        const mans = await newnew.save();
        res.status(200).send({ sucess: true, msg: "vendor_id", data: mans })

    } catch (error) {
        console.log(error)
    }
})

//making the store id api with post man

app.post('/store_id', async (req, res) => {
    try {
        const app = new Store({
            vendor: req.body.vendor,
        })
        const apis = await app.save();
        res.status(200).send({ sucess: true, msg: "store_id", data: apis })

    } catch (error) {
        console.log(error)
    }
})


//making the subcat id
app.post('/subcat_id', async (req, res) => {
    try {
        const newman = new Subcat_id({
            subcat: req.body.subcat,
        })
        const news = await newman.save();
        res.status(200).send({ sucess: true, msg: "subcat_id", data: news })

    } catch (error) {
        console.log(error)
    }
})






//sending email to the author for ordor query

const ordornows = async (fname, lname, cn, country, housenumber, town, state, postcode, phone, email, dbt) => {
    const sendingordor = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'utamsharma57@gmail.com',
            pass: 'mpmr osmp sdba joyv'
        }
    })
    const detailsordor = {
        from: email,
        to: 'utamsharma57@gmail.com',
        subject: 'For ordor details..',
        html: `<h3><i>firstname : ${fname} <br><hr> lastname : ${lname} <br><hr> company : ${cn} <br><hr> <br><hr> country : ${country} <br><hr> house number : ${housenumber} <br><hr> town : ${town} <br><hr> state : ${state} <br><hr> postcode : ${postcode} <br><hr> phone : ${phone} <br><hr> email : ${email} <br><hr> money transfer method : ${dbt} </i></h3>`
    }

    sendingordor.sendMail(detailsordor, function (error, info) {
        if (error) {
            res.send("massage sent fail" + error)
        } else {
            res.send("massage has beeen successfully sent to the authoer...")
        }
    })
}

//making the ordor system with backend

app.post('/ordornow', auth, async (req, res) => {
    try {

        //reqesting the data from the form validation

        const fname = req.body.fname;
        const lname = req.body.lname;
        const cn = req.body.cn;
        const country = req.body.country;
        const housenumber = req.body.housenumber;
        const apartment = req.body.apartment;
        const town = req.body.town;
        const state = req.body.state;
        const postcode = req.body.postcode;
        const phone = req.body.phone;
        const email = req.body.email;

        const dbt = req.body.dbt;

        //sending the massage to the user for ordor
        ordornows(req.body.fname, req.body.lname, req.body.cn, req.body.country, req.body.housenumber, req.body.town, req.body.state, req.body.postcode, req.body.phone, req.body.email, req.body.dbt)
        res.send('massage has been successfully sent to the author')



    } catch (error) {
        console.log(error)
    }
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
            res.status(200).send('login sucess now you can access the file go back and click the link again')
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
