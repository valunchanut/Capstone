const apiEndpoint = 'http://localhost:8000/forecast/';

function performForecast() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Construct the API endpoint with query parameters
    const forecastUrl = `${apiEndpoint}?start_day=${startDate}&end_day=${endDate}`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Process and display the data in your front end
            console.log(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
  const forecastButton = document.getElementById('submit');
  forecastButton.addEventListener('click', performForecast);
});

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

  // Call the forecasting API
  try {
    const response = await fetch('/forecast/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(forecastRequest)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const forecastedData = JSON.parse(data.forecast); // assuming 'forecast' is the key in the response JSON

    displayForecastResults(forecastedData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

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

  Plotly.newPlot('chart', traces, {title: 'Product Sales Forecast'});
}