const API_TOKEN = "hUwZRoeqGEZpeApgbHmkunQYUgGiJwuc";
const BASE_API_URL = "https://www.ncei.noaa.gov/cdo-web/api/v2";


const tabStations = document.getElementById('tab-stations');
const tabLocations = document.getElementById('tab-locations');
const tabData = document.getElementById('tab-data'); 
const contentStations = document.getElementById('content-stations');
const contentLocations = document.getElementById('content-locations');
const contentData = document.getElementById('content-data'); 


const fetchStationsButton = document.getElementById('fetch-stations-button');
const resultsBody = document.getElementById('stations-tbody');
const errorMessageStations = document.getElementById('error-message-stations');


const locationsFetchForm = document.getElementById('locations-fetch-form');
const locationsResultsBody = document.getElementById('locations-tbody');
const errorMessageLocations = document.getElementById('error-message-locations');


const fetchDataButton = document.getElementById('fetch-data-button'); 
const dataResultsBody = document.getElementById('data-tbody'); 
const errorMessageData = document.getElementById('error-message-data'); 


tabStations.addEventListener('click', () => {
    tabStations.classList.add('active');
    tabLocations.classList.remove('active');
    tabData.classList.remove('active');

    contentStations.classList.remove('hidden');
    contentLocations.classList.add('hidden');
    contentData.classList.add('hidden');
});

tabLocations.addEventListener('click', () => {
    tabStations.classList.remove('active');
    tabLocations.classList.add('active');
    tabData.classList.remove('active');

    contentStations.classList.add('hidden');
    contentLocations.classList.remove('hidden');
    contentData.classList.add('hidden');
});

tabData.addEventListener('click', () => {
    tabStations.classList.remove('active');
    tabLocations.classList.remove('active');
    tabData.classList.add('active');

    contentStations.classList.add('hidden');
    contentLocations.classList.add('hidden');
    contentData.classList.remove('hidden');
});



fetchStationsButton.addEventListener('click', handleFetchStations);

async function handleFetchStations() {
    resultsBody.innerHTML = "";
    errorMessageStations.textContent = "";
    document.body.style.cursor = 'wait';

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
    } finally {
        document.body.style.cursor = 'auto';
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
    document.body.style.cursor = 'wait';

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
    } finally {
        document.body.style.cursor = 'auto';
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


fetchDataButton.addEventListener('click', handleFetchData);

async function handleFetchData() {
    dataResultsBody.innerHTML = "";
    errorMessageData.textContent = "";
    document.body.style.cursor = 'wait';

    const originalApiUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:28801&startdate=2010-05-01&enddate=2010-05-01&sortorder=desc";
    const PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(originalApiUrl)}`;
    const fetchOptions = { headers: { 'token': API_TOKEN } };

    try {
        const response = await fetch(PROXY_URL, fetchOptions);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        if (data.results) {
            renderData(data.results);
        } else {
            errorMessageData.textContent = 'Otrzymano dane w nieoczekiwanym formacie.';
        }
    } catch (error) {
        handleApiError(error, errorMessageData);
    } finally {
        document.body.style.cursor = 'auto';
    }
}


function renderData(dataItems) {
    if (!dataItems || dataItems.length === 0) {
        errorMessageData.textContent = 'Nie znaleziono danych dla tego zapytania.';
        return;
    }
    dataItems.forEach(item => {
        const row = document.createElement('tr');
       
        const simpleDate = item.date ? item.date.split('T')[0] : 'Brak';

        row.innerHTML = `
            <td>${simpleDate}</td>
            <td>${item.datatype ?? 'Brak'}</td>
            <td>${item.station ?? 'Brak'}</td>
            <td>${item.value ?? 'Brak'}</td>
        `;
        dataResultsBody.appendChild(row);
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