// Google Sheets API credentials
const SPREADSHEET_ID = '1j9atKO2QYTRsONmyUyxvmKjRgH0MkPp6T7VjI40d-mU';
const CLIENT_ID = '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCcYduLn5rRSVY87x6vAXqks_KugU_gi9E';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Google Sheets API client library initialization
gapi.load('client', initClient);

// Initialization of Google Sheets API client library
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: SCOPES
  }).then(() => {
    console.log('Google Sheets API client library initialized.');
    checkAuth();
  }).catch(error => {
    console.error('Error initializing Google Sheets API client library:', error);
  });
}

// Check if user is authorized to access the Google Sheets API
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES,
    'immediate': true
  }, handleAuthResult);
}

// Handle the result of the authorization check
function handleAuthResult(authResult) {
  const loginDiv = document.getElementById('login');
  const homeDiv = document.getElementById('home');
  if (authResult && !authResult.error) {
    // User is authorized, show the home screen
    loginDiv.style.display = 'none';
    homeDiv.style.display = 'block';
    getRequests();
  } else {
    // User is not authorized, show the login screen
    loginDiv.style.display = 'block';
    homeDiv.style.display = 'none';
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
}

// Handle the form submit event for the login form
function handleLoginSubmit(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  authenticateUser(username, password);
}

// Authenticate the user with the Google Sheets API
function authenticateUser(username, password) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!A1:B'
  }).then(response => {
    const data = response.result.values;
    const foundUser = data.find(row => row[0] === username && row[1] === password);
    if (foundUser) {
      // User is authenticated, show the home screen
      const loginDiv = document.getElementById('login');
      const homeDiv = document.getElementById('home');
      loginDiv.style.display = 'none';
      homeDiv.style.display = 'block';
      getRequests();
    } else {
      // User is not authenticated, show an error message
      const errorMessage = 'Invalid username or password';
      alert(errorMessage);
    }
  }).catch(error => {
    console.error('Error authenticating user:', error);
  });
}

// Get the maintenance requests from the Google Sheets file and populate the requests table
function getRequests() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1QRirurGmkLABVivBa39T3dQEHhr3drw8gSO5yh6qfSsl9gVRgRCnBxrSs98dbKN7FrXuxsWVbgMrQM',
    range: 'MaintenanceRequests!A2:F'
  }).then(response => {
    const data = response.result.values;
    const requestsData = data.map(row => ({
      location: row[0],
      room: row[1],
      staff: row[2],
      dateRequested: row[3],
      description: row[4],
      status: row[5]
    }));
    const requestsTableBody = document.getElementById('requests-body');
    requestsTableBody.innerHTML = '';
    requestsData.forEach(request => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.location}</td>
        <td>${request.room}</td>
        <td>${request.staff}</td>
        <td>${request.dateRequested}</td>
        <td>${request.description}</td>
        <td>${request.status === 'Completed' ? '<span class="status completed">Completed</span>' : '<span class="status incomplete">Incomplete</span>'}</td>
      `;
      requestsTableBody.appendChild(row);
    });
  }).catch(error => {
    console.error('Error getting maintenance requests:', error);
  });
}

// Handle the form submit event for the new request form
function handleRequestSubmit(event) {
  event.preventDefault();
  const location = document.getElementById('location').value;
  const room = document.getElementById('room').value;
  const staff = document.getElementById('staff').value;
  const dateRequested = document.getElementById('date-requested').value;
  const description = document.getElementById('description').value;
  const status = 'Incomplete';
  addRequest(location, room, staff, dateRequested, description, status);
}

// Add a new maintenance request to the Google Sheets file and update the requests table
function addRequest(location, room, staff, dateRequested, description, status) {
  const values = [[location, room, staff, dateRequested, description, status]];
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: '1TZyq24fpJSK-yl-U2jkqr95RwcAMMZ85lLG5dZJ91SJU-7-3swVhmqwqtrfLSH9UtzHJfYcay_tL2m',
    range: 'MaintenanceRequests!A2:F',
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  }).then(response => {
    console.log(`${response.result.updates.updatedCells} cells appended to MaintenanceRequests sheet.`);
    document.getElementById('new-request-form').reset();
    const homeDiv = document.getElementById('home');
    const formContainer = document.getElementById('form-container');
    homeDiv.style.display = 'block';
    formContainer.style.display = 'none';
    getRequests();
  }).catch(error => {
    console.error('Error adding maintenance request:', error);
  });
}

// Handle the click event for the new request button
const newRequestButton = document.getElementById('new-request');
newRequestButton.addEventListener('click', event => {
  const homeDiv = document.getElementById('home');
  const formContainer = document.getElementById('form-container');
  homeDiv.style.display = 'none';
    // Show the new request form
  formContainer.style.display = 'block';
});

// Handle the form cancel event for the new request form
const cancelButton = document.getElementById('cancel-request');
cancelButton.addEventListener('click', event => {
  const homeDiv = document.getElementById('home');
  const formContainer = document.getElementById('form-container');
  homeDiv.style.display = 'block';
  formContainer.style.display = 'none';
});

// Handle the form submit event for the new request form
const requestForm = document.getElementById('new-request-form');
requestForm.addEventListener('submit', handleRequestSubmit);

// Load the Google Sheets API
gapi.load('client', start);

function start() {
  gapi.client.init({
    apiKey: 'AIzaSyCcYduLn5rRSVY87x6vAXqks_KugU_gi9E',
    clientId: '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  }).then(() => {
    const signInButton = document.getElementById('sign-in');
    const signOutButton = document.getElementById('sign-out');
    const userForm = document.getElementById('login-form');
    const homeDiv = document.getElementById('home');
    const formContainer = document.getElementById('form-container');

    // Handle the click event for the sign-in button
    signInButton.addEventListener('click', () => {
      gapi.auth2.getAuthInstance().signIn();
    });

    // Handle the click event for the sign-out button
    signOutButton.addEventListener('click', () => {
      gapi.auth2.getAuthInstance().signOut();
    });

    // Handle the form submit event for the login form
    userForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      checkUser(username, password);
    });

    // Listen for sign-in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Set the initial sign-in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    // Get the maintenance requests
    getRequests();
  }).catch(error => {
    console.error('Error initializing the Google Sheets API:', error);
  });
}

// Update the sign-in status
function updateSigninStatus(isSignedIn) {
  const signInButton = document.getElementById('sign-in');
  const signOutButton = document.getElementById('sign-out');
  const loginDiv = document.getElementById('login');
  const homeDiv = document.getElementById('home');
  const formContainer = document.getElementById('form-container');
  if (isSignedIn) {
    signInButton.style.display = 'none';
    signOutButton.style.display = 'block';
    loginDiv.style.display = 'none';
    homeDiv.style.display = 'block';
    formContainer.style.display = 'none';
  } else {
    signInButton.style.display = 'block';
    signOutButton.style.display = 'none';
    loginDiv.style.display = 'block';
    homeDiv.style.display = 'none';
    formContainer.style.display = 'none';
  }
}

  // Check if the user is valid and signed them in if they are
  function checkUser(username, password) {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1QRirurGmkLABVivBa39T3dQEHhr3drw8gSO5yh6qfSsl9gVRgRCnBxrSs98dbKN7FrXuxsWVbgMrQM',
      range: 'Users!A2:B',
    }).then(response => {
      const data = response.result.values;
      const user = data.find(user => user[0] === username && user[1] === password);
      if (user) {
        gapi.auth2.getAuthInstance().signIn();
      } else {
        alert('Invalid username or password.');
      }
    }).catch(error => {
      console.error('Error getting user data from Google Sheets:', error);
    });
  }

  // Handle the form submit event for the new request form
  function handleRequestSubmit(event) {
    event.preventDefault();
    const locationInput = document.getElementById('location');
    const roomInput = document.getElementById('room');
    const staffInput = document.getElementById('staff');
    const dateInput = document.getElementById('date');
    const descriptionInput = document.getElementById('description');
    const requestsTableBody = document.getElementById('requests-body');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${locationInput.value}</td>
      <td>${roomInput.value}</td>
      <td>${staffInput.value}</td>
      <td>${dateInput.value}</td>
      <td>${descriptionInput.value}</td>
      <td>In Progress</td>
    `;
    requestsTableBody.appendChild(row);
    const formContainer = document.getElementById('form-container');
    const homeDiv = document.getElementById('home');
    formContainer.style.display = 'none';
    homeDiv.style.display = 'block';
    const values = [
      [locationInput.value, roomInput.value, staffInput.value, dateInput.value, descriptionInput.value, 'In Progress']
    ];
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: '1TZyq24fpJSK-yl-U2jkqr95RwcAMMZ85lLG5dZJ91SJU-7-3swVhmqwqtrfLSH9UtzHJfYcay_tL2m',
      range: 'MaintenanceRequests!A2:F',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values
      }
    }).then(response => {
      console.log(`${response.result.updates.updatedCells} cells appended.`);
    }).catch(error => {
      console.error('Error appending data to Google Sheets:', error);
    });
  }
