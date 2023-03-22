const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Show/hide new request form
document.getElementById('new-request-btn').addEventListener('click', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const form = document.getElementById('new-request-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  } else {
    alert('Please log in to submit a maintenance request.');
  }
});

// Add new maintenance request
document.getElementById('maintenance-request-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to submit a maintenance request.');
    return;
  }
  const formData = new FormData(event.target);
  const values = {};
  formData.forEach((value, key) => {
    values[key] = value;
  });
  addRequest(values.Location, values.Room, values.Staff, values['Date Requested'], values.Description);
});

// Toggle request status between complete and incomplete
document.getElementById('requests-list').addEventListener('click', (event) => {
  if (event.target.classList.contains('status-btn')) {
    toggleRequestStatus(event.target);
  }
});

function toggleRequestStatus(button) {
  const row = button.parentElement.parentElement;
  if (row.classList.contains('incomplete')) {
    row.classList.remove('incomplete');
    row.classList.add('complete');
    button.textContent = 'Completed';
  } else {
    row.classList.remove('complete');
    row.classList.add('incomplete');
    button.textContent = 'Incomplete';
  }
}

// Add new maintenance request to table
function addRequest(location, room, staff, date, description) {
  const newRow = document.createElement('tr');
  newRow.classList.add('incomplete');

  newRow.innerHTML = `
      <td>${location}</td>
      <td>${room}</td>
      <td>${staff}</td>
      <td>${date}</td>
      <td>${description}</td>
      <td>
        <button class="status-btn">Incomplete</button>
      </td>
  `;
  
  const requestsList = document.getElementById('requests-list');
  requestsList.appendChild(newRow);
}

// Handle user authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    console.log('User is signed in.');
  } else {
    // User is signed out.
    console.log('User is signed out.');
    // Redirect the user to the login page
    window.location.href = 'https://yourdomain.com/login.html';
  }
});
