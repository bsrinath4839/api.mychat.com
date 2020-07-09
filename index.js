const http = require('http')
const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs')
const app = express()

const { newUser, newTransaction, Login, loaduser, loadusersto } = require('./routes')
const { dburl, port } = require("./config");

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});


//const https = require('https')
// var credentials = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// };
//var httpsserver = https.createServer(credentials, app)
// httpsserver.on('listening', function () {
//     console.log('ok, server is running');
// });
// httpsserver.listen(12354);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var httpserver = http.createServer(app).listen(8080);

httpserver.on('listening', function () {
    console.log('ok, server is running 8080');
});

app.get('/', (req, res) => {

    if (req.headers.authtoken) {
        res.send(req.headers)
    } else {
        res.end("req.headers")
    }

})

app.post('/newuser', async (req, res) => {
    //console.log(req.body);

    await newUser(req.body.name, req.body.mobileno, req.body.email, req.body.password, (err, result) => {
        if (err) {
            res.status(400).send({ 'err': err, 'result': result })
        } else if (result) {
            res.status(200).send({ 'err': err, 'result': result })
        } else {
            res.status(401).send({ 'err': err, 'result': result })
        }
    })
})

app.post('/login', async (req, res) => {
    await Login(req.body.email, req.body.mobileno, req.body.password, (err, result) => {
        if (err) {
            res.status(400).send({ 'err': err, 'result': result })
        } else if (result) {
            res.status(200).send({
                'err': err,
                'result': {
                    "name": result.name,
                    "mobileno": result.mobileno,
                    "email": result.email,
                    "txs": result.txs,
                    'authtoken': result.token
                }
            })
        } else {
            res.status(401).send({ 'err': null, 'result': null })
        }
    })
})

app.post('/newtx', async (req, res) => {
    // console.log(req.body);
    // console.log(req.headers.authtoken);


    if (req.headers.authtoken) {
        await newTransaction(req.headers.authtoken, req.body, (err, result) => {
           // console.log("errrrr",err, "reeesult",result);
            
            if (err) {
                res.status(400).send({ 'err': err, 'result': result })
            } else if (result) {
                res.status(200).send({ 'err': err, 'result': result })
            } else {
                res.status(401).send({ 'err': err, 'result': result })
            }
        })
    } else {
        res.status(400).send({ "err": "NOT AUTHORIZED" })
    }

})

app.post('/loaduser', (req, res) => {
    // console.log(req.body.token);

    if (req.body.token) {
        loaduser(req.body.token, (err, result) => {
            if (err) {
                res.status(400).send({ 'err': err, 'result': result })
            } else if (result) {
                res.status(200).send({
                    'err': err,
                    'result': {
                        "name": result.name,
                        "mobileno": result.mobileno,
                        "email": result.email,
                        "txs": result.txs,
                        'authtoken': result.token
                    }
                })
            } else {
                res.status(404).send({ "err": "No User Found" })
            }
        })
    } else {
        res.status(400).send({ "err": "Credentials Missing" });
    }
})

app.post('/loadusersto', (req, res) => {
    if (req.headers.authtoken) {
        if (req.body.mobileno) {
            loadusersto(req.body.mobileno, req.headers.authtoken, (err, result) => {
                //console.log(err, result);

                if (err) {
                    res.status(400).send({ "err": err })
                } else if (result) {
                    res.status(200).send({
                        "result": {
                            result
                        }
                    })
                } else {
                    res.status(401).send({ "msg": "!!!" })
                }
            })
        } else {
            res.status(400).send({ "err": "Fill All  the Fields" })
        }

    } else {
        res.status(404).send({ "err": "Un Authorized" })
    }


})