// Copyright year
const year = new Date().getFullYear();
document.getElementById("currentYear").innerHTML = `© ${year}`;

// Last modified
document.getElementById("lastModified").innerHTML = `Last Modification: ${document.lastModified}`;

// Hamburger
const nav = document.querySelector("nav");
document.getElementById("hamburger").addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Close mobile nav when not mobile view
if (window.matchMedia("(min-width: 768px)").addEventListener("change", e => {
    if (e.matches) {
        nav.classList.remove("active");
    }
}));

// Members
const membersContainer = document.getElementById("membersContainer");
if (membersContainer) { membersContainer.classList.add("grid"); }
const showMembersGrid = document.getElementById("showMembersGrid");
const showMembersList = document.getElementById("showMembersList");

async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error("Error fetching the members:", error);
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("memberCard");
        card.innerHTML = `
        <h2>${member.name}</h2>
        <div class="memberImageAndText">
            <img src="images/${member.image}" width="128" height="128" alt="${member.name}">
            <div class="memberJustText">
                <p><strong>ADDRESS:</strong> ${member.address}</p>
                <p><strong>PHONE:</strong> ${member.phone}</p>
                <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                <p><strong>MEMBERSHIP:</strong> ${getMembershipName(member.membershipLevel)}</p>
                <p><strong>DESCRIPTION:</strong> ${member.description}</p>
            </div>
        </div>
        `;
        membersContainer.appendChild(card);
    });
}

function getMembershipName(level) {
    switch (level) {
        case 1: return "Member";
        case 2: return "Silver";
        case 3: return "Gold";
        default: return "Member";
    }
}

if (showMembersGrid) {
    // Buttons to show a grid or list view for the members
    showMembersGrid.addEventListener('click', () => {
        membersContainer.classList.remove('list');
        membersContainer.classList.add('grid');
    });
}

if (showMembersList) {
    showMembersList.addEventListener('click', () => {
        membersContainer.classList.remove('grid');
        membersContainer.classList.add('list');
    });
}

// Fetch members on page load (Directory)
if (membersContainer) {
    fetchMembers();
}

// Home page spotlight
async function fetchRandomMembersSpotlight() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) { throw new Error("Failed to fetch the spotlight Members") }

        const members = await response.json();
        displayMembersSpotlight(members);
    } catch (error) {
        console.error("Error fetching the spotlight members:", error);
    }
}

const spotlightContainer = document.getElementById("spotlightContainer");

function displayMembersSpotlight(members) {
    // Filter, Randomize, Choose 3
    const randomMembers = members.filter(member => member.membershipLevel === 3 || member.membershipLevel === 2).sort(() => 0.5 - Math.random()).slice(0, 3);

    spotlightContainer.innerHTML = "";

    randomMembers.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("memberSpotlightCard");
        card.innerHTML = `
        <h2>${member.name}</h2>
        <div class="memberImageAndText">
            <img src="images/${member.image}" width="128" height="128" alt="${member.name}">
            <div class="memberJustText">
                <p><strong>ADDRESS:</strong> ${member.address}</p>
                <p><strong>PHONE:</strong> ${member.phone}</p>
                <p><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                <p><strong>MEMBERSHIP:</strong> ${getMembershipName(member.membershipLevel)}</p>
                <p><strong>DESCRIPTION:</strong> ${member.description}</p>
            </div>
        </div>
        `;
        spotlightContainer.appendChild(card);
    });
}

if (spotlightContainer) {
    fetchRandomMembersSpotlight();
}

// Weather
const weatherTemp = document.getElementById("weatherTemp");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDesc = document.getElementById("weatherDesc");
const forecastToday = document.getElementById("forecastToday");
const forecastTomorrow = document.getElementById("forecastTomorrow");
const forecastAfterTomorrow = document.getElementById("forecastAfterTomorrow");

const urlWeather = "https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.63&units=imperial&appid=8245577865eb547262705068c643ebdc";
const urlForecast = "https://api.openweathermap.org/data/2.5/forecast?lat=49.75&lon=6.63&units=imperial&appid=8245577865eb547262705068c643ebdc";

async function apiFetchWeatherAll() {
    try {
        const response = await fetch(urlWeather);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayWeatherResults(data);
        }
        else {
            throw Error(await response.text());
        }
    }
    catch (error) {
        console.log(error);
    }

    try {
        const response = await fetch(urlForecast);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayForecastResults(data);
        }
        else {
            throw Error(await response.text());
        }
    }
    catch (error) {
        console.log(error);
    }
}

apiFetchWeatherAll();

function displayWeatherResults(data) {
    weatherTemp.innerHTML = `${data.main.temp}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    let desc = `${CapitalizeAllWordsSimple(data.weather[0].description)}`;
    weatherIcon.setAttribute("src", iconsrc);
    weatherIcon.setAttribute("alt", desc);
    weatherDesc.textContent = `${desc}`;
}

function displayForecastResults(data) {
    const dailyTemps = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyTemps[date]) dailyTemps[date] = [];
        dailyTemps[date].push(item.main.temp);
    });

    const dates = Object.keys(dailyTemps).slice(0, 3);
    const forecastElements = [forecastToday, forecastTomorrow, forecastAfterTomorrow];
    const labels = ["Today", "Tomorrow", "After Tomorrow"];

    dates.forEach((date, i) => {
        const temps = dailyTemps[date];
        const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
        forecastElements[i].textContent = `${labels[i]}: ${avgTemp}°F`;
    });
}

function CapitalizeAllWordsSimple(str) {
    return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}