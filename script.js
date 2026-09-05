
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineDate = document.getElementById("deadlineDate");
const deadlineTime = document.getElementById("deadlineTime");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const priorityFilter = document.getElementById("priorityFilter");
const resetFilters = document.getElementById("resetFilters");
const sortInput = document.getElementById("sortInput");
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

            insertingTaskIndex = deletedTaskIndex;

            taskList.innerHTML = "";

            tasks.forEach(function (task) {
            createTask(task);
         });

            insertingTaskIndex = null; 
        

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
    let deletedTaskElement = null;
    let undoTimer = null;
    let insertingTaskIndex = null;

    let currentFilter = "all";
    let currentCategory = "all";

    let visibleTaskCount = 5;
    const tasksPerPage = 5;

    function updateTaskCount() {
    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    taskCount.textContent = completedTasks;
}
function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const progress = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    document.getElementById("progressText").textContent =
        completedTasks + " از " + totalTasks + " کار انجام شده";

    document.getElementById("progressPercent").textContent =
        progress + "%";

    document.getElementById("progressFill").style.width =
        progress + "%";
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
    updateShowMoreButton();
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

    if (task.originalIndex === undefined) {
    task.originalIndex = tasks.indexOf(task);
}

    taskRow.taskData = task;

    taskRow.draggable = true;
    
    taskRow.addEventListener("dragstart", function () {
    taskRow.classList.add("dragging");
});

taskRow.addEventListener("dragend", function () {

    taskRow.classList.remove("dragging");

    const newOrder = [];

    document.querySelectorAll(".task-row").forEach(function (row) {

        newOrder.push(row.taskData);

    });

    localStorage.setItem("tasks", JSON.stringify(newOrder));

    tasks = newOrder;
});

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
const taskPriority = document.createElement("small");

if (task.priority === "high") {
    taskPriority.textContent = "زیاد";
}

if (task.priority === "medium") {
    taskPriority.textContent = "متوسط";
}

if (task.priority === "low") {
    taskPriority.textContent = "کم";
}

taskPriority.classList.add(
    "task-priority",
    task.priority
);

const taskDeadline = document.createElement("small");

if (task.deadline) {

    const deadlineDate = new Date(task.deadline);
    const now = new Date();

    const difference =
        deadlineDate.getTime() - now.getTime();

    const oneHour = 60 * 60 * 1000;

    taskDeadline.classList.add("task-deadline");

    if (difference < 0) {

        taskDeadline.textContent = "🔴 منقضی شده";
        taskDeadline.classList.add("expired");

    } else {

        const totalMinutes =
            Math.ceil(difference / (60 * 1000));

        const days = Math.floor(totalMinutes / (60 * 24));

        const hours = Math.floor(
            (totalMinutes % (60 * 24)) / 60
        );

        const minutes =
            totalMinutes % 60;

        let remainingText = "";

        if (days > 0) {

            remainingText += days + " روز ";

        }

        if (hours > 0) {

            remainingText += hours + " ساعت ";

        }

        if (minutes > 0 && days === 0) {

            remainingText += minutes + " دقیقه ";

        }

        taskDeadline.textContent =
            "⏳ " +
            remainingText +
            "باقی مانده";

        if (difference <= oneHour) {

            taskDeadline.classList.add("soon");

        } else {

            taskDeadline.classList.add("normal");

        }
    }
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

    // دکمه سه نقطه
    const moreBtn = document.createElement("button");
    moreBtn.innerHTML = "⋮";
    moreBtn.classList.add("more-btn");

   // دکمه حذف
   const deleteBtn = document.createElement("button"); 
   deleteBtn.innerHTML = "×"; 
   deleteBtn.classList.add("deleteBtn"); 

    // دکمه حذف با Swipe
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
    updateProgress();
    updateReminder();
    updateStats();
    updateShowMoreButton();

    searchTasks();

    showToast("کار حذف شد ✓", true);
});

    // دکمه ویرایش
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.classList.add("editBtn");

    // دکمه پین
const pinBtn = document.createElement("button");

pinBtn.innerHTML = "📌";
pinBtn.classList.add("pinBtn");

// وضعیت اولیه پین
if (task.pinned) {
    pinBtn.classList.add("active");
}

pinBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    // =========================
    // PIN
    // =========================
    if (!task.pinned) {

        // ذخیره جای فعلی
        task.originalIndex = tasks.indexOf(task);

        // پین کردن
        task.pinned = true;

        // حذف از جای فعلی
        const index = tasks.indexOf(task);

        if (index !== -1) {
            tasks.splice(index, 1);
        }

        // قرار دادن در ابتدای لیست
        tasks.unshift(task);

    }

    // =========================
    // UNPIN
    // =========================
    else {

        task.pinned = false;

        // حذف از جای فعلی
        const index = tasks.indexOf(task);

        if (index !== -1) {
            tasks.splice(index, 1);
        }

        // جای قبلی
        let oldIndex = task.originalIndex;

        if (oldIndex === undefined || oldIndex > tasks.length) {
            oldIndex = tasks.length;
        }

        // برگرداندن به جای قبلی
        tasks.splice(oldIndex, 0, task);

        delete task.originalIndex;
    }

    // ذخیره
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // ظاهر پین
    pinBtn.classList.toggle("active", task.pinned);

    // بستن منوی سه نقطه
    taskActions.classList.remove("show-actions");

    // بازسازی لیست
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        createTask(task);
    });

    searchTasks();
});

    // کلیک روی سه نقطه
moreBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    // بستن منوی بقیه تسک‌ها
    document.querySelectorAll(".task-actions.show-actions").forEach(function (actions) {
        if (actions !== taskActions) {
            actions.classList.remove("show-actions");
        }
    });

    // باز / بسته کردن منوی همین تسک
    taskActions.classList.toggle("show-actions");
});


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

});


   taskActions.appendChild(moreBtn);
   taskActions.appendChild(editBtn);
   taskActions.appendChild(deleteBtn);
   taskActions.appendChild(pinBtn);
   
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
    updateProgress();
    updateReminder();
    updateStats();
});
    // قرار دادن متن داخل کادر
    const taskInfo = document.createElement("div");

    taskInfo.classList.add("task-info");

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskDate);
    taskInfo.appendChild(taskCategory);
    taskInfo.appendChild(taskPriority);
    taskInfo.appendChild(taskDeadline);
    
    li.appendChild(taskInfo);

    // قرار دادن دکمه و کادر کنار هم
    taskRow.appendChild(swipeDelete);
    taskRow.appendChild(completeBtn);
    taskRow.appendChild(li);
    taskRow.appendChild(taskActions);
    let startX = 0;
let currentX = 0;

taskRow.addEventListener("touchstart", function (event) {

    startX = event.touches[0].clientX;
    currentX = startX;

}, { passive: true });


taskRow.addEventListener("touchmove", function (event) {

    currentX = event.touches[0].clientX;

    const distance = currentX - startX;

    // فقط کشیدن به سمت راست
    if (distance > 0) {

        const move = Math.min(distance, 60);

        taskRow.style.transform = `translateX(${move}px)`;

        swipeDelete.style.display = "flex";
    }

});


taskRow.addEventListener("touchend", function () {

    const distance = currentX - startX;

    if (distance > 30) {

        taskRow.style.transform = "translateX(60px)";

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

    taskRow.addEventListener("mouseup", function () {
         clearTimeout(pressTimer);
});

    taskRow.addEventListener("mouseleave", function () {
         clearTimeout(pressTimer);
});
// نگه داشتن روی تسک در موبایل

    taskRow.addEventListener("touchend", function () {
         clearTimeout(pressTimer);
});

}

taskList.addEventListener("click", function (event) {

    const deleteBtn = event.target.closest(".deleteBtn");

    if (!deleteBtn) {
        return;
    }

    event.stopPropagation();

    const taskRow = deleteBtn.closest(".task-row");

    if (!taskRow) {
        return;
    }

    const task = taskRow.taskData;

    if (!task) {
        return;
    }

    const taskIndex = tasks.indexOf(task);

    if (taskIndex === -1) {
        return;
    }

    // ذخیره برای بازگردانی
    deletedTask = task;
    deletedTaskIndex = taskIndex;

    // حذف از آرایه
    tasks.splice(taskIndex, 1);

    // ذخیره در localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // حذف همان ردیف
    taskRow.remove();

    // آپدیت اطلاعات
    updateTaskCount();
    updateProgress();
    updateReminder();
    updateStats();
    updateShowMoreButton();

    searchTasks();

    showToast("کار حذف شد ✓", true);
});


function renderVisibleTasks() {

    taskList.innerHTML = "";

    const visibleTasks = tasks.slice(0, visibleTaskCount);

    visibleTasks.forEach(function (task) {
        createTask(task);
    });

    updateShowMoreButton();
}
function updateShowMoreButton() {

    const showMoreBtn = document.getElementById("showMoreBtn");

    if (!showMoreBtn) {
        return;
    }

    if (tasks.length <= 5) {

        showMoreBtn.style.display = "none";
        return;
    }

    showMoreBtn.style.display = "block";

    if (visibleTaskCount >= tasks.length) {

        showMoreBtn.textContent = "نمایش کمتر ↑";

    } else {

        showMoreBtn.textContent = "نمایش بیشتر ↓";
    }
}
document.getElementById("showMoreBtn").addEventListener("click", function () {

    if (visibleTaskCount >= tasks.length) {

        visibleTaskCount = 5;

    } else {

        visibleTaskCount += tasksPerPage;
    }

    renderVisibleTasks();

});

addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("لطفاً یک کار را وارد کنید ...");
        return;
    }
    let deadline = null;

if (deadlineDate.value || deadlineTime.value) {

    const now = new Date();

    let selectedDate = deadlineDate.value;
    const selectedTime = deadlineTime.value || "23:59";

    // اگر تاریخ وارد نشده، امروز را در نظر می‌گیریم
    if (!selectedDate) {

        selectedDate = now.toISOString().split("T")[0];

        // اگر ساعت انتخاب‌شده گذشته باشد، فردا را در نظر می‌گیریم
        if (deadlineTime.value) {

            const [hours, minutes] =
                deadlineTime.value.split(":");

            const deadlineToday = new Date();

            deadlineToday.setHours(
                Number(hours),
                Number(minutes),
                0,
                0
            );

            if (deadlineToday <= now) {

                const tomorrow = new Date(now);

                tomorrow.setDate(
                    tomorrow.getDate() + 1
                );

                selectedDate =
                    tomorrow.toISOString().split("T")[0];
            }
        }
    }

    deadline = selectedDate + "T" + selectedTime;
}
    const newTask = {
    text: task,
    completed: false,
    createdAt: new Date().toISOString(),
    category: categoryInput.value,
    priority: priorityInput.value,
    deadline: deadline
};

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    createTask(newTask);

    updateTaskCount();
    updateShowMoreButton();
    updateProgress();
    updateReminder();
    updateStats();

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
taskList.addEventListener("dragover", function (event) {

    event.preventDefault();

    const draggingTask = document.querySelector(".dragging");

    if (!draggingTask) {
        return;
    }

    const rows = [
        ...taskList.querySelectorAll(".task-row:not(.dragging)")
    ];

    let nextTask = null;

    for (const row of rows) {

        const box = row.getBoundingClientRect();

        if (event.clientY < box.top + box.height / 2) {
            nextTask = row;
            break;
        }
    }

    if (nextTask) {

        if (nextTask.previousElementSibling !== draggingTask) {
            taskList.insertBefore(draggingTask, nextTask);
        }

    } else {

        if (taskList.lastElementChild !== draggingTask) {
            taskList.appendChild(draggingTask);
        }
    }

});
function updateReminder() {

    const reminderBox = document.getElementById("reminderBox");

    if (!reminderBox) {
        return;
    }

    const now = new Date();

    const upcomingTasks = tasks
        .filter(function (task) {
            return task.deadline && !task.completed;
        })
        .map(function (task) {

            return {
                task: task,
                timeLeft:
                    new Date(task.deadline).getTime() -
                    now.getTime()
            };

        })
        .filter(function (item) {

            return item.timeLeft > 0 &&
                   item.timeLeft <= 60 * 60 * 1000;

        })
        .sort(function (a, b) {

            return a.timeLeft - b.timeLeft;

        });

    if (upcomingTasks.length === 0) {

        reminderBox.style.display = "none";
        reminderBox.textContent = "";

        return;
    }

    const nearest = upcomingTasks[0];

    const minutes = Math.ceil(
        nearest.timeLeft / (60 * 1000)
    );

    reminderBox.textContent =
        "🔔 مهلت «" +
        nearest.task.text +
        "» تا " +
        minutes +
        " دقیقه دیگر است.";

    reminderBox.style.display = "block";
}
updateReminder();
updateStats();

setInterval(function () {
    updateReminder();
}, 60000);

function updateStats() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const remainingTasks = totalTasks - completedTasks;

    document.getElementById("totalStat").textContent = totalTasks;

    document.getElementById("completedStat").textContent =
        completedTasks;

    document.getElementById("remainingStat").textContent =
        remainingTasks;
}

function applyFilter() {

    const statusValue = statusFilter.value;
    const categoryValue = categoryFilter.value;
    const priorityValue = priorityFilter.value;

    const rows = document.querySelectorAll(".task-row");

    rows.forEach(function (row) {

        const task = row.taskData;

        if (!task) {
            return;
        }

        let showTask = true;

        if (statusValue === "active" && task.completed) {
            showTask = false;
        }

        if (statusValue === "completed" && !task.completed) {
            showTask = false;
        }

        if (
            categoryValue !== "all" &&
            task.category !== categoryValue
        ) {
            showTask = false;
        }

        if (
            priorityValue !== "all" &&
            task.priority !== priorityValue
        ) {
            showTask = false;
        }

        row.style.display = showTask ? "" : "none";
    });
}
statusFilter.addEventListener("change", applyFilter);
categoryFilter.addEventListener("change", applyFilter);
priorityFilter.addEventListener("change", applyFilter);

function applySort() {

    const sortValue = sortInput.value;

    tasks.sort(function (a, b) {

        if (sortValue === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }

        if (sortValue === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortValue === "priority") {

    const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1
    };

    // اولویت بالاتر اول
    const priorityDifference =
        priorityOrder[b.priority] -
        priorityOrder[a.priority];

    if (priorityDifference !== 0) {
        return priorityDifference;
    }

    // داخل یک اولویت، انجام‌نشده‌ها اول
    if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
    }

    return 0;
}
        if (sortValue === "deadline") {

            if (!a.deadline) return 1;
            if (!b.deadline) return -1;

            return new Date(a.deadline) -
                   new Date(b.deadline);
        }

        return 0;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskList.innerHTML = "";

const visibleTasks = tasks.slice(0, visibleTaskCount);

visibleTasks.forEach(function (task) {
    createTask(task);
});

applyFilter();
updateShowMoreButton();
}
sortInput.addEventListener("change", function () {
    applySort();
});
resetFilters.addEventListener("click", function () {

    statusFilter.value = "all";
    categoryFilter.value = "all";
    priorityFilter.value = "all";
    sortInput.value = "newest";

    applySort();
    applyFilter();
});
updateShowMoreButton();
let lastScrollY = window.scrollY;
let indicatorLength = 7;

window.addEventListener("scroll", function () {

    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    const indicator = document.querySelector(".task-list-wrapper");

    if (!indicator) {
        return;
    }

    // اسکرول به پایین
    if (scrollDifference > 0) {

        indicatorLength += scrollDifference;

    }

    // اسکرول به بالا
    else if (scrollDifference < 0) {

        indicatorLength += scrollDifference;
    }

    // حداقل اندازه = نقطه
    if (indicatorLength < 7) {
        indicatorLength = 7;
    }

    // حداکثر اندازه
    const maxLength = indicator.offsetHeight;

    if (indicatorLength > maxLength) {
        indicatorLength = maxLength;
    }

    indicator.style.setProperty(
        "--indicator-length",
        indicatorLength + "px"
    );

    lastScrollY = currentScrollY;
});