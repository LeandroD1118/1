todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "The 'Title' field must contain at least 2 characters.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage = "The 'Title' field must not contain more than 100 characters.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage = "The 'Description' field must not contain more than 500 characters.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "The field 'Due Date' is mandatory.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';

    tasks.sort((p1, p2) => (p1.dueDate < p2.dueDate) ? 1 : (p1.dueDate > p2.dueDate) ? -1 : 0);
    


    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if(task.completed){
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        }
        else{
          todoListElement.insertAdjacentHTML('afterbegin', renderTask(task));
        }
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed  }) {
let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-800">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-xl font-bold uppercase">${title}</h3>`;

  if (completed) {
    html += `
        <div>
          <span class="text-green-600">Completed</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Delete</button>
        </div>
      </div>`;
  } else {
    html += `
        <div>
          <input onclick="completeTask(${id})" type="checkbox" id="completed" value="on">
          <span>${dueDate}</span>
          <span class="text-red-600">Not Completed</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Delete</button>
 
          
          </div>
      </div>`;
  }

  description &&

  (html += `
    <p class="ml-8 mt-2 text-xs italic">${description}</p>
`);

  html += '</li>';
  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

function completeTask(id){
  api.update(id)
}

renderList();