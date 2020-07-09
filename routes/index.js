const randomstring = require("randomstring");
const crypto = require('crypto');
const { createUser, userLogin, newTx, getUser, loadUsersTo } = require('../dbops')
const config = require('../config')//

const newUser = async (name, mobileno, email, password, cb) => {
    const rand = randomstring.generate();
    const passwordHash = crypto.createHash('sha256', config.secret)
        .update(password)
        .digest('hex')
    const token = crypto.createHmac('sha256', config.secret)
        .update(name + mobileno + email + passwordHash + rand)
        .digest('hex');

    await createUser({ name, mobileno, email, passwordHash, token }, (err, result) => {
       // console.log(err, result);

        if (err) {
            cb(err, null)
        } else if (result) {
            cb(null, result)
        } else {
            cb(null, null)
        }

    })
}

const Login = async (email, mobileno, password, cb) => {
    const passwordHash = crypto.createHash('sha256', config.secret)
        .update(password)
        .digest('hex')
    await userLogin({ email, mobileno, passwordHash }, (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            cb(null, result)
        } else {
            cb(null, null)
        }
    })
}

const loaduser = async (token, cb) => {

    await getUser({ token }, (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            cb(null, result)
        } else {
            cb(null, null)
        }
    })

}

const loadusersto = async (mobileno, token, cb) => {
    // console.log({ mobileno, token });
    await loadUsersTo({ mobileno, token }, (err, result) => {
        //console.log(err, result);

        if (err) {
            cb(err, null)
        } else if (result) {
            cb(null, result)
        } else {
            cb(null, null)
        }
    })

}

const newTransaction = async (token, body, cb) => {

    const amount = body.amount;
    const toid = body.to._id;
    const tomobileno = body.to.mobileno;
    const toname = body.to.name;

    await newTx({ token, amount, toid, tomobileno, toname }, (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            cb(null, result)
        } else {
            cb(null, null)
        }
    })
}


module.exports = {
    newUser,
    Login,
    newTransaction,
    loaduser,
    loadusersto
}