// Your Google Sheets API client ID
const clientId = '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com';
const sheetId = '1L-lDxOZR6l0b4J4O1Aqb3qyU6cL-6SdU6OeN3qztNxo'; // Replace this with the actual Sheet ID
const sheetName = 'MaintenanceRequests';

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
  } catch (error) {
    console.error('Error saving data to Google Sheet:', error);
  }
}

// Load the Google API client and auth2 library
function initClient() {
  gapi.load('client:auth2', {
    callback: function() {
      // Initialize the Google API client
      gapi.client.init({
        apiKey: 'AIzaSyCcYduLn5rRSVY87x6vAXqks_KugU_gi9E',
        clientId: '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
      }).then(
        function () {
          // Add listener to handle the authentication status
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

          // Check if the user is already signed in
          updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          console.error('Error initializing Google API client:', error);
        }
      );
    },
    onerror: function () {
      console.error('Error loading Google API client library');
    },
  });
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    console.log('User is signed in');
  } else {
    console.log('User is not signed in');
  }
}

// Call the initClient function to load the Google API client and auth2 library
initClient();
