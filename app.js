
const API_TOKEN = "hUwZRoeqGEZpeApgbHmkunQYUgGiJwuc";
const BASE_API_URL = "https://www.ncei.noaa.gov/cdo-web/api/v2";

const tabStations = document.getElementById('tab-stations');
const tabLocations = document.getElementById('tab-locations');
const contentStations = document.getElementById('content-stations');
const contentLocations = document.getElementById('content-locations');

const fetchStationsButton = document.getElementById('fetch-stations-button');
const resultsBody = document.getElementById('stations-tbody');
const errorMessageStations = document.getElementById('error-message-stations');

const locationsFetchForm = document.getElementById('locations-fetch-form');
const locationsResultsBody = document.getElementById('locations-tbody');
const errorMessageLocations = document.getElementById('error-message-locations');

tabStations.addEventListener('click', () => {
    tabStations.classList.add('active');
    tabLocations.classList.remove('active');
    contentStations.classList.remove('hidden');
    contentLocations.classList.add('hidden');
});

tabLocations.addEventListener('click', () => {
    tabLocations.classList.add('active');
    tabStations.classList.remove('active');
    contentLocations.classList.remove('hidden');
    contentStations.classList.add('hidden');
});

fetchStationsButton.addEventListener('click', handleFetchStations);

async function handleFetchStations() {
    resultsBody.innerHTML = "";
    errorMessageStations.textContent = "";

    const originalApiUrl = `${BASE_API_URL}/stations?limit=25`;
    const PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(originalApiUrl)}`;
    const fetchOptions = { headers: { 'token': API_TOKEN } };

    try {
        const response = await fetch(PROXY_URL, fetchOptions);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        if (data.results) {
            renderStations(data.results);
        } else {
            errorMessageStations.textContent = 'Otrzymano dane w nieoczekiwanym formacie.';
        }
    } catch (error) {
        handleApiError(error, errorMessageStations);
    }
}

function renderStations(stations) {
    if (!stations || stations.length === 0) {
        errorMessageStations.textContent = 'Nie znaleziono żadnych stacji.';
        return;
    }
    stations.forEach(station => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${station.id ?? 'Brak'}</td>
            <td>${station.name ?? 'Brak'}</td>
            <td>${station.latitude ?? 'Brak'}</td>
            <td>${station.longitude ?? 'Brak'}</td>
        `;
        resultsBody.appendChild(row);
    });
}

locationsFetchForm.addEventListener('submit', handleFetchLocations);

async function handleFetchLocations(event) {
    event.preventDefault();
    locationsResultsBody.innerHTML = "";
    errorMessageLocations.textContent = "";

    const endpoint = "locations";
    const originalApiUrl = `${BASE_API_URL}/${endpoint}?limit=25`;
    const PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(originalApiUrl)}`;
    const fetchOptions = { headers: { 'token': API_TOKEN } };

    try {
        const response = await fetch(PROXY_URL, fetchOptions);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();

        if (data.results) {
            renderLocations(data.results);
        } else {
            errorMessageLocations.textContent = 'Otrzymano dane w nieoczekiwanym formacie.';
        }

    } catch (error) {
        handleApiError(error, errorMessageLocations);
    }
}

function renderLocations(locations) {
    if (!locations || locations.length === 0) {
        errorMessageLocations.textContent = 'Nie znaleziono żadnych lokalizacji.';
        return;
    }
    locations.forEach(location => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${location.id ?? 'Brak'}</td>
            <td>${location.name ?? 'Brak'}</td>
            <td>${location.mindate ?? 'Brak'}</td>
            <td>${location.maxdate ?? 'Brak'}</td>
        `;
        locationsResultsBody.appendChild(row);
    });
}

function handleApiError(error, errorElement) {
    console.error('Błąd pobierania danych:', error);
    let message = 'Wystąpił nieznany błąd.';
    if (error instanceof Error) {
        if (error.message.includes('401')) {
            message = 'Błędny token lub brak autoryzacji.';
        } else {
            message = `Błąd sieci lub połączenia: ${error.message}`;
        }
    }
    errorElement.textContent = message;
}