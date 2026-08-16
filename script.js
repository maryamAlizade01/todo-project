
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const toast = document.getElementById("toast");

const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");
const helpContent = document.querySelector(".help-content");


function showToast(message, showUndo = false) {

    toast.innerHTML = "";

    const messageText = document.createElement("span");
    messageText.textContent = message;

    toast.appendChild(messageText);

    if (showUndo) {

        const undoBtn = document.createElement("button");

        undoBtn.type = "button";
        undoBtn.textContent = "بازگردانی";
        undoBtn.classList.add("undo-btn");

        undoBtn.onclick = function () {

            if (!deletedTask) {
                return;
            }

            // برگرداندن Task به آرایه
            tasks.splice(deletedTaskIndex, 0, deletedTask);

            // ذخیره
            localStorage.setItem("tasks", JSON.stringify(tasks));

            // اضافه کردن دوباره به صفحه
            createTask(deletedTask);

            updateTaskCount();

            filterTasks(currentFilter);
            
            // بستن Toast
            toast.classList.remove("show");

            // پاک کردن اطلاعات
            deletedTask = null;
            deletedTaskIndex = null;

            clearTimeout(undoTimer);
        };

        toast.appendChild(undoBtn);
    }

    toast.classList.add("show");

    clearTimeout(undoTimer);

    undoTimer = setTimeout(function () {

        toast.classList.remove("show");

        deletedTask = null;
        deletedTaskIndex = null;

    }, 4000);
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let deletedTask = null;
    let deletedTaskIndex = null;
    let undoTimer = null;
    let currentFilter = "all";

    function updateTaskCount() {
    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remainingTasks;
}

function filterTasks(filter) {
    const taskRows = document.querySelectorAll(".task-row");

    taskRows.forEach(function (taskRow) {

        const task = taskRow.taskData;

        if (filter === "all") {
            taskRow.style.display = "flex";
        }

        else if (filter === "active") {
            taskRow.style.display = task.completed ? "none" : "flex";
        }

        else if (filter === "completed") {
            taskRow.style.display = task.completed ? "flex" : "none";
        }

    });
}
function searchTasks() {
    const searchText = searchInput.value.trim().toLowerCase();

    const taskRows = document.querySelectorAll(".task-row");

    taskRows.forEach(function (taskRow) {

        const task = taskRow.taskData;

        const matchesSearch = task.text.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        if (matchesSearch && matchesFilter) {
            taskRow.style.display = "flex";
        } else {
            taskRow.style.display = "none";
        }

    });
}
searchInput.addEventListener("input", function () {
    searchTasks();
});
filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        currentFilter = filter;

        searchTasks();
    });

});
function createTask(task) {

    

    // ساخت ردیف کار
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    taskRow.taskData = task;

    // ساخت کادر متن
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) {
    taskRow.classList.add("completed");
}

    // ساخت دکمه تیک
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✓";
    completeBtn.classList.add("completeBtn");
    // ساخت بخش گزینه‌ها
    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    // دکمه ویرایش
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.classList.add("editBtn");

    // دکمه حذف
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.classList.add("deleteBtn");


  // ویرایش تسک
    editBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    // ساخت input برای ویرایش
    const editInput = document.createElement("input");

    editInput.value = taskText.textContent;
    editInput.classList.add("edit-input");

    // جایگزین کردن متن با input
    taskText.replaceWith(editInput);

    // فوکوس روی input
    editInput.focus();

    // انتخاب کل متن
    editInput.select();

    // وقتی Enter زدیم
    editInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const newTask = editInput.value.trim();

            if (newTask !== "") {
                taskText.textContent = newTask;
                editInput.replaceWith(taskText);
            }
        }
    });

    // وقتی از input خارج شدیم
    editInput.addEventListener("blur", function () {

        const newTask = editInput.value.trim();

        if (newTask !== "") {
            taskText.textContent = newTask;
            editInput.replaceWith(taskText);
        }
    });

    taskRow.classList.remove("show-actions");
});


   // حذف تسک
    deleteBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    const taskIndex = tasks.indexOf(task);

    if (taskIndex === -1) {
        return;
    }

    deletedTask = task;
    deletedTaskIndex = taskIndex;

    tasks.splice(taskIndex, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskRow.remove();

    updateTaskCount();

    searchTasks();

    showToast("کار حذف شد ✓", true);
});



    // قرار دادن دکمه‌ها داخل بخش گزینه‌ها
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    // تیک زدن / برداشتن تیک
    completeBtn.addEventListener("click", function () {

    task.completed = !task.completed;

    taskRow.classList.toggle("completed");

    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateTaskCount();
});

    // قرار دادن متن داخل کادر
    li.appendChild(taskText);

    // قرار دادن دکمه و کادر کنار هم
    taskRow.appendChild(completeBtn);
    taskRow.appendChild(li);
    taskRow.appendChild(taskActions);

    // اضافه کردن به لیست
    taskList.appendChild(taskRow);

    // نگه داشتن روی تسک
    let pressTimer;

    taskRow.addEventListener("mousedown", function () {
         pressTimer = setTimeout(function () {
             taskRow.classList.toggle("show-actions");
         }, 600);
});

    taskRow.addEventListener("mouseup", function () {
         clearTimeout(pressTimer);
});

    taskRow.addEventListener("mouseleave", function () {
         clearTimeout(pressTimer);
});
// نگه داشتن روی تسک در موبایل
    taskRow.addEventListener("touchstart", function () {

    pressTimer = setTimeout(function () {

        taskRow.classList.toggle("show-actions");

    }, 600);
});

    taskRow.addEventListener("touchend", function () {
         clearTimeout(pressTimer);
});

}

addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("لطفاً یک کار را وارد کنید ...");
        return;
    }

    const newTask = {
        text: task,
        completed: false
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    createTask(newTask);

    updateTaskCount();

    searchTasks();

    showToast("کار با موفقیت اضافه شد ✓");

    taskInput.value = "";
    taskInput.focus();
});

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});


tasks.forEach(function (task) {
    createTask(task);
});

updateTaskCount();

// باز کردن راهنما
helpBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    helpModal.style.display = "flex";
});

// بستن با ضربدر
closeHelp.addEventListener("click", function (event) {
    event.stopPropagation();

    helpModal.style.display = "none";
});

// جلوگیری از بسته شدن وقتی داخل پنجره کلیک می‌کنیم
helpContent.addEventListener("click", function (event) {
    event.stopPropagation();
});

// بستن وقتی بیرون پنجره کلیک می‌کنیم
document.addEventListener("click", function () {
    if (helpModal.style.display === "flex") {
        helpModal.style.display = "none";
    }
});