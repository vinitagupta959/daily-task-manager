let emptyContainer=document.getElementById('emptyContainer');
let emptyAddbutton=document.getElementById('emptyButton');
let taskAddingContainer=document.getElementById('taskAdding');
let title=document.getElementById('title');
let description=document.getElementById('description');
let saveButton=document.getElementById('saveButton');
let updateButton=document.getElementById('updateButton');
let cancelButton=document.getElementById('cancelButton');
let alltaskContainer=document.getElementById('alltasks');
let filterContainer=document.getElementById('filter');
let addTaskButton=document.getElementById('addTask');
let noTaskContainer=document.getElementById('noTaskContainer');
let noTaskDiv=document.getElementById('noTask');
  

// initilise taskList array else we get localStorage
let taskList;
if(localStorage.getItem('taskList')==null){
    taskList=[];
     
}else{
    taskList=JSON.parse(localStorage.getItem('taskList'));
    console.log(taskList);
}
let todayTask;
if (localStorage.getItem('TodayTask') == null || localStorage.getItem('TodayTask') == undefined) {
    todayTask = [];
} else {
    todayTask = JSON.parse(localStorage.getItem('TodayTask'));
    console.log(todayTask);
}
let completedTasks;
if (localStorage.getItem('CompletedTask') == null || localStorage.getItem('CompletedTask') == undefined) {
    completedTasks = [];
} else {
    completedTasks = JSON.parse(localStorage.getItem('CompletedTask'));
    console.log(completedTasks);
}
showTasks();
function showTasks() {
    daywise();
    if (todayTask.length > 0) {
        displayTasks(todayTask);
        filterContainer.style.display = "block";
        alltaskContainer.style.display = "block";
        noTaskContainer.style.display = "none";
    } else if (taskList.length > 0) {
        displayTasks(taskList);
        filterContainer.style.display = "block";
        noTaskContainer.style.display = "block";
        emptyContainer.style.display = "none";
    } else {
        emptyContainer.style.display = "block";
        noTaskContainer.style.display="none";
        alltaskContainer.style.display = "none";
        filterContainer.style.display = "none";
    }
}



emptyAddbutton.addEventListener('click',function(){
    emptyContainer.style.display='none';
    taskAddingContainer.style.display='block';
   
});

cancelButton.addEventListener('click',function(){
    taskAddingContainer.style.display='none';
    resetContainer();
    showTasks();
});



addTaskButton.addEventListener('click',function(){
    taskAddingContainer.style.display='block';
    saveButton.style.display="block";
    updateButton.style.display="none"
    alltaskContainer.style.display="none"
})




// save button click event when we  click in save button in taskAddingContainer
saveButton.addEventListener('click',function(){
    let titleValue=title.value.trim();
    let descriptionValue=description.value.trim();
    let priorityValue=selectPriority();
    let repeatValue=selectRepeat();
    let dueDateValue=takeCustomdate();
    // validation
    if (titleValue==''){
        alert('Please enter title');
        return;
    }
    //if title is exist in taskList
    for(let i=0;i<taskList.length;i++){
        if(taskList[i].title==titleValue){
            alert('Title is already exist');
            return;
        }
    }

    if (descriptionValue==""){
        descriptionValue="No Description"
    }
    if (priorityValue==undefined){
        alert('Please select priority');
        return;
    }
    
    if (repeatValue == undefined && dueDateValue == "") {
        alert('Please select either Repeat or Due Date');
        return;
    }

    // creating object of task
    let task={
        title:titleValue,
        description:descriptionValue,
        priority:priorityValue,
        repeat:repeatValue,
        dueDate:dueDateValue,
        completed:false
    };

    // adding task to taskList
    taskList.push(task);
    localStorage.setItem('taskList',JSON.stringify(taskList));
    emptyContainer.style.display='none';
    taskAddingContainer.style.display='none';
    filterContainer.style.display="block"
    alert('Task is added');
    console.log(taskList);
    daywise();
    showTasks();
    noTaskContainer.style.display="none";
    resetContainer();

});


function selectPriority(){
    let priority=document.getElementsByName('priority');
    for(let i=0;i<priority.length;i++){
        if(priority[i].checked){
            return priority[i].value;
        }
    }
}

function selectRepeat(){
    let repeat=document.getElementsByName('repeat');
    for(let i=0;i<repeat.length;i++){
        if(repeat[i].checked){
            return repeat[i].value;
        }
    }
}

 

// take custom date
   
function takeCustomdate() {
    console.log("vini");
    let dateInput = document.getElementById('customDate').value;
    console.log(dateInput);
    
    let selectedDate = new Date(dateInput);
    let today = new Date();
    if (selectedDate < today) {
        alert('Please select a valid future date');
        dateInput.value = ""; 
        return;
    }else{
        return dateInput;
    }
}

// DISPLAY TASKS
function displayTasks(taskList){
    alltaskContainer.style.display='block';
    alltaskContainer.innerHTML="";

    for (let i=0; i<taskList.length; i++){
        let task=taskList[i]
        let taskClass="";
        let buttonTxt="";

        // change the txt or className
        if (task.completed){
            taskClass="completedTask";
            buttonTxt="Completed"
        }else{
            taskClass="complete-btn"
            buttonTxt="Mark as Completed"
        }
        let repeatTxt = "Repeat";
        let repeatValue = task.repeat;
        let duedatevalue = task.dueDate;

        if (!task.repeat) {   
            repeatTxt = "Due Date";
            repeatValue = duedatevalue;
        }

        console.log(repeatTxt, repeatValue);

        alltaskContainer.innerHTML+=`<div class="taskItem">
            <h2 id="taskTitle">${task.title}</h2>
            <p id="taskDescription" class="task-desc">${task.description}</p>
            <p"><strong>Priority : </strong>${task.priority}</p>
            <p"><strong>${repeatTxt} : </strong>${repeatValue}</p>
            <div id=buttons>
            <button class="${taskClass}" onclick="completeTask(${i})">${buttonTxt}</button>
            <button class="edit-btn" onclick="editTask(${i})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${i})">Delete</button>
            </div>
            </div>
            `
    }

noTaskContainer.style.display="none";
}


 
function completeTask(index){
    todayTask[index].completed = true;
    todayTask[index].completedAt = Date.now();
    completedTasks.push(todayTask[index]);
    localStorage.setItem('CompletedTask', JSON.stringify(completedTasks));
    localStorage.setItem('TodayTask', JSON.stringify(todayTask));
    displayTasks(todayTask);
 }   
    
function removeCompletedTask(index){
    completedTasks=JSON.parse(localStorage.getItem('CompletedTask'));
    let currentTiime=Date.now();
    let fortyEightHours=48*60*60*1000;
    let completedTask=completedTasks.filter(function(task){
        if (task.completedAt>fortyEightHours){
            return task;
        }
    });
    localStorage.setItem('CompletedTask',JSON.stringify(completedTask));
}


// Edit task function
function editTask(index){
    let task=taskList[index];
    // give task value which is alady givee for edit
    title.value=task.title;
    description.value=task.description;
    
    let priority=document.getElementsByName('priority');
    for(let i=0; i<priority.length; i++){
        if(priority[i].value==task.priority){
            priority[i].checked=true;
        }
    }

    let repeat=document.getElementsByName('repeat');
    for (let i=0; i<repeat.length; i++){
        if (repeat[i].value==task.repeat){
            repeat[i].checked=true;
        }
    }

    updateButton.style.display="block";
    updateButton.onclick=function(){
        updateTask(index);
    }
   
    taskAddingContainer.style.display="Block"
    saveButton.style.display="none"
    alltaskContainer.style.display="none"
    taskAddingContainer.appendChild(updateButton);
 

}


function updateTask(index){
    let task=taskList[index];
    task.title=title.value;
    task.description=description.value;
    task.priority=selectPriority();
    if (task.priority=='Custom'){
        repeatValue=takeCustomdate();
    }
    task.repeat=selectRepeat();
    localStorage.setItem("taskList",JSON.stringify(taskList));
    localStorage.setItem('TodayTask',JSON.stringify(todayTask));
    localStorage.setItem('CompletedTask',JSON.stringify(completedTasks));
    taskAddingContainer.style.display="none";
    alltaskContainer.style.display="block";
    displayTasks(taskList);
    console.log(task);
    saveButton.style.display="block";
    updateButton.style.display = "none"; 
    resetContainer();
   
}

// Delete Button function
function deleteTask(index){
    taskList.splice(index,1);    // splice method allow to remove and add the element in array.  isme hum jo index hai vha se only ek hi elemet remove kar rhe hai means only vhi item if agr hum vha 3 likhte to index se do element
    localStorage.setItem('taskList',JSON.stringify(taskList));
    localStorage.setItem('TodayTask',JSON.stringify(todayTask));
    localStorage.setItem('CompletedTask',JSON.stringify(completedTasks));
    console.log(taskList);
    if (taskList.length === 0) {
       showTasks();
    } else {
        displayTasks(taskList);
    }
}





// filter feture.
let priorityButton=document.getElementById('priority');
let completedButton=document.getElementById('completed');
let pendingButton=document.getElementById('pending');
let dueDateButton=document.getElementById('dueDate');
let alltaskButton=document.getElementById('alltask');

priorityButton.addEventListener('click', function(){
    priorityTask();
})

completedButton.addEventListener('click',function(){
    console.log(completedTasks);
    showCompletedTasks();
});

pendingButton.addEventListener('click', function(){
    pendingTask();
});
dueDateButton.addEventListener('click',function(){
    dueDateTask();
});
alltaskButton.addEventListener('click',function(){
    allTaskFilter();
});
function allTaskFilter(){
    displayTasks(taskList);
    taskAddingContainer.style.display="none";
 }

 function priorityTask(){
    let byPriority=[];
    byPriority=taskList.filter(function(task){
        if (task.priority==="High" && task.completed==false){
            return task
        }
    });
    for(let i=0 ;i<taskList.length; i++){
        if (taskList[i].priority==="Medium" && taskList[i].completed==false){
            byPriority.push(taskList[i]);
        }
    }

    for(let j=0; j<taskList.length; j++){
        if (taskList[j].priority==="Low" && taskList[j].completed==false){
            byPriority.push(taskList[j]);
        }
    }

    if (byPriority.length>0){
        displayTasks(byPriority);
        noTaskContainer.style.display="none";
        }else{
             noTaskContainer.style.display="block";
        alltaskContainer.style.display="none"
            alert('No task'); 
        }
    taskAddingContainer.style.display="none";
 };

function showCompletedTasks(){
    console.log(completedTasks);
    if (completedTasks.length>0){
        displayTasks(completedTasks);
        noTaskContainer.style.display="none";
        }else{
             noTaskContainer.style.display="block";
        alltaskContainer.style.display="none"
        alert("No completed tasks!");
        }
        taskAddingContainer.style.display="none";
 };

 function pendingTask(){
    let pending=[];
    pending=taskList.filter(function(task){
        if(!task.completed){
            return task
        }
    })
    if (pending.length>0){
    displayTasks(pending);
    noTaskContainer.style.display="none";
    }else{
         noTaskContainer.style.display="block";
        alltaskContainer.style.display="none"
        alert('No task');
       
    }
    taskAddingContainer.style.display="none";
 };




// //  due date ko build karna hai
//  function dueDateTask(){
//     let dueDate=[];
//     dueDate=taskList.filter(function(task){
//         let value=task.repeat;
//         if (value=="Daily"){
//             dueDate(push)
//         } 
//     });
//     let today=new Date();
//     if (value!=="Daily" && value!="Weekend" && value!=="Weekdays" && value!=="Not reapeat"){
//         if (today<value){
//             dueDate(push)
//         }
//     }
//     dueDate.sort(function(a, b) {
//         let dateA = new Date(a.repeat); 
//         let dateB = new Date(b.repeat); 

         
//         return dateA - dateB;  
//     });
     
//     if (dueDate.length>0){
//         displayTasks(dueDate);
//         noTaskContainer.style.display="none";
//         }else{
//              noTaskContainer.style.display="block";
//         alltaskContainer.style.display="none"
//             alert('No task'); 
//         }
//         taskAddingContainer.style.display="none";
//  }


function dueDateTask(){
    let today = new Date();
    let day = today.getDay();  // 0 (Sunday) to 6 (Saturday)
    let upcomingTasks = [];

    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];

        // ✅ 1. Daily Tasks (हर रोज आते हैं)
        if (task.repeat === "Daily") {
            upcomingTasks.push(task);
        }

        // ✅ 2. Weekdays Tasks (Monday - Friday)
        else if (task.repeat === "Weekdays" && day >= 1 && day <= 5) {
            upcomingTasks.push(task);
        }

        // ✅ 3. Weekend Tasks (Saturday & Sunday)
        else if (task.repeat === "Weekend" && (day === 6 || day === 0)) {
            upcomingTasks.push(task);
        }

        // ✅ 4. Specific Date-Based Tasks (जो future में हैं)
        else if (task.dueDate) {
            let taskDate = new Date(task.dueDate);
            if (taskDate >= today) {
                upcomingTasks.push(task);
            }
        }
    }

    // ✅ 5. UI में Upcoming Tasks को Show करना
    if (upcomingTasks.length > 0) {
        displayTasks(upcomingTasks);
        noTaskContainer.style.display = "none";
    } else {
        noTaskContainer.style.display = "block";
        alltaskContainer.style.display = "none";
        alert("No upcoming due tasks!");
    }
    taskAddingContainer.style.display = "none";
}






// Day  wise task
function daywise(){
    let today=new Date().toDateString();
    let day=new Date().getDay();
    let newtask=[];
    // let weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    // let Weekend=["Saturday","Sunday"];

    for (let i = 0; i < taskList.length; i++) {
        if (!taskList[i].completed) {
            if (taskList[i].repeat == "Daily") {
                newtask.push(taskList[i]);
            } else if (taskList[i].repeat == today) {
                newtask.push(taskList[i]);
            } else if (taskList[i].repeat == "Weekdays" && day >= 1 && day <= 5) {
                newtask.push(taskList[i]);
            } else if (taskList[i].repeat == "Weekend" && (day === 6 || day === 0)) {
                newtask.push(taskList[i]);
            }
        }
    }
    
    
    localStorage.setItem('CompletedTask', JSON.stringify(completedTasks));
    localStorage.setItem('TodayTask', JSON.stringify(newtask));
    displayTasks(newtask);
    if (todayTask.length > 0) {
        displayTasks(todayTask);
        noTaskContainer.style.display = "none";
    } else {
        noTaskContainer.style.display = "block";
        alltaskContainer.style.display = "none";
        noTaskDiv.innerText = "No Task for Today";
    }
    
    
}

 

//  reset container for input filed
 function resetContainer() {
    title.value = "";
    description.value = "";
    
    
    let priority = document.getElementsByName('priority');
    for (let i = 0; i < priority.length; i++) {
        priority[i].checked = false;
    }

    let repeat=document.getElementsByName('repeat');
    for(let i=0;i<repeat.length;i++){
        repeat[i].checked=false
    }
 }