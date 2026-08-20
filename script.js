
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryFilterButtons = document.querySelectorAll(".category-filter-btn");

const toast = document.getElementById("toast");

const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");
const helpContent = document.querySelector(".help-content");
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "☾";
    }
});
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☾";
}


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
    let currentCategory = "all";

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

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        let matchesCategory = true;

        if (currentCategory !== "all") {
            matchesCategory =
                task.category === currentCategory;
        }

        if (
            matchesSearch &&
            matchesFilter &&
            matchesCategory
        ) {
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
categoryFilterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        categoryFilterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

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
    const taskCategory = document.createElement("small");

if (task.category === "personal") {
    taskCategory.textContent = "شخصی";
}

if (task.category === "study") {
    taskCategory.textContent = "درس";
}

if (task.category === "work") {
    taskCategory.textContent = "کار";
}

taskCategory.classList.add("task-category", task.category);
    const taskDate = document.createElement("small");

if (task.createdAt) {

    const date = new Date(task.createdAt);

    const today = new Date();

    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const startOfDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const difference =
        (startOfToday - startOfDate) / (1000 * 60 * 60 * 24);

    const time = date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (difference === 0) {

        taskDate.textContent = "امروز - " + time;

    } else if (difference === 1) {

        taskDate.textContent = "دیروز - " + time;

    } else {

        taskDate.textContent =
            date.toLocaleDateString("fa-IR") +
            " - " +
            time;
    }
}
taskDate.classList.add("task-date");
    if (task.completed) {
    taskRow.classList.add("completed");
}

    // ساخت دکمه تیک
    const completeBtn = document.createElement("button");

    completeBtn.classList.add("completeBtn");
 
    if (task.completed) {
    completeBtn.textContent = "✓";
    }
    // ساخت بخش گزینه‌ها
    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    const deleteBtn = document.createElement("button");

    deleteBtn.innerHTML = "×";

    deleteBtn.classList.add("deleteBtn");

    const swipeDelete = document.createElement("button");

    swipeDelete.innerHTML = "🗑";
    swipeDelete.classList.add("swipe-delete");

    swipeDelete.addEventListener("click", function (event) {
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

    // دکمه ویرایش
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.classList.add("editBtn");


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


   taskActions.appendChild(editBtn);
   taskActions.appendChild(deleteBtn);

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

   
    // تیک زدن / برداشتن تیک
    completeBtn.addEventListener("click", function () {

    task.completed = !task.completed;

    if (task.completed) {
    completeBtn.textContent = "✓";
    } else {
    completeBtn.textContent = "";
    }

    taskRow.classList.toggle("completed");

    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateTaskCount();
});

    // قرار دادن متن داخل کادر
    const taskInfo = document.createElement("div");

    taskInfo.classList.add("task-info");

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskDate);
    taskInfo.appendChild(taskCategory);
    
    li.appendChild(taskInfo);

    // قرار دادن دکمه و کادر کنار هم
    taskRow.appendChild(completeBtn);
    taskRow.appendChild(li);
    taskRow.appendChild(taskActions);
    taskRow.appendChild(swipeDelete);

    let startX = 0;
let currentX = 0;

taskRow.addEventListener("touchstart", function (event) {

    startX = event.touches[0].clientX;
    currentX = startX;

}, { passive: true });


taskRow.addEventListener("touchmove", function (event) {

    currentX = event.touches[0].clientX;

    const distance = currentX - startX;

    // فقط کشیدن به سمت چپ
    if (distance < 0) {

        const move = Math.max(distance, -60);

        taskRow.style.transform = `translateX(${move}px)`;

        swipeDelete.style.display = "flex";
    }

});


taskRow.addEventListener("touchend", function () {

    const distance = currentX - startX;

    if (distance < -30) {

        taskRow.style.transform = "translateX(-60px)";

        swipeDelete.style.display = "flex";

    } else {

        taskRow.style.transform = "translateX(0)";

        swipeDelete.style.display = "none";
    }

});
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
    completed: false,
    createdAt: new Date().toISOString(),
    category: categoryInput.value
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