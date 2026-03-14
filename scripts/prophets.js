// ...
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// ...
const getProphetData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets);
    displayProphets(data.prophets);
}
getProphetData();

// ...
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // 1. Create a section element
        const card = document.createElement("section");
        // 2. Create the h2 element
        const fullName = document.createElement("h2");
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        // 3. Create the Birth and Death date
        const birthDate = document.createElement("p");
        const birthPlace = document.createElement("p");
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;
        // 3. Create the img element
        const portrait = document.createElement("img");
        portrait.setAttribute("src", prophet.imageurl);
        portrait.setAttribute("alt", `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", 340);
        portrait.setAttribute("height", 440);
        // 4. Add the full name and the image to the section element
        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);
        // 5. Add the section to the div element
        cards.appendChild(card);
    });
}