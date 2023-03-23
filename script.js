// Your Google Sheets API client ID
const clientId = '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com';
const sheetId = '1L-lDxOZR6l0b4J4O1Aqb3qyU6cL-6SdU6OeN3qztNxo'; // Replace this with the actual Sheet ID
const sheetName = 'MaintenanceRequests';

// Add listener to handle the "New Request" button click
document.getElementById('New-Request-button').addEventListener('click', () => {
  document.getElementById('maintenance-request-form').style.display = 'block';
});

// Add new maintenance request
document.getElementById('maintenance-request-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const values = {};
  formData.forEach((value, key) => {
    values[key] = value;
  });

  // Authenticate and save the request to Google Sheet
  authenticate().then(loadClient).then(async () => {
    await saveToGoogleSheet(values);
  });

  addRequest(values.Location, values.Room, values.Staff, values['Date Requested'], values.Description);
});

async function authenticate() {
  return gapi.auth2.getAuthInstance().signIn({scope: "https://www.googleapis.com/auth/spreadsheets"})
      .then(() => { console.log("Sign-in successful"); },
            (err) => { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyCcYduLn5rRSVY87x6vAXqks_KugU_gi9E");
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
      .then(() => { console.log("GAPI client loaded for API"); },
            (err) => { console.error("Error loading GAPI client for API", err); });
}

async function saveToGoogleSheet(data) {
  const newRowData = [
    data.Location,
    data.Room,
    data.Staff,
    data['Date Requested'],
    data.Description,
    'Incomplete'
  ];

  const params = {
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:G1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT',
  };

  const requestBody = {
    values: [newRowData],
  };

// Your Google Sheets API client ID
const clientId = '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com';
const sheetId = '1L-lDxOZR6l0b4J4O1Aqb3qyU6cL-6SdU6OeN3qztNxo'; // Replace this with the actual Sheet ID
const sheetName = 'MaintenanceRequests';

// Add listener to handle the "New Request" button click
document.getElementById('new-request-button').addEventListener('click', () => {
  document.getElementById('maintenance-request-form').style.display = 'block';
});

// Add new maintenance request
document.getElementById('maintenance-request-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const values = {};
  formData.forEach((value, key) => {
    values[key] = value;
  });

  // Authenticate and save the request to Google Sheet
  authenticate().then(loadClient).then(async () => {
    await saveToGoogleSheet(values);
  });

  addRequest(values.Location, values.Room, values.Staff, values['Date Requested'], values.Description);
});

async function authenticate() {
  return gapi.auth2.getAuthInstance().signIn({scope: "https://www.googleapis.com/auth/spreadsheets"})
      .then(() => { console.log("Sign-in successful"); },
            (err) => { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyCcYduLn5rRSVY87x6vAXqks_KugU_gi9E");
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
      .then(() => { console.log("GAPI client loaded for API"); },
            (err) => { console.error("Error loading GAPI client for API", err); });
}

async function saveToGoogleSheet(data) {
  const newRowData = [
    data.Location,
    data.Room,
    data.Staff,
    data['Date Requested'],
    data.Description,
    'Incomplete'
  ];

  const params = {
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:G1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT',
  };

  const requestBody = {
    values: [newRowData],
  };
try {
  const response = await gapi.client.sheets.spreadsheets.values.append(params, requestBody);
  console.log('Data saved to Google Sheet:', response.result);

  // Show success message
  const successMessage = `Your request has been successfully submitted!`;
  alert(successMessage);

  // Clear the form fields
  document.getElementById('maintenance-request-form').reset();
} catch (error) {
  console.error('Error saving data to Google Sheet:', error);

  // Show error message
  const errorMessage = `There was an error submitting your request. Please try again later.`;
  alert(errorMessage);
}

