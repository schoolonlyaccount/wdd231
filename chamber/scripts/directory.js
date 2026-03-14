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
membersContainer.classList.add("grid");
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

// Buttons to show a grid or list view for the members
showMembersGrid.addEventListener('click', () => {
    membersContainer.classList.remove('list');
    membersContainer.classList.add('grid');
});

showMembersList.addEventListener('click', () => {
    membersContainer.classList.remove('grid');
    membersContainer.classList.add('list');
});

// Fetch members on page load
fetchMembers();