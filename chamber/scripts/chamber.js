// Imported things
import { places } from "../data/discover.mjs";


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
const mq = window.matchMedia("(min-width: 768px)");
mq.addEventListener("change", e => { if (e.matches) nav.classList.remove("active"); });

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
            //console.log(data);
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
            //console.log(data);
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

// Form timestamp
document.addEventListener("DOMContentLoaded", () => {
    const formTimestamp = document.getElementById("formTimestamp");
    if (formTimestamp) {
        formTimestamp.value = new Date().toLocaleString();
    }
});

// Form Thank you page
const formParams = new URLSearchParams(window.location.search);

const formFirstName = document.getElementById("submittedFirstName")
if (formFirstName) { formFirstName.textContent = formParams.get("firstName"); }

const formLastName = document.getElementById("submittedLastName")
if (formLastName) { formLastName.textContent = formParams.get("lastName"); }

const formEmail = document.getElementById("submittedEmail")
if (formEmail) { formEmail.textContent = formParams.get("email"); }

const formPhoneNumber = document.getElementById("submittedPhoneNumber")
if (formPhoneNumber) { formPhoneNumber.textContent = formParams.get("phoneNumber"); }

const formOrgName = document.getElementById("submittedOrgName")
if (formOrgName) { formOrgName.textContent = formParams.get("orgName"); }

const formTimestampSubmit = document.getElementById("submittedTimestamp")
if (formTimestampSubmit) { formTimestampSubmit.textContent = formParams.get("timestamp"); }

// Modals - Join page
const membershipModal1 = document.getElementById("membershipModal1");
const membershipModal2 = document.getElementById("membershipModal2");
const membershipModal3 = document.getElementById("membershipModal3");
const membershipModal4 = document.getElementById("membershipModal4");
const closeModalButton1 = document.getElementById("closeModal1");
const closeModalButton2 = document.getElementById("closeModal2");
const closeModalButton3 = document.getElementById("closeModal3");
const closeModalButton4 = document.getElementById("closeModal4");
const npModalButton = document.getElementById("openModalNP");
const bronzeModalButton = document.getElementById("openModalBronze");
const silverModalButton = document.getElementById("openModalSilver");
const goldModalButton = document.getElementById("openModalGold");

if (membershipModal1) {
    // Opening Modal
    npModalButton.addEventListener("click", () => {
        membershipModal1.showModal();
    });

    bronzeModalButton.addEventListener("click", () => {
        membershipModal2.showModal();
    });

    silverModalButton.addEventListener("click", () => {
        membershipModal3.showModal();
    });

    goldModalButton.addEventListener("click", () => {
        membershipModal4.showModal();
    });

    // Closing Modal
    closeModalButton1.addEventListener("click", () => {
        membershipModal1.close();
    });

    closeModalButton2.addEventListener("click", () => {
        membershipModal2.close();
    });

    closeModalButton3.addEventListener("click", () => {
        membershipModal3.close();
    });

    closeModalButton4.addEventListener("click", () => {
        membershipModal4.close();
    });
}


// For the Discover page
const areasOfInterestContainer = document.getElementById("areasOfInterestContainer");
if (areasOfInterestContainer) {
    places.forEach(place => {
        const card = document.createElement("section");

        card.innerHTML = `
        <h2>${place.name}</h2>
        <div>
            <figure>
                <img src="${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
            </figure>
            <div>
                <address>${place.address}</address>
                <p>${place.description}</p>
            </div>
        </div>
        <button>Learn More</button>
        `;

        areasOfInterestContainer.appendChild(card);
    });
}

// Local Storage for Discover Page
const visitMessage = document.getElementById("visitMessage");
if (visitMessage) {
    const lastVisit = localStorage.getItem("lastVisit");
    const timeNow = Date.now();

    let message = "";
    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const diffTime = timeNow - Number(lastVisit);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            message = "Back so soon! Awesome!";
        } else {
            message = `You last visited ${diffDays} day(s) ago.`;
        }
    }

    visitMessage.textContent = message;
}