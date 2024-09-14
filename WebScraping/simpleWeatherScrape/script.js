// Function to scroll smoothly to an element
function scrollToElement(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Function to search for a city or region on Google
function searchGoogle(query) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

// Function to handle GIF lazy loading
function loadGif() {
    const gifContainer = document.getElementById('gif-container');
    const gifImage = gifContainer.querySelector('img');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gifImage.src = gifImage.getAttribute('data-src');
                observer.unobserve(gifContainer);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(gifContainer);
}

// Initialize GIF lazy loading
document.addEventListener('DOMContentLoaded', loadGif);


// Add event listeners to buttons
document.getElementById('citiesButton').addEventListener('click', () => {
    scrollToElement('cities');
});

document.getElementById('regionsButton').addEventListener('click', () => {
    scrollToElement('regions');
});

// Add event listener to GIF
document.getElementById('gif-container').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

fetch('weather_data.json')
    .then(response => response.json())
    .then(data => {
        const citiesContainer = document.getElementById('cities');
        const regionsContainer = document.getElementById('regions');

        data.cities.forEach(city => {
            const cityDiv = document.createElement('div');
            cityDiv.className = 'city';
            cityDiv.innerHTML = `<h2>${city.city}</h2><div class="temperature">${city.temperature}</div>`;
            cityDiv.addEventListener('click', () => searchGoogle(city.city)); // Add click event listener
            citiesContainer.appendChild(cityDiv);
        });

        data.regions.forEach(region => {
            const regionDiv = document.createElement('div');
            regionDiv.className = 'region';
            regionDiv.innerHTML = `<h2>${region.region}</h2><div class="description">${region.description.map(paragraph => `<p>${paragraph}</p>`).join('')}</div>`;
            regionDiv.addEventListener('click', () => searchGoogle(region.region)); // Add click event listener
            regionsContainer.appendChild(regionDiv);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
