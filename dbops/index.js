const randomstring = require("randomstring");
const crypto = require('crypto');
const { user, tx } = require('../models')
const config = require('../config')//

const populater = [];

const userLogin = async (findOption, cb) => {
    await user.findOne(findOption)
        .populate(populater)
        .exec({}, cb);
}

const createUser = async (findOption, cb) => {
    await userLogin(findOption, (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            cb({ "ERROR": "USER ALREADY EXIST" }, null)
        } else {
            const newUser = new user(findOption)
            newUser.save((err) => {
                if (err) {
                    cb(err, null)
                } else {
                    user.populate(newUser, populater, cb)
                }
            })
        }
    })
}

const getUser = async (token, cb) => {
    await user.findOne(token)
        .populate(populater)
        .exec({}, cb);
}

// const pushAVal = async ({ prevHash }, cb) => {
//     const tcd = new tx({ prevHash })
//     tcd.save((err) => {
//         if (err) {
//             cb(err, null)
//         } else {
//             tx.populate(tcd, populater, cb)
//         }
//     })

// }

const getPrevHash = async ({ }, cb) => {
    await tx.find({})
        .select({ "txhash": 1, "_id": 0 })
        .sort({ _id: -1 }).limit(1)
        .populate(populater)
        .exec({}, cb)
    //console.log(cb);

}

const newTx = async (findOption, cb) => {
    const { token, amount, toid, tomobileno, toname } = findOption;
    await getPrevHash({}, async (err, hashes) => {
        //console.log(err, hashes[0].txhash);
        const prevHash = hashes[0].txhash;
        if (err) {
            cb(err, null)
        } else {
            await getUser({ token }, async (err, users) => {
                if (err) {
                    cb(err, null)
                } else if (users) {
                    let fromid = users._id;
                    let fromname = users.name;
                    let frommobileno = users.mobileno;

                    const rand = randomstring.generate();

                    const txhash = crypto.createHmac('sha256', config.secret)
                        .update(fromid + toid + amount + prevHash + rand)
                        .digest('hex');

                    const newtx = new tx({
                        "from": fromid,
                        "to": toid,
                        "prevHash": prevHash,
                        "rand": rand,
                        "txhash": txhash,
                        "amount": amount,
                        "txat": Date.now()
                    })

                    newtx.save((err) => {
                        if (err) {
                            cb(err, null)
                        } else {
                            tx.populate(newtx, populater, null)
                        }
                    })

                    const usertxfrom = {
                        to: {
                            name: toname,
                            mobileno: tomobileno
                        },
                        txhash: txhash,
                        amount: amount,
                        txat: Date.now()
                    }

                    const usertxto = {
                        from: {
                            name: fromname,
                            mobileno: frommobileno
                        },
                        txhash: txhash,
                        amount: amount,
                        txat: Date.now()
                    }

                    await user.findOneAndUpdate({ "mobileno": tomobileno, "name": toname }, { $push: { "txs": usertxto } }, { new: true })
                        .populate(populater)
                        .exec({});

                    await user.findOneAndUpdate({ token }, { $push: { "txs": usertxfrom } }, { new: true })
                        .populate(populater)
                        .exec({}, cb);

                }
            })
        }
    })
}

const loadUsersTo = async (findOption, cb) => {
    let token = findOption.token;
    // console.log("toke", token);

    await getUser({ token }, async (err, validuser) => {
        if (err) {
            cb(err, null)
        } else if (validuser) {
            await user.find({ "mobileno": { "$regex": findOption.mobileno, "$options": "i" } })
                .select({ "name": 1, "mobileno": 1 })
                .sort({ "name": 1 })
                .limit(10)
                .populate(populater)
                .exec({}, cb)
        } else {
            cb(null, null)
        }
    })
}

module.exports = {
    newTx,
    createUser,
    userLogin,
    getUser,
    loadUsersTo,
}
