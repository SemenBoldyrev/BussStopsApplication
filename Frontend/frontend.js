const backend = require("../Backend/Backend.js");

const regionInput = document.getElementById("region-input");
const regionButton = document.getElementById("region-button");
const regionsList = document.getElementById("regions-list");

const busStopInput = document.getElementById("buss-stop-input");
const busStopButton = document.getElementById("buss-stop-button");
const busStopsList = document.getElementById("buss-stops-list");

const busListDiv = document.getElementById("buses-list");
const busTimesDiv = document.getElementById("buses-times-list");

var tRegions = ["Region A", "Region B", "Region C"];
var tBusStops = ["Stop 1", "Stop 2", "Stop 3"];


regionButton.addEventListener("click", () => {
    console.log("Region button clicked");
    const regionName = regionInput.value;
    if (regionName) {
        console.log(`Searching for bus stops in ${regionName}...`);
    }
});

busStopButton.addEventListener("click", () => {
    console.log("Bus stop button clicked");
    const busStopName = busStopInput.value;
    if (busStopName) {
        console.log(`Searching for buses at ${busStopName}...`);
    }
});


regionInput.addEventListener("input", () => {
    console.log("Region input changed: " + regionInput.value);
});

busStopInput.addEventListener("input", () => {
    console.log("Bus stop input changed: " + busStopInput.value);
});