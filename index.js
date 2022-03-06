const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const fs = require('fs');

// Test
app.get('/', async(req, res) => {
    res.status(201).send({
        "Msg": "Working"
    });
});

// Add Transaction
app.post('/addTransaction', async(req, res) => {
    let transactionData = fs.readFileSync('transaction.json');
    let transactionJsonData = JSON.parse(transactionData);
    let tid = 1;

    if (transactionJsonData.data.length)
        tid = transactionJsonData.data[transactionJsonData.data.length - 1].tid + 1;
    let tdate = new Date();
    let tData = req.body;
    tData.tid = tid;
    tData.tdate = tdate;

    transactionJsonData.data.push(tData);
    fs.writeFileSync('transaction.json', JSON.stringify(transactionJsonData));
    res.status(201).send({ "msg": "Transaction Added..." });
});

// Get AllTransaction
app.get('/getTransaction', async(req, res) => {
    let transactionData = fs.readFileSync('transaction.json');
    let transactionJsonData = JSON.parse(transactionData);

    res.status(201).send({ "transData": transactionJsonData.data });
});

// Get Single Transaction
app.get('/getTransaction/:tid', async(req, res) => {
    let tid = req.params.tid;

    let transactionData = fs.readFileSync('transaction.json');
    let transactionJsonData = JSON.parse(transactionData);

    let tidIndex = transactionJsonData.data.findIndex(item => item.tid == tid)
    if (tidIndex >= 0) {
        res.status(201).send({ "data": transactionJsonData.data[tidIndex] });
    } else {
        res.status(501).send({ "msg": "Transaction Id Not Found..." });
    }
});

// Edit Transaction
app.put('/editTransaction/:tid', async(req, res) => {
    let tid = req.params.tid;

    let transactionData = fs.readFileSync('transaction.json');
    let transactionJsonData = JSON.parse(transactionData);

    let tidIndex = transactionJsonData.data.findIndex(item => item.tid == tid)
    if (tidIndex >= 0) {
        let tdate = new Date();
        let tData = req.body;
        tData.tid = parseInt(tid);
        tData.tdate = tdate;

        transactionJsonData.data[tidIndex] = tData;

        fs.writeFileSync('transaction.json', JSON.stringify(transactionJsonData));
        res.status(201).send({ "msg": "Transaction Updated..." });
    } else {
        res.status(501).send({ "msg": "Transaction Id Not Found..." });
    }
});

// Delete Transaction
app.delete('/deleteTransaction/:tid', async(req, res) => {
    let tid = req.params.tid;

    let transactionData = fs.readFileSync('transaction.json');
    let transactionJsonData = JSON.parse(transactionData);

    let tidIndex = transactionJsonData.data.findIndex(item => item.tid == tid)

    if (tidIndex >= 0) {
        transactionJsonData.data = transactionJsonData.data.filter((value) => value.tid != tid);

        fs.writeFileSync('transaction.json', JSON.stringify(transactionJsonData));
        res.status(201).send({ "msg": "Transaction Deleted..." });
    } else {
        res.status(501).send({ "msg": "Transaction Id Not Found..." });
    }
});

app.listen(3000, () => {
    console.log("Listening post 3000");
})