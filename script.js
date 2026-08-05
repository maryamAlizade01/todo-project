const taskInput = 
document.getElementById("taskInput");
const addBtn =
document.getElementById("addBtn");
const taskList =
document.getElementById("taskList");

addBtn.addEventListener("click" , function(){

    const task = taskInput.value.trim();

    if(task === ""){
        alert('لطفا یک کار را وارد کنید ...');
        return;
    }
    const li = document.createElement("li");
    li.textContent = task;
    taskList.appendChild(li);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "حذف";
    deleteBtn.addEventListener("click" , function(){
        li.remove();
    });
    li.appendChild(deleteBtn);

    taskInput.value = "";
    taskInput.focus();
});



