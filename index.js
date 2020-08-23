// plus button to show input field for adding a task
const taskAddButton = document.getElementById("createOne");
// inputfield
const taskInput = document.getElementById("inputTask");
// create button
const taskCreate = document.getElementById("addTask");



// set a variables to localstorage to store tasks
if (localStorage.getItem('Tasks') == null) {
    var taskDetails = {};
} else {
    taskDetails = JSON.parse(localStorage.getItem('Tasks'));
    updateTask(taskDetails);
}

if (localStorage.getItem('DoingTasks') == null) {
    var doingTasks = {};
} else {
    doingTasks = JSON.parse(localStorage.getItem('DoingTasks'));
    updateDoingTask(doingTasks);
}

if (localStorage.getItem('DoneTasks') == null) {
    var doneTasks = {};
} else {
    doneTasks = JSON.parse(localStorage.getItem('DoneTasks'));
    updateDoneTask(doneTasks);
}
// show the input field and create button
taskAddButton.onclick = () => {
    if (taskInput.className != 'show' && taskCreate.className != 'show') {
        taskInput.className = 'taskinput show';
        taskCreate.className = 'createTask show';
        taskInput.focus();
    }
};

// add a new task and hide input field and create button 
taskCreate.onclick = () => {
    var inputvalue = taskInput.value;
    if (inputvalue == '') {
        alert("Please Insert Propare Task Name.");
    } else {
        var totaltasks = Object.keys(taskDetails).length + Object.keys(doingTasks).length + Object.keys(doneTasks).length;

        if (totaltasks != 0) {
            taskDetails['task' + (totaltasks + 1)] = [inputvalue, (totaltasks + 1)];

        } else {
            taskDetails['task1'] = [inputvalue, 1];
        }

        localStorage.setItem('Tasks', JSON.stringify(taskDetails));
        if (taskInput.className == 'taskinput show' && taskCreate.className == 'createTask show') {
            taskInput.className = 'taskinput';
            taskCreate.className = 'createTask';
            taskInput.value = "";
        }
    }
    updateTask(taskDetails);
}

// update the board content
function updateTask(taskDetails) {
    document.getElementById("displayallTasks").innerHTML = '';
    for (var item in taskDetails) {
        if (taskDetails[item][0].length >= 30) {
            var todoText = taskDetails[item][0].slice(0, 30) + "...";
        } else {
            todoText = taskDetails[item][0];
        }
        document.getElementById("displayallTasks").innerHTML += '<div class="taskcards" id="task' + taskDetails[item][1] + '" draggable="true" ondragstart="onDragStart(event);" ondragover="onDragOver(event);" ondragleave="onDragLeave(event);" ondragend="onDragEnd(event);" ondrop="onDropEl(event);"><span class="cardtext adjust-text" onclick="modalpop(this.parentElement.id)">' + todoText + '</span><a href="JavaScript:void(0);" id="removetask' + taskDetails[item][1] + '" class="close adjust-close" onclick="removeTask(this.id)">x</a></div>';
    }
}

function updateDoingTask(taskDetails) {
    document.getElementById("displayallDoingTasks").innerHTML = '';
    for (var item in taskDetails) {
        if (taskDetails[item][0].length >= 30) {
            var todoText = taskDetails[item][0].slice(0, 30) + "...";
        } else {
            todoText = taskDetails[item][0];
        }
        document.getElementById("displayallDoingTasks").innerHTML += '<div class="taskcards" id="task' + taskDetails[item][1] + '" draggable="true" ondragstart="onDragStart(event);" ondragover="onDragOver(event);" ondragleave="onDragLeave(event);" ondragend="onDragEnd(event);" ondrop="onDropEl(event);"><span class="cardtext adjust-text" onclick="modalpop(this.parentElement.id)">' + todoText + '</span><a href="JavaScript:void(0);" id="removetask' + taskDetails[item][1] + '" class="close adjust-close" onclick="removeTask(this.id)">x</a></div>';
    }
}

function updateDoneTask(taskDetails) {
    document.getElementById("displayallDoneTasks").innerHTML = '';
    for (var item in taskDetails) {
        if (taskDetails[item][0].length >= 30) {
            var todoText = taskDetails[item][0].slice(0, 30) + "...";
        } else {
            todoText = taskDetails[item][0];
        }
        document.getElementById("displayallDoneTasks").innerHTML += '<div class="taskcards" id="task' + taskDetails[item][1] + '" draggable="true" ondragstart="onDragStart(event);" ondragover="onDragOver(event);" ondragleave="onDragLeave(event);" ondragend="onDragEnd(event);" ondrop="onDropEl(event);"><span class="cardtext adjust-text" onclick="modalpop(this.parentElement.id)">' + todoText + '</span><a href="JavaScript:void(0);" id="removetask' + taskDetails[item][1] + '" class="close adjust-close" onclick="removeTask(this.id)">x</a></div>';
    }
}
// Drag and Drop cards
//----------------------------------------------------

var dragSrcEl = null;
function onDragStart(event) {
    event.currentTarget.style.opacity = '0.3';
    dragSrcEl = event.currentTarget;
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("over");
}

function onDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("over");
}

function onDragOverBox(event) {
    event.preventDefault();
}

function onDragLeaveBox(event) {
    event.preventDefault();
}

function onDragEnd(event) {
    var listItens = document.querySelectorAll('.taskcards');
    [].forEach.call(listItens, function (item) {
        item.classList.remove('over');
    });
    event.currentTarget.style.opacity = '1';
}

var insertBeforeEl = null;
var dragElParentId = null;
function onDrop(event, el) {
    const id = event
        .dataTransfer
        .getData('text');

    const draggableElement = document.getElementById(id);
    dragElParentId = draggableElement.parentNode.id;

    if (el.children.length > 0) {

        if (insertBeforeEl == el.children[0]) {
            el.insertBefore(draggableElement, el.firstElementChild.nextSibling);
            moveTaskToBox(el, dragElParentId);
        }
        else {
            let dragElIndex = Array.prototype.indexOf.call(draggableElement.parentNode.children, draggableElement);

            if (insertBeforeEl == null) {
                var targetElIndex = 0;
            } else {
                targetElIndex = Array.prototype.indexOf.call(insertBeforeEl.parentNode.children, insertBeforeEl);
            }

            if (targetElIndex == 0) {
                el.insertBefore(draggableElement, null);
                moveTaskToBox(el, dragElParentId);
                dragElParentId = null;
            }
            else if (dragElIndex > targetElIndex) {
                el.insertBefore(draggableElement, el.children[targetElIndex].nextSibling);
                moveTaskToBox(el, dragElParentId);
                dragElParentId = null;
            }
            else {
                if (draggableElement.parentNode.id != el.id) {
                    el.insertBefore(draggableElement, el.children[targetElIndex].nextSibling);
                    moveTaskToBox(el, dragElParentId);
                    dragElParentId = null;
                } else {
                    el.insertBefore(draggableElement, insertBeforeEl);
                    moveTaskToBox(el, dragElParentId);
                    dragElParentId = null;

                }
            }
        }
        insertBeforeEl = null;
    }
    else {
        el.insertBefore(draggableElement, null);
        moveTaskToBox(el, dragElParentId);
        dragElParentId = null;
    }
    event
        .dataTransfer
        .clearData();
}

// Dropping Task Cards and swap data
function onDropEl(event) {
    insertBeforeEl = event.currentTarget;
    if (dragSrcEl != event.currentTarget) {
        var targetEl = event.currentTarget.innerHTML;
        event.currentTarget.innerHTML = dragSrcEl.innerHTML;
        dragSrcEl.innerHTML = targetEl;
    }
}

function moveTaskToBox(targetbox, dragElParentId) {
    if (dragElParentId == "displayallTasks" && targetbox.id == "displayallDoingTasks") {
        let tItems = JSON.parse(localStorage.getItem('Tasks'));
        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            doingTasks[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        taskDetails = tItems;
        localStorage.setItem('Tasks', JSON.stringify(tItems));
        localStorage.setItem('DoingTasks', JSON.stringify(doingTasks));
        updateTask(tItems);
        updateDoingTask(doingTasks);

    }
    else if (dragElParentId == "displayallTasks" && targetbox.id == "displayallDoneTasks") {
        let tItems = JSON.parse(localStorage.getItem('Tasks'));
        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            doneTasks[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        taskDetails = tItems;
        localStorage.setItem('Tasks', JSON.stringify(tItems));
        localStorage.setItem('DoneTasks', JSON.stringify(doneTasks));
        updateTask(tItems);
        updateDoneTask(doneTasks);

    }
    else if (dragElParentId == "displayallDoingTasks" && targetbox.id == "displayallTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoingTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            taskDetails[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        doingTasks = tItems;
        localStorage.setItem('Tasks', JSON.stringify(taskDetails));
        localStorage.setItem('DoingTasks', JSON.stringify(tItems));
        updateTask(taskDetails);
        updateDoingTask(tItems);

    }
    else if (dragElParentId == "displayallDoingTasks" && targetbox.id == "displayallDoneTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoingTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            doneTasks[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        doingTasks = tItems;
        localStorage.setItem('DoneTasks', JSON.stringify(doneTasks));
        localStorage.setItem('DoingTasks', JSON.stringify(tItems));
        updateDoneTask(doneTasks);
        updateDoingTask(tItems);

    }
    else if (dragElParentId == "displayallDoneTasks" && targetbox.id == "displayallTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoneTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            taskDetails[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        doneTasks = tItems;
        localStorage.setItem('Tasks', JSON.stringify(taskDetails));
        localStorage.setItem('DoneTasks', JSON.stringify(tItems));
        updateTask(taskDetails);
        updateDoneTask(tItems);

    }
    else if (dragElParentId == "displayallDoneTasks" && targetbox.id == "displayallDoingTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoneTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {

            let childcard = targetbox.children[item].id;
            doingTasks[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];
            if (tItems[childcard]) {
                delete tItems[childcard];
            }
        }
        doneTasks = tItems;
        localStorage.setItem('DoingTasks', JSON.stringify(doingTasks));
        localStorage.setItem('DoneTasks', JSON.stringify(tItems));
        updateDoingTask(doingTasks);
        updateDoneTask(tItems);

    }
    else if (dragElParentId == "displayallTasks" && targetbox.id == "displayallTasks") {
        let tItems = JSON.parse(localStorage.getItem('Tasks'));

        for (let item = 0; item < targetbox.children.length; item++) {
            tItems[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];

        }
        taskDetails = tItems;
        localStorage.setItem('Tasks', JSON.stringify(tItems));
        updateTask(tItems);

    }
    else if (dragElParentId == "displayallDoingTasks" && targetbox.id == "displayallDoingTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoingTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {
            tItems[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];

        }
        doingTasks = tItems;
        localStorage.setItem('DoingTasks', JSON.stringify(tItems));
        updateDoingTask(tItems);

    }
    else if (dragElParentId == "displayallDoneTasks" && targetbox.id == "displayallDoneTasks") {
        let tItems = JSON.parse(localStorage.getItem('DoneTasks'));

        for (let item = 0; item < targetbox.children.length; item++) {
            tItems[targetbox.children[item].id] = [targetbox.children[item].innerText.slice(0, -1), targetbox.children[item].id.slice(4)];

        }
        doneTasks = tItems;
        localStorage.setItem('DoneTasks', JSON.stringify(tItems));
        updateDoneTask(tItems);

    }
}

// remove task  
function removeTask(taskid) {
    var tid = taskid.slice(6);
    var taskItems = JSON.parse(localStorage.getItem('Tasks'));
    var doingtaskItems = JSON.parse(localStorage.getItem('DoingTasks'));
    var donetaskItems = JSON.parse(localStorage.getItem('DoneTasks'));
    if (taskItems[tid]) {
        delete taskItems[tid];
        localStorage.setItem('Tasks', JSON.stringify(taskItems));
        taskDetails = taskItems;
        updateTask(taskItems);

    } else if (doingtaskItems[tid]) {
        delete doingtaskItems[tid];
        localStorage.setItem('DoingTasks', JSON.stringify(doingtaskItems));
        doingTasks = doingtaskItems;
        updateDoingTask(doingtaskItems);

    } else if (donetaskItems[tid]) {
        delete donetaskItems[tid];
        localStorage.setItem('DoneTasks', JSON.stringify(donetaskItems));
        doneTasks = donetaskItems;
        updateDoneTask(donetaskItems);

    }
}

// Clear the Board Data
function clearBoard() {
    localStorage.removeItem('Tasks');
    localStorage.removeItem('DoingTasks');
    localStorage.removeItem('DoneTasks');
    var tododata = JSON.parse(localStorage.getItem('Tasks'));
    var doingdata = JSON.parse(localStorage.getItem('Tasks'));
    var donedata = JSON.parse(localStorage.getItem('Tasks'));
    updateTask(tododata);
    updateDoingTask(doingdata);
    updateDoneTask(donedata);
    taskDetails = {};
    doingTasks = {};
    doneTasks = {};
}

//Editable title code
const editables = document.querySelector("[contenteditable]");

// save edits
editables.addEventListener("blur", () => {
    if (editables.innerHTML == "") {
        alert("Please Enter Valid Board Name");
    }
    localStorage.setItem("dataStorage-" + editables.id, editables.innerHTML);
    window.location.href = "";
});

// once on load
for (var key in localStorage) {
    if (key.includes("dataStorage-title")) {
        const id = key.replace("dataStorage-", "");
        if (localStorage.getItem(key) != "") {
            document.getElementById(id).innerHTML = localStorage.getItem(key);

        } else {
            document.getElementById(id).innerHTML = "Your Board";

        }
    }
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close-modal")[0];

function modalpop(modalId) {
    modal.style.display = "block";

    if (taskDetails[modalId]) {
        document.getElementById("modal-text").innerHTML = taskDetails[modalId][0];

    } else if (doingTasks[modalId]) {
        document.getElementById("modal-text").innerHTML = doingTasks[modalId][0];

    } else if (doneTasks[modalId]) {
        document.getElementById("modal-text").innerHTML = doneTasks[modalId][0];

    } else {
        document.getElementById("modal-text").innerText = "Something went wrong!";

    }
}

span.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


taskInput.addEventListener('keydown', autoresize);

function autoresize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}