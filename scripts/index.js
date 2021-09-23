const taskTemplate = document.querySelector('.task__template').content;
const backlogs = document.querySelector('.backlog__elements');

const userTemplate = document.querySelector('.user__template').content;
const calendar = document.querySelector('.calendar');

let users = [];

fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            users.push(data[i])
        }
        renderUsers();
    })
    .catch((err) => {
        console.log('Ошибка. Запрос не выполнен');
    });

let tasks = [];

fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            tasks.push(data[i])
        }
        renderTasks();
    })
    .catch((err) => {
        console.log('Ошибка. Запрос не выполнен');
    });

console.log(users);
console.log(tasks)

function getUsers(data) {
    const templateBox = userTemplate.cloneNode(true);
    const templateBoxUser = templateBox.querySelector('.calendar__user');
    const templateBoxTask = templateBox.querySelector('.calendar__task');

    templateBoxUser.innerText = data.firstName;
    templateBoxUser.id = data.id
    templateBoxTask.innerText = "";
    return templateBox;
}

function renderItemUsers(item) {
    calendar.append(getUsers(item));
}

function renderUsers() {
    users.forEach(renderItemUsers);
}

function getTasks(data) {
    const templateBox = taskTemplate.cloneNode(true);
    const templateBoxTitle = templateBox.querySelector('.backlog__box-name');
    const templateBoxText = templateBox.querySelector('.backlog__box-text');

    templateBoxTitle.innerText = data.subject;
    templateBoxText.innerText = data.description;

    return templateBox;
}

function renderItem(item) {
    backlogs.append(getTasks(item));
}

function renderTasks() {
    tasks.forEach(renderItem);
}