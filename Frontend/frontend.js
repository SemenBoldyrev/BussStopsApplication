const regionInput = document.getElementById("region-input");
const regionButton = document.getElementById("region-button");

const busStopInput = document.getElementById("buss-stop-input");
const busStopButton = document.getElementById("buss-stop-button");

const busListDiv = document.getElementById("buses-list");
const busTimesDiv = document.getElementById("buses-times-list");

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

