let todolist = [];
let doneTasks = [];
let id = 0;
let audio = new Audio('src/ding-sound-effect.mp3');

class Task{
    constructor(name, desc, id){
        this.name = name;
        this.desc = desc;
        this.id = id ;
    }
}
loadData();
verifyTasks();

function loadData(){
    let dataString = localStorage.getItem("data");
    let dataString2 = localStorage.getItem("data2");
    if(dataString ){
        todolist = JSON.parse(dataString);
        updateList();
    }

    if(dataString2){
        doneTasks = JSON.parse(dataString2);
        updateDoneList();
    }

}
//abrir modal
function openModal(){
    let modal = document.querySelector(".modal");
    let shadow = document.querySelector(".shadow");
    modal.style.display = "block";
    shadow.style.display = "block";
    setTimeout(()=> modal.style.opacity = 100, 50);
    
}
// fechar modal
function closeModal(){
    let modal = document.querySelector(".modal");
    let shadow = document.querySelector(".shadow");
    modal.style.opacity = 0;
    shadow.style.display ="none";
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
    
}
function verifyTasks(){
    if(todolist.length == 0){
        document.querySelector(".todoList").innerHTML = "<h3 style='color:white'> Nenhuma tarefa :)</h3>";
    }
}


//clicou em mandar task
document.querySelector(".addTaskButton").addEventListener("click",()=>{
    let name = document.querySelector(".name-desc input");
    let desc = document.querySelector(".name-desc textarea");
    addTask(name.value,desc.value);
    name.value = "";
    desc.value = "";

});
// adiciona a task na lista
function addTask(name,desc){
    
    if(name != ""){
        let t = new Task(name, desc,id);
        id++;
        todolist.push(t);
        updateList();
        saveData();
        name = ""; 
        desc = "";
        closeModal();
    }else{
        alert("Por favor, nomeie sua tarefa");
    }
}

// atualiza a lista de tarefas na tela
function updateList(){
    let listArea = document.querySelector(".todoList");
    let listhtml = createTaskHTML(todolist);
    listArea.innerHTML = listhtml;
}

function createTaskHTML(array){
    let listhtml = "";
    array.map((item,index)=>{
        listhtml += `
        <div id="task-${index}" class = "taskblock">
            <div class="upper">
                <div class="done-name">
                    <i class='bx bx-circle' onclick="markAsDone(${index}, 'todoList')"></i>
                    <input id="input-${index}" class="name-task readonlytrue" readonly  value = "${item.name}"/>
                </div>
                
                <div class="edit-delete"><i class='bx bxs-edit' onclick="updateTask(${index})"></i> <i onclick="deleteTask(${index}, 'todoList')" class='bx bxs-x-circle' ></i></div>
            </div>
            <div>
                <div>
                <textarea readonly="true" class = "desc-text readonlytrue">${item.desc}</textarea>
                </div>
            </div>
        </div>
        `;
    })

    return listhtml;
}

function deleteTask(index, targetList) {
    if (targetList == "todoList") {
        todolist.splice(index, 1);
        updateList();
    } else if (targetList == "doneTasks") {
        doneTasks.splice(index, 1);
        updateDoneList();
    }
    verifyTasks();
    saveData();
}
function updateTask(index) {
    let input = document.querySelector(`#task-${index} .name-task`);
    let textArea = document.querySelector(`#task-${index} .desc-text`);
    let icon = document.querySelector(`#task-${index} .edit-delete .bx`);
 
    if(input.classList.contains("readonlytrue")){

        input.classList.remove("readonlytrue");
        input.removeAttribute("readonly");
        textArea.classList.remove("readonlytrue");
        textArea.removeAttribute("readonly");
        icon.classList.remove("bx-bxs-edit");
        icon.classList.add("bxs-save");
    }else{
        todolist[index].name = input.value;
        todolist[index].desc = textArea.value;
        saveData();
        updateList();
    }

}
function markAsDone(index,targetList){
   audio.currentTime = 0;
   audio.play();
    if(targetList =="todoList"){
        doneTasks.push(todolist[index]);
        deleteTask(index,"todoList");
    }else{
        todolist.push(doneTasks[index]);
        deleteTask(index,"doneTasks");
    }
    
    saveData();
    updateDoneList();
    updateList();
    verifyTasks();
    
    
}

function updateDoneList(){
    let doneTaskArea = document.querySelector(".doneList"); 
    let listHTML = "";
    doneTasks.map((item,index)=>{
        listHTML += `
        <div id="task-${index}" class = "doneTaskblock">
            <div class="upper">
                <div class="done-name"> 
                <i onclick="markAsDone(${index}, 'doneTasks')" class='bx bx-check-circle'></i><input id="input-${index}" class="name-task readonlytrue" readonly  value = "${item.name}"/>
                </div>
                <i  class='bx bxs-x-circle' onclick="deleteTask(${index}, 'doneTasks')" ></i>
            </div>
            <div>
                <div>
                <textarea readonly="true" class = "desc-text readonlytrue">${item.desc}</textarea>
                </div>
            </div>
        </div>
        `;
    });
    doneTaskArea.innerHTML = listHTML;
}

function saveData(){
    let dataString = JSON.stringify(todolist);
    let dataString2 = JSON.stringify(doneTasks);
    localStorage.setItem("data",dataString);
    localStorage.setItem("data2",dataString2);
}

function showDoneTasks(){
    let doneTaskArea = document.querySelector(".doneList");
    let button = document.querySelector(".showDoneTaskButton");
    if(doneTaskArea.classList.contains("noView")){
        button.textContent = "Close Done Tasks"
    }else{
        button.textContent = "Show Done Tasks"
    }
    doneTaskArea.classList.toggle("noView");
}
