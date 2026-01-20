const DatabaseNames = require('./DatabaseNames.js');
const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const port = 8000;
const LIMIT = 10;

const con = new sqlite3.Database('./Data/DBTables/BusStopsDB.sqlite', (err) => {
    if (err) {
        console.error("Could not connect to SQLite file:", err.message);
    } else {
        console.log("Connected to local SQLite file!");
    }
});

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.append("Access-Control-Allow-Credentials", "true");
    res.append("Content-Type", "application/json");
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

//

app.get('/', (req, res) => {
    res.send('Sample page');
});



app.get('/stops', (req, res) => {
    const query = `SELECT * FROM ${DatabaseNames.STOPS} LIMIT ${LIMIT}`;
    SendRequest(query, res);
});

app.get('/stops/region/:rname', (req, res) => {
    const regionName = req.params.rname;
    const query = `SELECT * FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName)){SendRequest(query, res);}
});

app.get('/stops/region/:rname/stop/:sname', (req, res) => {
    const regionName = req.params.rname;
    const stopName = req.params.sname;
    const query = `SELECT * FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}%' AND stop_name like '${stopName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName) && AbsCheck(stopName)){SendRequest(query, res);}
});


app.get('/stops/uniqueregion/region/:rname', (req, res) => {
    const regionName = req.params.rname;
    const query = `SELECT DISTINCT stop_area FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName)){SendRequest(query, res);}
});

app.get('/stops/uniquestop/region/:rname/stop/:sname', (req, res) => {
    const regionName = req.params.rname;
    const stopName = req.params.sname;
    const query = `SELECT DISTINCT stop_name FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}%' AND stop_name like '${stopName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName) && AbsCheck(stopName)){SendRequest(query, res);}
});


app.get('/stops/strict/region/:rname', (req, res) => {
    const regionName = req.params.rname;
    const query = `SELECT * FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName)){SendRequest(query, res);}
});

app.get('/stops/strict/region/:rname/stop/:sname', (req, res) => {
    const regionName = req.params.rname;
    const stopName = req.params.sname;
    const query = `SELECT * FROM ${DatabaseNames.STOPS} WHERE stop_area like '${regionName}' AND stop_name like '${stopName}' LIMIT ${LIMIT}`;
    if (AbsCheck(regionName) && AbsCheck(stopName)){SendRequest(query, res);}
});

app.get('/stops/geoloc/:lon/:lat', (req, res) => {
    const longitude = req.params.lon;
    const latitude = req.params.lat;
    const query = `SELECT * FROM ${DatabaseNames.STOPS} ORDER BY abs( stop_lat - ${latitude} ) + abs( stop_lon - ${longitude} ) LIMIT 1`;
    SendRequest(query, res);
});


app.get('/trips', (req, res) => {
    const query = `SELECT * FROM ${DatabaseNames.TRIPS} LIMIT ${LIMIT}`;
    SendRequest(query, res);
});

app.get('/trips/longname/:longname', (req, res) => {
    const longName = req.params.longname;
    const query = `SELECT * FROM ${DatabaseNames.TRIPS} WHERE trip_long_name like '%${longName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(longName)){SendRequest(query, res);}
});



app.get('/stop_times', (req, res) => {
    const query = `SELECT * FROM ${DatabaseNames.STOP_TIMES} LIMIT ${LIMIT}`;
    SendRequest(query, res);
});

app.get('/stop_times/tripid/:tripid', (req, res) => {
    const tripId = req.params.tripid;
    const query = `SELECT * FROM ${DatabaseNames.STOP_TIMES} WHERE trip_id = ${tripId} LIMIT ${LIMIT}`;
    if (AbsCheck(tripId)){SendRequest(query, res);}
});



app.get('/routes', (req, res) => {
    const query = `SELECT * FROM ${DatabaseNames.ROUTES} LIMIT ${LIMIT}`;
    SendRequest(query, res);
});

app.get('/routes/longname/:longname', (req, res) => {
    const longName = req.params.longname;
    const query = `SELECT * FROM ${DatabaseNames.ROUTES} WHERE route_long_name like '%${longName}%' LIMIT ${LIMIT}`;
    if (AbsCheck(longName)){SendRequest(query, res);}
});

app.get('/routes/nonend/longname/:longname', (req, res) => {
    const longName = req.params.longname;
    const query = `SELECT * FROM ${DatabaseNames.ROUTES} WHERE route_long_name like '%${longName} %' LIMIT ${LIMIT}`;
    if (AbsCheck(longName)){SendRequest(query, res);}
});

//so database wont die
function AbsCheck(str)
{
    return str.match(/[|\\/~^:,;?!&%$@*+'"]/) == null;
}

function SendRequest(sql, res) 
{
    con.all(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
} 

