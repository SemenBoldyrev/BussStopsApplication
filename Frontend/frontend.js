const SERVER = "http://localhost:8000";

const firstContainer = document.getElementById("region");
const secondContainer = document.getElementById("bus-stop");
const thirdContainer = document.getElementById("buses");

const regionInput = document.getElementById("region-input");
const regionButton = document.getElementById("region-button");
const regionsList = document.getElementById("region-list");

const busStopInput = document.getElementById("buss-stop-input");
const busStopButton = document.getElementById("buss-stop-button");
const busStopsList = document.getElementById("buss-stop-list");

const busListDiv = document.getElementById("buses-list");
const busTimesDiv = document.getElementById("buses-times-list");

const regionLabel = document.getElementById("selected-region");
const busStopLabel = document.getElementById("selected-bus-stop");

const clearButton = document.getElementById("clear-button");
const infoHead = document.getElementById("infoHead");

var tRegions = ["Region A", "Region B", "Region C"];
var tBusStops = ["Stop 1", "Stop 2", "Stop 3"];

var selectedRegion = null;
var selectedBusStop = null;


regionButton.addEventListener("click", () => {
    console.log("Region button clicked");
    const regionName = regionInput.value;
    
    RegionExists(regionName).then(exists => {
        if (exists) {
            infoHead.textContent = " ";
            selectedRegion = regionName;
            regionLabel.textContent = regionName;
            console.log(`Searching for bus stops in ${regionName}...`);
            MainVisController(true, true, false);
        } else {
            infoHead.textContent = `Region ${regionName} not found!`;
            MainVisController(true, false, false);
        }
    });
});

busStopButton.addEventListener("click", () => {
    console.log("Bus stop button clicked");
    const busStopName = busStopInput.value;

    busStopExists(busStopName).then(exists => {
        if (exists) {
            infoHead.textContent = " ";
            selectedBusStop = busStopName;
            busStopLabel.textContent = busStopName;
            console.log(`Searching for buses at ${busStopName}...`);
            thirdContainer.style.display = "block";
            //
            UpdateBusButton();
            //
            MainVisController(true, true, true);
        } else {
            infoHead.textContent = `Bus stop ${busStopName} not found in region ${selectedRegion}!`;
            MainVisController(true, true, false);
        }
    });
});


regionInput.addEventListener("input", () => {
    console.log("Region input changed: " + regionInput.value);
    UpdateRegionDropdown(regionInput.value);
});

regionInput.onfocus = () => {
    regionsList.style.display = "block";
};


busStopInput.addEventListener("input", () => {
    console.log("Bus stop input changed: " + busStopInput.value);
    UpdateStopsDropdown(selectedRegion, busStopInput.value);
});

clearButton.addEventListener("click", () => {
    console.log("Clear button clicked");
    infoHead.textContent = " ";
    MainVisController(false, false, false);
    MainVisController(true, false, false);
});

async function UpdateRegionDropdown(regionName)
{
    regionsList.style.display = "block";

    if (regionName.length == 0)
    {
        regionsList.style.display = "none";
        return;
    }

    const response = await fetch(`${SERVER}/stops/uniqueregion/region/${regionName}`);
    const data = await response.json();

    regionsList.innerHTML = "";

    if (data.length == 0) 
    {
        regionsList.style.display = "none";
        return;
    }

    data.forEach(region => {
        const option = document.createElement("option");
        option.onclick = () => {
            regionInput.value = region.stop_area;
            regionsList.style.display = "none";
        }
        option.value = region.stop_area;
        option.textContent = region.stop_area;
        regionsList.appendChild(option);
    });
}

async function UpdateStopsDropdown(regionName, stopName)
{
    busStopsList.style.display = "block";
    
    if (stopName.length == 0)
    {
        busStopsList.style.display = "none";
        return;
    }

    const response = await fetch(`${SERVER}/stops/uniquestop/region/${regionName}/stop/${stopName}`);
    const data = await response.json();

    busStopsList.innerHTML = "";

    if (data.length == 0) 
    {
        busStopsList.style.display = "none";
        return;
    }

    data.forEach(stop => {
        const option = document.createElement("option");
        option.onclick = () => {
            busStopInput.value = stop.stop_name;
            busStopsList.style.display = "none";
        }
        option.value = stop.stop_name;
        option.textContent = stop.stop_name;
        busStopsList.appendChild(option);
    });
}

async function RegionExists(regionName)
{
    if (!regionName)
    {
        return false;
    }
    try 
    {
        const response = await fetch(`${SERVER}/stops/strict/region/${regionName}`);
        const data = await response.json();

        if (data.length == 0)
        {
            return false;
        }
        return true;
    }
    catch (error)
    {
        console.error("Error checking region existence:", error);
        return false;
    }
}

async function busStopExists(busStopName)
{
    if (!busStopName || !selectedRegion)
    {
        return false;
    }
    try
    {
        const response = await fetch(`${SERVER}/stops/strict/region/${selectedRegion}/stop/${busStopName}`);
        const data = await response.json();

        if (data.length == 0)
        {
            return false;
        }
        return true;
    }
    catch (error)
    {
        console.error("Error checking bus stop existence:", error);
        return false;
    }
}

function MainVisController(a,b,c)
{
    if(a)
    {
        firstContainer.style.display = "block";
    } else
    {
        firstContainer.style.display = "none";
        regionInput.value = "";
    }
    if(b)
    {
        secondContainer.style.display = "block";
    } else
    {
        secondContainer.style.display = "none";
        busStopInput.value = "";
    }
    if(c)
    {
        thirdContainer.style.display = "block";
    } else
    {
        thirdContainer.style.display = "none";
        busListDiv.innerHTML = "";
        busTimesDiv.innerHTML = "";
    }
}

async function UpdateBusButton()
{
    busListDiv.innerHTML = "";
    busTimesDiv.innerHTML = "";
    if (!selectedRegion || !selectedBusStop) { return; }

    const response = await fetch(`${SERVER}/routes/nonend/longname/${selectedBusStop}`);
    const data = await response.json();
    if (data.length == 0) 
    { 
        const option = document.createElement("option");
        option.style.cursor = "pointer";
        option.style.border = "1px solid #ccc";
        option.style.padding = "10px";
        option.textContent = `No Buses Found`;
        busListDiv.appendChild(option);
        return; 
    }

    console.log("Updating bus buttons...");

    data.forEach(route => {
        CreateBusButton(route);
    });
}

async function UpdateBusTimes(routeLongName)
{

    busTimesDiv.innerHTML = "";
    const tmpresponse = await fetch(`${SERVER}/trips/longname/${routeLongName}`);
    const tmpdata = await tmpresponse.json();

    if (tmpdata.length == 0) { return; }

    const response = await fetch(`${SERVER}/stop_times/tripid/${tmpdata[0].trip_id}`);
    const data = await response.json();

    if (data.length == 0) 
        { 
        const option = document.createElement("option");
        option.style.border = "1px solid #ccc";
        option.style.padding = "10px";
        option.textContent = `No Times Found`;
        busTimesDiv.appendChild(option);
        return; 
    }

    console.log("Updating bus times...");

    data.forEach(trip => {
        CreateBusTimesButton(trip);
    });
}

function CreateBusButton(route)
{
        const option = document.createElement("option");
        option.onclick = () => {
            busTimesDiv.innerHTML = "";
            console.log(`Bus route ${route.route_short_name} selected`);
            UpdateBusTimes(route.route_long_name);
        }
        option.style.cursor = "pointer";
        option.style.border = "1px solid #ccc";
        option.style.padding = "10px";
        option.textContent = `Bus: ${route.route_short_name}`;
        busListDiv.appendChild(option);
}

function CreateBusTimesButton(stopTime)
{
    const option = document.createElement("option");
    option.style.border = "1px solid #ccc";
    option.style.padding = "10px";
    option.textContent = `Arrival time: ${stopTime.arrival_time}`;
    busTimesDiv.appendChild(option);
}