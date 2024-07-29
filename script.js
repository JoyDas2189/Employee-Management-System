document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employeeForm');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const positionInput = document.getElementById('position');
    const gmailInput = document.getElementById('gmail');
    const experienceInput = document.getElementById('experience');
    const employeesList = document.getElementById('employees');
    let isEditing = false;
    let currentIndex;
  
    function getEmployees() {
      return fetch('http://localhost:3000/employees')
        .then(response => response.json());
    }
  
    function addEmployee(name, age, position, gmail, experience) {
      fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age, position, gmail, experience })
      })
        .then(response => response.json())
        .then(() => {
          renderEmployees();
        });
    }
  
    function editEmployee(id, name, age, position, gmail, experience) {
      fetch(`http://localhost:3000/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age, position, gmail, experience })
      })
        .then(response => response.json())
        .then(() => {
          renderEmployees();
        });
    }
  
    function renderEmployees() {
      getEmployees().then(employees => {
        employeesList.innerHTML = '';
        employees.forEach((employee) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.alignItems = 'center';
          li.style.padding = '10px';
          li.style.borderBottom = '1px solid #ccc';
    
          const employeeInfo = document.createElement('span');
          employeeInfo.textContent = `${employee.name} - ${employee.age} - ${employee.position} - ${employee.gmail} - ${employee.experience}`;
          
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.style.backgroundColor = 'blue';
          editButton.style.marginLeft = 'auto'; // Pushes the edit button to the right
          editButton.onclick = () => {
            nameInput.value = employee.name;
            ageInput.value = employee.age;
            positionInput.value = employee.position;
            gmailInput.value = employee.gmail;
            experienceInput.value = employee.experience;
            isEditing = true;
            currentIndex = employee.id;
          };
    
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.style.backgroundColor = 'red';
          deleteButton.style.marginLeft = '10px'; // Adds some space between the edit and delete buttons
          deleteButton.onclick = () => {
            deleteEmployee(employee.id);
          };
    
          li.appendChild(employeeInfo);
          li.appendChild(editButton);
          li.appendChild(deleteButton);
          employeesList.appendChild(li);
        });
      });
    }
  
    function deleteEmployee(id) {
      fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          renderEmployees();
        });
    }
  
    employeeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value;
      const age = ageInput.value;
      const position = positionInput.value;
      const gmail = gmailInput.value;
      const experience = experienceInput.value;
  
      if (name && age && position && gmail && experience) {
        if (isEditing) {
          editEmployee(currentIndex, name, age, position, gmail, experience);
          isEditing = false;
          currentIndex = null;
        } else { 
          addEmployee(name, age, position, gmail, experience);
        }
        nameInput.value = '';
        ageInput.value = '';
        positionInput.value = '';
        gmailInput.value = '';
        experienceInput.value = '';
      }
    });
    renderEmployees();
  });
  