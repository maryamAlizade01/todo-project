
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("لطفاً یک کار را وارد کنید ...");
        return;
    }

    // ساخت ردیف کار
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    // ساخت کادر متن
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task;

    // ساخت دکمه تیک
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✓";
    completeBtn.classList.add("completeBtn");

    // تیک زدن / برداشتن تیک
    completeBtn.addEventListener("click", function () {
        taskRow.classList.toggle("completed");
    });

    // قرار دادن متن داخل کادر
    li.appendChild(taskText);

    // قرار دادن دکمه و کادر کنار هم
    taskRow.appendChild(completeBtn);
    taskRow.appendChild(li);

    // اضافه کردن به لیست
    taskList.appendChild(taskRow);

    // خالی کردن input
    taskInput.value = "";
    taskInput.focus();
})
