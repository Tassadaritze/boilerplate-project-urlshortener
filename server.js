require('dotenv').config();
const dns = require("dns");
const express = require('express');
const cors = require('cors');
const bp = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const urls = [];

app.post("/api/shorturl", bp.urlencoded({ extended: false }), (req, res, done) => {
    console.log(req.body.url);
    let npurl = req.body.url.substring(req.body.url.search(/\/\w/g) + 1);
    console.log(npurl);
    if (npurl.search(/\w\//g) !== -1) npurl = npurl.substring(0, npurl.search(/\w\//g) + 1);
    console.log(npurl);
    dns.lookup(npurl, (err, address) => {
        if (err) res.json({ error: "invalid url" });
    });
    if (!urls.includes(req.body.url)) {
        urls.push(req.body.url);
        res.json({ original_url: req.body.url, short_url: urls.length - 1 });
    }
    done();
});

app.get("/api/shorturl/:url", (req, res) => {
    if (urls.length - 1 >= +req.params.url) res.redirect(urls[+req.params.url]);
    else console.log("no");
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
