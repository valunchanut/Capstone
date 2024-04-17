
const apiEndpoint = 'http://127.0.0.1:8000/forecast/';

async function performForecast() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Validate the date range
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    alert('Please select a valid date range.');
    return;
  }

  // Prepare the forecast request payload
  const forecastRequest = {
    start_day: new Date(startDate).getDate(),
    end_day: new Date(endDate).getDate(),
    month: new Date(startDate).getMonth() + 1, // getMonth() returns 0-11
    year: new Date(startDate).getFullYear()
  };

  try {
    // Call the forecasting API
    const response = await fetch('/forecast/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(forecastRequest)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const forecastedJson = JSON.parse(responseData.forecast); // Parse the inner JSON string
    const forecastedData = forecastedJson.data; // Extract the forecast data

    displayForecastResults(forecastedData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const forecastButton = document.getElementById('submit');
  forecastButton.addEventListener('click', performForecast);
});

function displayData(data) {
  const tableBody = document.getElementById('data-table');
  tableBody.innerHTML = ''; // Clear previous entries

  data.forEach(entry => {
    const row = tableBody.insertRow();
    const dateCell = row.insertCell(0);
    dateCell.textContent = entry.date;

    // Add more cells for each product as needed
    Object.keys(entry).forEach((key, index) => {
      if (key !== 'date') { // Skip the date field for product cells
        const cell = row.insertCell(index);
        cell.textContent = entry[key];
      }
    });
  });
}

function plotData(data) {
  const dates = data.map(entry => entry.date);
  const products = Object.keys(data[0]).filter(key => key !== 'date');

  const traces = products.map(product => {
    return {
      x: dates,
      y: data.map(entry => entry[product]),
      type: 'scatter',
      name: product
    };
  });

  Plotly.newPlot('chart', traces, { title: 'Product Sales Forecast' });
}
