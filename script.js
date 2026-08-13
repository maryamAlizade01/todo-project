
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const touchHint = document.querySelector(".touch-hint");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function createTask(task) {

    // ساخت ردیف کار
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

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

        taskRow.remove();
});


    // قرار دادن دکمه‌ها داخل بخش گزینه‌ها
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    // تیک زدن / برداشتن تیک
    completeBtn.addEventListener("click", function () {

    task.completed = !task.completed;

    taskRow.classList.toggle("completed");

    localStorage.setItem("tasks", JSON.stringify(tasks));
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

        if (touchHint) {
            touchHint.classList.add("hide");

            setTimeout(function () {
                touchHint.style.display = "none";
            }, 400);
        }

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

    taskInput.value = "";
    taskInput.focus();
});


tasks.forEach(function (task) {
    createTask(task);
});

    