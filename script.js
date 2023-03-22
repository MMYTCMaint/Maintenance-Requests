// Your Firebase configuration details
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Show/hide new request form
document.getElementById('new-request-btn').addEventListener('click', () => {
  const form = document.getElementById('new-request-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Add new maintenance request
document.getElementById('maintenance-request-form').addEventListener('submit', (event) => {
  event.preventDefault();
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

// Authenticate user on form submit
document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User is signed in.
      const user = userCredential.user;
      // Show the requests table
      document.getElementById('requests-table').style.display = 'block';
      // Hide the login form
      document.getElementById('login-form').style.display = 'none';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Invalid email or password');
    });
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
