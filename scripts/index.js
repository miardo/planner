const taskTemplate = document.querySelector('.task__template').content;
const backlogs = document.querySelector('.backlog__elements');

const userTemplate = document.querySelector('.user__template').content;
const calendar = document.querySelector('.calendar__users');
const calendarDate = document.querySelectorAll('.calendar__date')
const calendarWeek = document.querySelector('.calendar__users')

const previousWeekBtn = document.getElementById('previous-week-button');
const nextWeekBtn = document.getElementById('next-week-button');

const dateStart = new Date("2021-01-01");
const dateEnd = new Date("2022-01-01");

const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
let day = Math.floor(diff / oneDay);
let currentWeek = Math.floor(day / 7);

let dateArray = [];
let users = [];
let tasks = [];

var dragged;

function pad(s) {
    return ('00' + s).slice(-2)
}

while (dateStart.getTime() < dateEnd.getTime()) {
    dateArray.push('' + dateStart.getFullYear() + '-' + pad(dateStart.getMonth() + 1) + '-' + pad(dateStart.getDate()));
    dateStart.setDate(dateStart.getDate() + 1);
}

function renderDate(date) {
    for (let i = 0; i < 7; i++) {
        let currentDate = date[day + i];
        let dayDate = currentDate.slice(8, 10);
        let monthDate = currentDate.slice(5, 7);
        calendarDate[i].innerText = dayDate + "." + monthDate;
    }
    calendarWeek.id = 'week-' + currentWeek;
}

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

function getUsers(data) {
    const templateBox = userTemplate.cloneNode(true);
    const templateBoxUserId = templateBox.querySelector('.calendar__user')
    const templateBoxUser = templateBox.querySelector('.calendar__user-name');
    const templateBoxTask = templateBox.querySelectorAll('.calendar__task');

    templateBoxUserId.id = data.id
    templateBoxUser.innerText = data.firstName;

    for (let i = 0; i < templateBoxTask.length; i++) {
        templateBoxTask[i].id = data.username + "-" + dateArray[day + i];
    }

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
    const templateBoxBlock = templateBox.querySelector('.backlog__box');
    const templateBoxTitle = templateBox.querySelector('.backlog__box-name');
    const templateBoxText = templateBox.querySelector('.backlog__box-text');
    const templateBoxTaskText = templateBox.querySelector('.backlog__box-task-text');
    const taskIndex = tasks.indexOf(data) + 1;

    templateBoxBlock.setAttribute("data-info", data.subject);
    templateBoxBlock.setAttribute("data-start-date", data.planStartDate);
    templateBoxBlock.id = data.id;
    templateBoxTitle.innerText = data.subject;
    templateBoxText.innerText = data.description;
    templateBoxTaskText.innerText = "Задача (" + taskIndex + ")";
    templateBoxTaskText.style.display = "none";

    if (data.executor > 0) {
        templateBoxTitle.classList.add(`backlog__box_hidden`)
        templateBoxText.classList.add(`backlog__box_hidden`)
        templateBoxBlock.classList.add(`backlog__box_selected`);
        templateBoxBlock.setAttribute("data-task-week", currentWeek);
        templateBoxTaskText.style.display = "flex";
    }

    return templateBox;
}

function renderItem(item) {
    const taskId = document.getElementById(item.id);
    const taskPlace = document.getElementById('user' + item.executor + '-' + item.planStartDate);
    if (item.executor > 0 && !taskId && taskPlace) {
        taskPlace.append(getTasks(item));
    } else if (item.executor <= 0 && !taskId) {
        backlogs.append(getTasks(item));
    }
}

function renderTasks() {
    tasks.forEach(renderItem);
}

function rerenderDate() {
    const calendarUsers = document.querySelectorAll('.calendar__user');
    for (let i = 0; i < calendarUsers.length; i++) {
        let calendarUsersTask = calendarUsers[i].querySelectorAll('.calendar__task')
        for (let j = 0; j < calendarUsersTask.length; j++) {
            calendarUsersTask[j].id = 'user' + calendarUsers[i].id + "-" + dateArray[day + j];
        }
    }
}

function hiddenTasks() {
    const currentBacklogs = document.querySelectorAll('.backlog__box[data-task-week="'+currentWeek+'"]')
    for (let i = 0; i < currentBacklogs.length; i++) {
        currentBacklogs[i].classList.add(`backlog__box_hidden`)
    }
}

function unhiddenTasks() {
    const currentBacklogs = document.querySelectorAll('.backlog__box[data-task-week="'+currentWeek+'"]')
    for (let i = 0; i < currentBacklogs.length; i++) {
        currentBacklogs[i].classList.remove(`backlog__box_hidden`)
    }
}

previousWeekBtn.addEventListener("mousedown", (event) => {
    event.preventDefault();
    hiddenTasks()
    day = day - 7;
    currentWeek = currentWeek - 1;
    renderDate(dateArray);
    rerenderDate();
    unhiddenTasks()
    renderTasks();
})

nextWeekBtn.addEventListener("mousedown", (event) => {
    event.preventDefault();
    hiddenTasks()
    day = day + 7;
    currentWeek = currentWeek + 1;
    renderDate(dateArray);
    rerenderDate();
    unhiddenTasks()
    renderTasks();
})

document.addEventListener("drag", function (event) {
}, false);

document.addEventListener("dragstart", function (event) {
    dragged = event.target;
    event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function (event) {
    event.target.style.opacity = "";
}, false);

document.addEventListener("dragover", function (event) {
    event.preventDefault();
}, false);

document.addEventListener("dragenter", function (event) {
    if (event.target.className == "calendar__task") {
        event.target.style.background = "#CFFFCA";
    } else if (event.target.className == "backlog__elements") {
        event.target.style.border = "dashed 4px #999999";
    }
}, false);

document.addEventListener("dragleave", function (event) {
    if (event.target.className == "calendar__task") {
        event.target.style.background = "";
    } else if (event.target.className == "backlog__elements") {
        event.target.style.border = "";
    }
}, false);

document.addEventListener("drop", function (event) {
    event.preventDefault();
    const draggedBoxTitle = dragged.querySelector('.backlog__box-name');
    const draggedBoxText = dragged.querySelector('.backlog__box-text');
    const draggedBoxTaskText = dragged.querySelector('.backlog__box-task-text');
    const currentTask = document.getElementById('user' + event.target.parentElement.id + '-' + dragged.getAttribute("data-start-date"));

    if (event.target.className == "calendar__task") {
        event.target.style.background = "";
        dragged.parentNode.removeChild(dragged);

        dragged.classList.add(`backlog__box_selected`);
        draggedBoxTitle.classList.add(`backlog__box_hidden`)
        draggedBoxText.classList.add(`backlog__box_hidden`)
        draggedBoxTaskText.style.display = "flex";
        dragged.setAttribute("data-task-week", currentWeek);

        event.target.appendChild(dragged);

    } else if (event.target.className == "backlog__elements") {
        event.target.style.border = "";
        dragged.parentNode.removeChild(dragged);

        dragged.classList.remove(`backlog__box_selected`);
        draggedBoxTitle.classList.remove(`backlog__box_hidden`)
        draggedBoxText.classList.remove(`backlog__box_hidden`)
        draggedBoxTaskText.style.display = "none";
        dragged.setAttribute("data-task-week", "");

        event.target.appendChild(dragged);

    } else if (event.target.className == "calendar__user-name" && currentTask) {
        dragged.parentNode.removeChild(dragged);

        dragged.classList.add(`backlog__box_selected`);
        draggedBoxTitle.classList.add(`backlog__box_hidden`)
        draggedBoxText.classList.add(`backlog__box_hidden`)
        draggedBoxTaskText.style.display = "flex";

        currentTask.appendChild(dragged);
    }
}, false);

renderDate(dateArray)