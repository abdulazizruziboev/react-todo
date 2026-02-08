import { ArchiveIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function App() {
function addSubmit(evt) {
evt.preventDefault(); 
let emptyInputs=[]; 
evt.target.querySelectorAll("[data-required='true']").forEach(el=>{
  if(el.value.trim()=='') emptyInputs.push(el.name);
});
if(emptyInputs.length!=0) {
  toastAdder({
    id:Date.now(),
    text: `Please fill ${emptyInputs[0]}`,
    type: "info"
  });
  evt.target.querySelector(`[name='${emptyInputs[0]}']`).focus();
} else {
  const result = {}; 
  new FormData(evt.target).forEach((val,key)=>{
    result[key]=val;
  });
  result['id']=Date.now();  
  if(localStorage.getItem("todo-list")) {
    let o = JSON.parse(localStorage.getItem("todo-list"));
    o.push(result);
    localStorage.setItem("todo-list",JSON.stringify(o))
  } else {
    localStorage.setItem("todo-list",JSON.stringify([result]));
  }
  addModalClose();
  evt.target.reset();
  toastAdder({
    id:Date.now(),
    text: `Todo added successfully`,
    type: "success"
  });
}}
let [addModalState,addModalStateChanger]=useState(false); 
function addModalOpen() {
  addModalStateChanger(true);
} function addModalClose() {
  addModalStateChanger(false);
}

let [editModalState,editModalStateChanger]=useState(false); 
function editModalClose() {
  editModalStateChanger(false);
}

let [editID,editIDChanger] = useState(null);

let [deleteID,deleteIDChange] = useState(null);

function deleteIDChanger(id) {
  deleteIDChange(id);
}

let [deleteModalState,deleteModalStateChanger]=useState(false); 
function deleteModalClose() {
  deleteModalStateChanger(false);
}

function deleteToDo(id) {
  deleteIDChanger(id);
  deleteModalStateChanger(true)
}

function deleteToDoSure () {
  let o = JSON.parse(localStorage.getItem("todo-list"));
  localStorage.setItem("todo-list",
    JSON.stringify(o.filter(el=>{
      if(el.id==deleteID) return false;
      else return true;
    }))
  );
  deleteModalClose();
  toastRemover([]);
  toastAdder({
    id:Date.now(),
    text: `ToDo deleted`,
    type: "success"
  });
}

let [editFillState,editFillStateChanger] = useState({
  title:null,
  description:null,
  status:null
});

function editToDo(id) {
editIDChanger(id);
let data = JSON.parse(localStorage.getItem("todo-list")).filter(el=>{
  if(el.id==id) return el;
}
);
editFillStateChanger({
  title:data[0].title,
  description:data[0].description,
  status:data[0].status
})
editModalStateChanger(true);
}

function TodoList() {
  if(localStorage.getItem("todo-list")) {
    let data = JSON.parse(localStorage.getItem("todo-list"));
  if(data.length!=0) {
    return (
    data.map((el)=>{
      return (
        <div key={el.id} className="flex justify-between border-1 px-4 py-3 rounded-[10px] border-[#0003]">
          <div className="flex flex-col">
            <span className="text-[22px]">{el.title?el.title:"No title"}</span>
            <span className="text-[16px] opacity-75 break-all">{el.description?el.description:"No description"}</span>
            <span className="text-[12px] opacity-50">#{el.status?el.status:"no_status"}</span>
          </div>
          <div className="flex flex-col justify-end gap-3 text-end">
            <button className="text-amber-500 cursor-pointer leading-none text-end leading-none hover:opacity-80 hover:underline transition-all duration-300" onClick={()=>editToDo(el.id)}>Edit</button>
            <button className="text-red-500 cursor-pointer leading-none text-end leading-none hover:opacity-80 hover:underline transition-all duration-300" onClick={()=>deleteToDo(el.id)}>Delete</button>
          </div>
        </div>
      )
    })
    );
  } else {
    return (
      <div className="flex items-center justify-center text-center py-4 flex-col text-zinc-500 h-[80vh]">
        <ArchiveIcon width="90px" height="90px"/>
        <span className="text-[18px]">ToDo list is empty! <br /> Please add New Todo</span>
      </div>
    )
  }
  } else {
    return (
      <div className="flex items-center justify-center text-center py-4 flex-col text-zinc-500  h-[80vh]">
        <ArchiveIcon width="90px" height="90px"/>
        <span className="text-[18px]">ToDo list is empty! <br /> Please add New Todo</span>
      </div>
    )
  }
};

function editSubmit(evt) {
evt.preventDefault(); 
let emptyInputs=[]; 
evt.target.querySelectorAll("[data-required='true']").forEach(el=>{
  if(el.value.trim()=='') emptyInputs.push(el.name);
});
if(emptyInputs.length!=0) {
  alert(`Please fill ${emptyInputs[0]}`);
  evt.target.querySelector(`[name='${emptyInputs[0]}']`).focus();
} else {
  const result = {}; 
  new FormData(evt.target).forEach((val,key)=>{
    result[key]=val;
  });
  result['id']=editID;
  let o = JSON.parse(localStorage.getItem("todo-list"));
  let n = o.map(el=>{
    if(el.id==editID) return result;
    else return el;
  });
  localStorage.setItem("todo-list",JSON.stringify(n))
  editModalClose();
  evt.target.reset();
  toastAdder({
    id:Date.now(),
    text: `ToDo edited successfully`,
    type: "success"
  });
}}

let [toastList, toastListChanger] = useState([]);

function toastAdder(data) {
  toastList.push(data);
  toastListChanger([...toastList]);
  setTimeout(()=>toastRemover(),2500);
};

function toastRemover() {
  toastList.pop()
  toastListChanger([]);
  toastListChanger([]);
}

function toasWriter () {
return toastList.map(el=>{
        let bg = "";
        switch (el.type) {
          case "info":
            bg="#0284C780";
            break;
          case "success":
            bg="#15803D80";
            break;
          case "error":
            bg="#BE123C80";
            break;
          default:
            bg="dodgerblue"
            break;
        }
        return <div key={el.id} className="max-w-[375px] min-w-[300px] min-h-[50px] flex items-center justify-center px-3 rounded-[500px] text-center text-white backdrop-blur-3xl border-1 border-[#FFFFFF40]" style={{
          backgroundColor: bg 
        }}>
          {el.text?el.text:"Error....."}
        </div>
      })
}

return (
    <>
    <div className="fixed top-0 right-0 min-h-20 py-3 px-4 flex items-center justify-end gap-y-3 flex-col z-50 w-full pointer-events-none">
      {toasWriter()}
    </div>
    <header className="flex items-center justify-center min-h-[80px] border-b-1 border-b-[#ddd] px-8 rounded-[0px_0px_40px_40px] sticky top-0 backdrop-blur-sm z-3">
      <div className="max-w-[1440px] w-full flex justify-between items-center">
        <a href="/" className="text-[]">ToDo App</a>
        <button className="px-3 py-1.5 rounded-[8px] cursor-pointer bg-blue-500 text-white hover:bg-blue-700 duration-300 transition-colors" onClick={addModalOpen}>
         <span className="fa fa-plus pointer-events-none"></span> Add ToDo`s
        </button>
      </div>
    </header>
    <main className="px-8 py-5">
      <div className="flex flex-col gap-y-5 py-1 max-w-[1440px] mx-auto">
        <TodoList/>
      </div>
    </main>
    {/* Modals */}
    {/* AddModal */}
    <div className='fixed inset-0 justify-center items-center h-full w-full px-6 z-10' 
    style={{display: addModalState==true?"flex":"none"}}>
      <div className='fixed inset-0 h-screen w-screen bg-[#ffffff31] z-10 backdrop-blur-xl' onClick={addModalClose}>
      </div>
      <form onSubmit={addSubmit} className='flex flex-col justify-between outline-none max-w-[460px] w-full border-1 z-20 rounded-[8px] border-[#0005] bg-[#f0f0f061] backdrop-blur-2xl'>
      <div className='border-b-1 w-full py-3 px-3 border-[#0005]'>
        <span>Add new ToDo</span>
      </div>
      <div className='flex justify-start items-center px-3 py-3 flex-col gap-y-3'>
        <input type="text" name='title' className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] focus:border-blue-500' placeholder='Please add title' data-required="true"/>
        <select name="status" defaultValue="active" className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] cursor-pointer focus:border-blue-500'>
          <option value="active">active</option>
          <option value="pending" >pending</option>
          <option value="completed" >completed</option>
        </select>
        <textarea name='description' className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] focus:border-blue-500' placeholder='Please add description' data-required="true" />
      </div>
      <div className='border-t-1 w-full py-3 px-3 border-[#0005] flex justify-between px-4'>
        <button type='button' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300  hover:bg-[#fff] border-[#6f6f6f] text-[#6f6f6f]' onClick={addModalClose}>Cancel</button>
        <button type='submit' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300 bg-blue-500 border-blue-500 text-white hover:bg-blue-400'>Add</button>
      </div>
      </form>
    </div>
    {/* Edit modal */}
    <div className='fixed inset-0 justify-center items-center h-full w-full px-6 z-10' 
    style={{display: editModalState==true?"flex":"none"}}>
      <div className='fixed inset-0 h-screen w-screen bg-[#ffffff31] z-10 backdrop-blur-xl' onClick={editModalClose}>
      </div>
      <form onSubmit={editSubmit} className='flex flex-col justify-between outline-none max-w-[460px] w-full border-1 z-20 rounded-[8px] border-[#0005] bg-[#f0f0f061] backdrop-blur-2xl'>
      <div className='border-b-1 w-full py-3 px-3 border-[#0005]'>
        <span>Edit ToDo</span>
      </div>
      <div className='flex justify-start items-center px-3 py-3 flex-col gap-y-3'>
        <input type="text" name='title' className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] focus:border-blue-500' placeholder='Please add title' data-required="true" defaultValue={editFillState.title} />
        <select name="status" defaultValue={editFillState.status}  
        className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] focus:border-blue-500 cursor-pointer'>
          <option value="active">active</option>
          <option value="pending" >pending</option>
          <option value="completed" >completed</option>
        </select>
        <textarea name='description' className='border-1 outline-none px-2.5 py-2 rounded-[6px] w-full border-[#0005] focus:border-blue-500' placeholder='Please add description' data-required="true" defaultValue={editFillState.description} />
      </div>
      <div className='border-t-1 w-full py-3 px-3 border-[#0005] flex justify-between px-4 z-10'>
        <button type='button' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300  hover:bg-[#fff] border-[#6f6f6f] text-[#6f6f6f]' onClick={editModalClose}>Cancel</button>
        <button type='submit' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300 bg-blue-500 border-blue-500 text-white hover:bg-blue-400'>Edit</button>
      </div>
      </form>
    </div>
    {/* Delete modal */}
    <div className='fixed inset-0 justify-center items-center h-full w-full px-6 z-10' 
    style={{display: deleteModalState==true?"flex":"none"}}>
      <div className='fixed inset-0 h-screen w-screen bg-[#ffffff31] z-10 backdrop-blur-xl' onClick={deleteModalClose}>
      </div>
      <div className='flex flex-col justify-between outline-none  max-w-[460px] w-full border-1 z-20 rounded-[8px] border-[#0005] bg-[#f0f0f061] backdrop-blur-2xl'>
      <div className='border-b-1 w-full py-3 px-3 border-[#0005]'>
        <span>Delete ToDo</span>
      </div>
      <div className='flex justify-start items-center px-3 py-3 flex-col gap-y-3'>
       <span className="w-full">You realy delete this ToDo</span>
      </div>
      <div className='border-t-1 w-full py-3 px-3 border-[#0005] flex justify-between px-4'>
        <button type='button' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300  hover:bg-[#fff] border-[#6f6f6f] text-[#6f6f6f]' onClick={deleteModalClose}>Cancel</button>
        <button type='submit' className='border-1 px-5 py-1.5 rounded-[8px] cursor-pointer transition-colors duration-300 bg-[#ff5258] border-[#ff5258] text-white hover:bg-red-500' onClick={deleteToDoSure}>Delete</button>
      </div>
      </div>
    </div>
    </>
)
}
