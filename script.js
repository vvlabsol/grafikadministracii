const administrator = document.getElementById("administrator");
const dateInput = document.getElementById("schedule-date");
const counter = document.querySelector(".selected-counter strong");
const scheduleDate = document.querySelector(".schedule-header p");
const resetButton = document.getElementById("reset-button");

const buttons = document.querySelectorAll(".select-button");

let selectedIntervals = {};


// =========================
// ПАРОЛЬ ДЛЯ СБРОСА
// =========================

const RESET_PASSWORD = "12345";


// =========================
// КЛЮЧ ХРАНИЛИЩА
// =========================

function getStorageKey() {
    return `schedule_${dateInput.value}`;
}


// =========================
// ДАТА
// =========================

function updateDateText() {

    const date = new Date(dateInput.value + "T00:00:00");

    const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    scheduleDate.textContent = formattedDate + " года";
}


// =========================
// ВМЕСТИМОСТЬ ИНТЕРВАЛОВ
// =========================

function getOriginalCapacity(button) {

    const interval = button.dataset.interval;


    if (interval === "06:00-08:00") {
        return 2;
    }


    if (interval === "08:00-11:00") {
        return 3;
    }


    if (interval === "11:00-13:00") {
        return 4;
    }


    if (interval === "13:00-16:00") {
        return 4;
    }


    if (interval === "16:00-19:00") {
        return 4;
    }


    if (interval === "19:00-21:00") {
        return 5;
    }


    if (interval === "21:00-00:00") {
        return 3;
    }


    if (interval === "00:00-02:00") {
        return 3;
    }


    return 3;
}


// =========================
// ЗАГРУЗКА ГРАФИКА
// =========================

function loadSchedule() {

    const saved = localStorage.getItem(getStorageKey());

    selectedIntervals = saved ? JSON.parse(saved) : {};


    buttons.forEach(button => {

        const interval = button.dataset.interval;

        const block = button.closest(".time-block");

        const adminsContainer = block.querySelector(".admins");

        const capacity = block.querySelector(".capacity");

        const max = getOriginalCapacity(button);


        adminsContainer.innerHTML = "";


        if (selectedIntervals[interval]) {

            selectedIntervals[interval].forEach(admin => {

                const adminElement = document.createElement("span");

                adminElement.className = "admin";

                adminElement.textContent = admin;

                adminsContainer.appendChild(adminElement);

            });


            const current = selectedIntervals[interval].length;

            capacity.textContent = `${current} / ${max}`;


            if (current >= max) {

                button.textContent = "Заполнено";

                button.classList.add("full");

                button.disabled = true;

            } else {

                button.textContent = "Выбрать";

                button.classList.remove("full");

                button.disabled = false;

            }

        } else {

            capacity.textContent = `0 / ${max}`;


            const free = document.createElement("span");

            free.className = "free";

            free.textContent = `Свободно ${max} мест`;

            adminsContainer.appendChild(free);


            button.textContent = "Выбрать";

            button.classList.remove("full");

            button.disabled = false;

        }

    });


    updateCounter();

    updateDateText();
}


// =========================
// СЧЕТЧИК
// =========================

function updateCounter() {

    let count = 0;


    Object.values(selectedIntervals).forEach(admins => {

        count += admins.length;

    });


    counter.textContent = count;
}


// =========================
// ВЫБОР ИНТЕРВАЛА
// =========================

buttons.forEach(button => {

    button.addEventListener("click", function () {

        const admin = administrator.value;


        if (!admin) {

            alert("Сначала выберите администратора.");

            return;
        }


        const interval = this.dataset.interval;


        if (!selectedIntervals[interval]) {

            selectedIntervals[interval] = [];

        }


        if (selectedIntervals[interval].includes(admin)) {

            alert("Этот администратор уже выбран на данный интервал.");

            return;
        }


        const maxCapacity = getOriginalCapacity(this);


        if (selectedIntervals[interval].length >= maxCapacity) {

            alert("На этом интервале уже нет свободных мест.");

            return;
        }


        selectedIntervals[interval].push(admin);


        localStorage.setItem(
            getStorageKey(),
            JSON.stringify(selectedIntervals)
        );


        loadSchedule();

    });

});


// =========================
// ИЗМЕНЕНИЕ ДАТЫ
// =========================

dateInput.addEventListener("change", function () {

    loadSchedule();

});


// =========================
// СБРОС ГРАФИКА
// =========================

resetButton.addEventListener("click", function () {

    const password = prompt(
        "Введите пароль для сброса графика:"
    );


    if (password === null) {
        return;
    }


    if (password !== RESET_PASSWORD) {

        alert("Неверный пароль.");

        return;
    }


    const confirmReset = confirm(
        "Вы действительно хотите полностью сбросить график на выбранную дату?"
    );


    if (!confirmReset) {
        return;
    }


    localStorage.removeItem(getStorageKey());

    selectedIntervals = {};


    loadSchedule();


    alert(
        "График на " +
        new Date(dateInput.value + "T00:00:00").toLocaleDateString("ru-RU") +
        " успешно сброшен."
    );

});


// =========================
// ЗАПУСК
// =========================

loadSchedule();
