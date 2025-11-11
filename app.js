const fetchButton = document.getElementById('fetch-button');
const resultsBody = document.getElementById('stations-tbody');
const errorMessageEl = document.getElementById('error-message');

const API_TOKEN = "hUwZRoeqGEZpeApgbHmkunQYUgGiJwuc";

fetchButton.addEventListener('click', handleFetchData);

async function handleFetchData() {
    resultsBody.innerHTML = "";
    errorMessageEl.textContent = "";

    const originalApiUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2/stations?limit=25";

    const PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(originalApiUrl)}`;

    const fetchOptions = {
        headers: {
            'token': API_TOKEN
        }
    };

    try {
        const response = await fetch(PROXY_URL, fetchOptions);

        if (!response.ok) {
            if (response.status === 401) {
                errorMessageEl.textContent = 'Błędny token lub brak autoryzacji.';
            } else {
                errorMessageEl.textContent = `Wystąpił błąd: ${response.status} ${response.statusText}`;
            }
            return;
        }

        const data = await response.json();

        if (data.results) {
            renderStations(data.results);
        } else {
            errorMessageEl.textContent = 'Otrzymano dane w nieoczekiwanym formacie.';
        }

    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        let message = 'Wystąpił nieznany błąd.';
        if (error instanceof Error) {
            message = `Błąd sieci lub połączenia: ${error.message}`;
        }
        errorMessageEl.textContent = message;
    }
}

function renderStations(stations) {
    if (!stations || stations.length === 0) {
        errorMessageEl.textContent = 'Nie znaleziono żadnych stacji.';
        return;
    }

    stations.forEach(station => {
        const row = document.createElement('tr');

        const stationId = station.id ?? 'Brak';
        const stationName = station.name ?? 'Brak';
        const latitude = station.latitude ?? 'Brak';
        const longitude = station.longitude ?? 'Brak';

        row.innerHTML = `
            <td>${stationId}</td>
            <td>${stationName}</td>
            <td>${latitude}</td>
            <td>${longitude}</td>
        `;
        resultsBody.appendChild(row);
    });
}