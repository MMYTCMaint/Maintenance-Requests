const CLIENT_ID = '164604608036-2m8htu36kk90g66dfd342fe0aavh0ugs.apps.googleusercontent.com';
const REDIRECT_URI = 'https://yourusername.github.io/maintenance-request/callback.html';

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
