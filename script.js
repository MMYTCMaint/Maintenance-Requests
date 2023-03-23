// Load the Google Sheets API library
gapi.load('client', initClient);

// Google Sheets API configuration
const CLIENT_ID = 'your_client_id';
const API_KEY = 'your_api_key';
const SHEET_ID = 'your_sheet_id';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let requestsData = [];

// Function to initialize the Google Sheets API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        // Listen for the login form submission
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);

        // Listen for the new request form submission
        const requestForm = document.getElementById('request-form');
        requestForm.addEventListener('submit', handleNewRequest);

        // Listen for the new request button click
        const newRequestButton = document.getElementById('new-request');
        newRequestButton.addEventListener('click', showNewRequestForm);

        // Listen for the cancel request button click
        const cancelRequestButton = document.getElementById('cancel-request');
        cancelRequestButton.addEventListener('click', hideNewRequestForm);

        // Check if the user is already logged in
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        if (username && password) {
            loginUser(username, password);
        } else {
            showLoginForm();
        }
    }, handleError);
}

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginUser(username, password);
}

// Function to handle new request form submission
function handleNewRequest(event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const room = document.getElementById('room').value;
    const staff = document.getElementById('staff').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Add the new request to the requests data array
    const newRequest = {
        location,
        room,
        staff,
        date,
        description,
        status: 'Incomplete',
    };
    requestsData.push(newRequest);

    // Update the Google Sheets file
    updateRequestsSheet(requestsData);

    // Hide the new request form and show the home page
    hideNewRequestForm();
    showHomePage();
}

// Function to show the login form and hide the other sections
function showLoginForm() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('home').style.display = 'none';
    document.getElementById('form-container').style.display = 'none';
}

// Function to show the home page and hide the other sections
function showHomePage() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('home').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';

// Populate the table with the requests data
const requestsTableBody = document.getElementById('requests-body');
requestsTableBody.innerHTML = '';
requestsData.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${request.location}</td>
        <td>${request.room}</td>
        <td>${request.staff}</td>
        <td>${request.date}</td>
        <td>${request.description}</td>
        <td>${request.status === 'Complete' ? '<span class="complete">Complete</span>' : '<span class="incomplete">Incomplete</span>'}</td>
    `;
    requestsTableBody.appendChild(row);
});
}

// Function to show the new request form and hide the other sections
function showNewRequestForm() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
}

// Function to hide the new request form and show the home page
function hideNewRequestForm() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('home').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';
}

// Function to log in the user
function loginUser(username, password) {
    // Check the Google Sheets file for the user credentials
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Users!A2:B',
    }).then(response => {
        const rows = response.result.values;
        const user = rows.find(row => row[0] === username && row[1] === password);
        if (user) {
            // Save the user credentials to local storage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            // Load the requests data from the Google Sheets file
            loadRequestsData();
        } else {
            alert('Invalid username or password');
        }
    }, handleError);
}

// Function to load the requests data from the Google Sheets file
function loadRequestsData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Requests!A2:F',
    }).then(response => {
        const rows = response.result.values;
        requestsData = rows.map(row => {
            return {
                location: row[0],
                room: row[1],
                staff: row[2],
                date: row[3],
                description: row[4],
                status: row[5],
            };
        });

        // Show the home page
        showHomePage();
    }, handleError);
}

// Function to update the Google Sheets file with the requests data
function updateRequestsSheet(requests) {
    const data = requests.map(request => [request.location, request.room, request.staff, request.date, request.description, request.status]);

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Requests!A2:F',
        valueInputOption: 'USER_ENTERED',
        resource: { values: data },
    }).then(response => {
        console.log(`${response.result.updatedCells} cells updated.`);
    }, handleError);
}

// Function to handle errors
function handleError(error) {
    console.error(error);
    alert('An error occurred. Please try again.');
}
