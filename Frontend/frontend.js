//const SERVER = "http://localhost:8000";
const SERVER = "https://bussstopsapplication.onrender.com";

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

const locButton = document.getElementById("location-button")

const date = new Date();
const curDate = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
const busIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bus-front-fill\" viewBox=\"0 0 16 16\"><path d=\"M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1\"/></svg>"

//database hate this symbols, so i check for them (may be should  be in backend)
const banSym = ["'",'"']

var tRegions = ["Region A", "Region B", "Region C"];
var tBusStops = ["Stop 1", "Stop 2", "Stop 3"];

var selectedRegion = null;
var selectedBusStop = null;
var stopId = [];
var redactedRegionName = null;

document.addEventListener("DOMContentLoaded", () =>{
});

document.addEventListener("close", () =>{
});


regionButton.addEventListener("click", () => {
    console.log("Region button clicked");
    const regionName = regionInput.value;
    
    RegionExists(regionName).then(exists => {
        if (exists) {
            infoHead.textContent = " ";
            selectedRegion = regionName;
            regionLabel.textContent = " " + regionName;
            console.log(`Searching for bus stops in ${regionName}...`);
            MainVisController(true, true, false);
        } else {
            infoHead.textContent = `Region ${regionName} not found!`;
            MainVisController(true, false, false);
        }
    });
    regionsList.style.display = "none";
    busStopsList.style.display = "none";
});

locButton.addEventListener("click", () => {
    console.log("Trying to find current location...")
    TryFindNearestStops()
});

busStopButton.addEventListener("click", () => {
    console.log("Bus stop button clicked");
    const busStopName = busStopInput.value;
    RedactRegionName(selectedRegion);

    busStopExists(redactedRegionName).then(exists => {
        if (exists) {
            infoHead.textContent = " ";
            selectedBusStop = busStopName;
            busStopLabel.textContent = " " + busStopName;
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
    regionsList.style.display = "none";
    busStopsList.style.display = "none";
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

    const tmpresponse = await fetch(`${SERVER}/stops/strict/region/${selectedRegion}/stop/${selectedBusStop}`);
    const tmpdata = await tmpresponse.json();

    if (tmpdata.length == 0) { return; }

    const tripResponse = await fetch(`${SERVER}/trips/longname/unique/${redactedRegionName}`);
    const tripData = await tripResponse.json();

    if (tripData.length == 0) 
    { 
        const label = document.createElement("label");
        label.style.border = "1px solid #ccc";
        label.style.padding = "10px";
        label.style.width = "125px";
        label.disabled = true;

        label.classList.add("btn", "btn-primary", "mb-3", "pe-none");
        label.ariaDisabled = "true";

        label.innerHTML = `No Busses Found`;
        busTimesDiv.appendChild(label);
        return;
    }

    console.log("Updating bus buttons...");

    var busStopsList = [];
    tmpdata.forEach(stop => {
        busStopsList.push(stop.stop_id);
    });

    stopId = busStopsList;
    console.log(`Identified stop ID: ${stopId}`);
    tripData.forEach(async tripgroup => {
        
        const busRoutesResponse = await fetch(`${SERVER}/routes/rid/${tripgroup.route_id}`);
        const busRoutesData = await busRoutesResponse.json();

        var trip = null;
        stopId.forEach(async stopid => {
            const busTimesResponse = await fetch(`${SERVER}/stop_times/tripid/${tripgroup.trip_id}/stopid/${stopid}`);
            const busTimesData = await busTimesResponse.json();
            console.log(busTimesData.length != 0);
            if (busTimesData.length != 0) 
            { 
                trip = tripgroup;
            }
        });////
        console.log(busRoutesData.length != 0 && trip != null);
        if (busRoutesData.length != 0 && trip != null) 
            { 
                var route = busRoutesData[0];
                CreateBusButton(trip, route);
            }
        
    });
}

async function UpdateBusTimes(tripid)
{

    busTimesDiv.innerHTML = "";

    var data = null;
    stopId.forEach(async stopid => {
        const response = await fetch(`${SERVER}/stop_times/tripid/${tripid}/stopid/${stopid}`);
        const tmpdata = await response.json();
        if (tmpdata.length != 0) 
        { 
            data = tmpdata;
        }
    });

    if (data.length == null) 
    { 
        const label = document.createElement("label");
        label.style.border = "1px solid #ccc";
        label.style.padding = "10px";
        label.style.width = "inherit";
        label.disabled = true;

        label.classList.add("btn", "btn-danger", "mb-3", "pe-none");
        label.ariaDisabled = "true";

        label.innerHTML = `No Bus Times Found`;
        busTimesDiv.appendChild(label);
        return; 
    }

    console.log("Updating bus times...");
    //for confidencce
    busTimesDiv.innerHTML = "";
    data.forEach(stopTime => {
        CreateBusTimesButton(stopTime);
    });
}

function CreateBusButton(trip,route)
{
        const button = document.createElement("button");
        button.onclick = () => {
            console.log(`Bus route ${route.route_short_name} selected`);
            UpdateBusTimes(trip.trip_id);
        }
        button.style.cursor = "pointer";
        button.style.border = "1px solid #ccc";
        button.style.padding = "10px";
        button.style.width = "inherit";
        //button.style.textAlign = "left";

        button.classList.add("btn", "btn-primary", "mb-3");
        console.log("AAAAB");
        button.innerHTML = `${busIcon} ${route.route_short_name}<br>${trip.trip_long_name}`;
        busListDiv.appendChild(button);
}

function CreateBusTimesButton(stopTime)
{
    const label = document.createElement("label");
    label.style.border = "1px solid #ccc";
    label.style.padding = "10px";
    label.style.width = "125px";
    label.disabled = true;
    label.style.width = "inherit";
    //label.style.textAlign = "left";

    label.classList.add("btn", "btn-primary", "mb-3", "pe-none");
    label.ariaDisabled = "true";

    
    if (AisHigherThenBTime(curDate, stopTime.departure_time)) {
        label.innerHTML = `[Tomorrow]<br>Arrival : ${stopTime.arrival_time}<br>Departure : ${stopTime.departure_time}`;
    } else {
        label.innerHTML = `[Today]<br>Arrival : ${stopTime.arrival_time}<br>Departure : ${stopTime.departure_time}`;
    }
    
    busTimesDiv.appendChild(label);
}

function AisHigherThenBTime(a, b)
{
    console.log(`Comparing times ${a} and ${b}`);
    const aParts = Number(a.split(":").join("")); 
    const bParts = Number(b.split(":").join(""));
    return aParts > bParts

}

async function TryFindNearestStops()
{
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition( (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            AutoFind(lon, lat)
            console.log(`Latitude: ${lat}, longitude: ${lon}`);
        },

        (error) => {
        infoHead.textContent = "Failed to indentify location"
        console.error("Error getting user location:", error);
    }
  );
    } else {
    infoHead.textContent = "Geolocation is not supported by this browser."
    console.error("Geolocation is not supported by this browser.");
    }
}

async function AutoFind(lon, lat)
{
    const response = await fetch(`${SERVER}/stops/geoloc/${lon}/${lat}`);
    const data = await response.json();

    if (data.length == 0)
    {
        infoHead.textContent = "Failed to indentify location"
        return;
    }

    regionsList.style.display = "none";
    busStopsList.style.display = "none";

    regionInput.value = data[0].stop_area;
    busStopInput.value = data[0].stop_name;

    selectedRegion = data[0].stop_area;
    selectedBusStop = data[0].stop_name;

    regionLabel.textContent = " " + data[0].stop_area;
    busStopLabel.textContent = " " + data[0].stop_name;

    UpdateBusButton()

    MainVisController(true,true,true)
}

function RedactRegionName(name)
{
    var namelst = name.split(" ");
    redactedRegionName = namelst[0];
}