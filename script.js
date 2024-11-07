const add = document.getElementById('add');
const task = document.getElementById('added-task');
const alarm = document.getElementById('alarm-task');
const ul = document.getElementById('todo-list');
const done = document.getElementById('done-btn');
const myModal = document.getElementById('add-task');
const cancel = document.getElementById('cancel-btn');
const alarmSound = document.getElementById('alarm-sound');

const showModal = () => {
  myModal.style.display = 'flex';
  add.setAttribute('hidden', true);
  done.addEventListener('click', () => {
    myModal.style.display = 'none';
    add.removeAttribute('hidden');
  });
  cancel.addEventListener('click', () => {
    myModal.style.display = 'none';
    add.removeAttribute('hidden');
  });
};

const addTask = () => {
  if (task.value) {
    const noTaskMessage = document.getElementById('no-task-message');
    noTaskMessage.style.display = 'none';
    const div = document.createElement('div');
    const li = document.createElement('li');
    const mod = document.createElement('button');
    const mod2 = document.createElement('button');
    const i = document.createElement('i');
    const i2 = document.createElement('i');
    i.setAttribute('class', 'material-icons');
    i.textContent = 'delete';
    i2.setAttribute('class', 'material-icons');
    i2.textContent = 'edit';
    li.textContent = `${task.value} - ${alarm.value}`;
    mod.appendChild(i2);
    mod2.appendChild(i);
    mod.addEventListener('click', () => editTask(li));
    mod2.addEventListener('click', () => removeTask(div));
    div.appendChild(li);
    div.appendChild(mod);
    div.appendChild(mod2);
    ul.appendChild(div);
    saveTasks();
    scheduleAlarm(task.value, alarm.value);
    task.value = '';
    alarm.value = '';
  }
};

const removeTask = (taskElement) => {
  taskElement.remove();
  saveTasks();
};

const addTaskToList = (taskText, alarmTime) => {
  const noTaskMessage = document.getElementById('no-task-message');
  noTaskMessage.style.display = 'none';
  const div = document.createElement('div');
  const li = document.createElement('li');
  const mod = document.createElement('button');
  const mod2 = document.createElement('button');
  const i = document.createElement('i');
  const i2 = document.createElement('i');
  i.setAttribute('class', 'material-icons');
  i.textContent = 'delete';
  i2.setAttribute('class', 'material-icons');
  i2.textContent = 'edit';
  li.textContent = `${taskText} - ${alarmTime}`;
  mod.appendChild(i2);
  mod2.appendChild(i);
  mod.addEventListener('click', () => editTask(li));
  mod2.addEventListener('click', () => removeTask(div));
  div.appendChild(li);
  div.appendChild(mod);
  div.appendChild(mod2);
  ul.appendChild(div);
  scheduleAlarm(taskText, alarmTime);
};

const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks');

  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    tasks.forEach((task) => addTaskToList(task.text, task.alarm)); // Load each saved task
  }
};

const saveTasks = () => {
  const tasks = [];
  document.querySelectorAll('#todo-list li').forEach((li) => {
    const [text, alarm] = li.textContent.split(' - ');
    tasks.push({ text, alarm });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const deleteAllTask = () => {
  ul.innerHTML = '';
  localStorage.removeItem('tasks');
};

const scheduleAlarm = (taskText, alarmTime) => {
  const alarmDate = new Date();
  const [hours, minutes] = alarmTime.split(':');
  alarmDate.setHours(hours);
  alarmDate.setMinutes(minutes);
  alarmDate.setSeconds(0);

  const now = new Date();
  const timeToAlarm = alarmDate.getTime() - now.getTime();

  if (timeToAlarm > 0) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('ToDo Reminder', {
          body: `It's time to: ${taskText}`,
        });
        // Ensure audio playback is allowed on mobile
        if (typeof alarmSound.play === 'function') {
          alarmSound.play().catch((error) => {
            console.error('Audio playback failed:', error);
          });
        }
      }
    }, timeToAlarm);
  }

  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
};

done.addEventListener('click', addTask);
loadTasks();
add.addEventListener('click', () => showModal());

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}
