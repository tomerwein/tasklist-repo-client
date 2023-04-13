import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Input from './components/Input';
import Task from './components/taskInfo';
import TaskList from './components/TaskList';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import SignIn from './SignIn';

// const UPDATE_URL: string = 'http://localhost:8080/update-tasks';
const UPDATE_URL: string =`${process.env.REACT_APP_API_URL}/update-tasks`;

interface Props {
  username: string,
  importantTasks: Task[],
  setImportantTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  generalTasks: Task[],
  setGeneralTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  completedTasks: Task[],
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskManager = ({
  username,
  importantTasks, setImportantTasks,
  generalTasks, setGeneralTasks,
  completedTasks, setCompletedTasks,
}: Props) => {
    const [task, setTask] = useState<string>("");
    const [dragFinished, setDragFinished] = useState<boolean>(false);
    const [logout, setLogout] = useState<boolean>(false);
    
    const updateLocalStorage = useCallback(() => {
      localStorage.setItem("loggedInUser", JSON.stringify({
        username: username,
        importantTasks: importantTasks,
        generalTasks: generalTasks,
        completedTasks: completedTasks
      }));
    }, [username, importantTasks, generalTasks, completedTasks]); 

    const handleUpdateTaskListsInDataBase = useCallback(async () => {
      try {
        const response = await fetch(UPDATE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: username,
            important_tasks: importantTasks,
            general_tasks: generalTasks,
            completed_tasks: completedTasks,
          }),
        });
  
        const data = await response.json();
  
        if (response.status === 200) {
          updateLocalStorage();
        } else {
          console.error(`Error updating tasks: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, [importantTasks, generalTasks, completedTasks, username, updateLocalStorage]);
  
    useEffect(() => {
      handleUpdateTaskListsInDataBase();
      if (dragFinished) {
        setDragFinished(false);
      }
    }, [importantTasks, generalTasks, completedTasks, dragFinished, handleUpdateTaskListsInDataBase]);
    
    const addToImportantList = async (e: React.FormEvent) => {
      e.preventDefault();
      if (task){
        setImportantTasks([...importantTasks, {id: Date.now(), task: task, type: "important", isDone: false}]);
        setTask("");
      } 
    }
  
    const addToGeneralList = async (e: React.FormEvent) => {
      e.preventDefault();
      if (task){
        setGeneralTasks([...generalTasks, {id: Date.now(), task: task, type: "general", isDone: false}]);
        setTask("");
      } 

    }
  
    const onDragEnd = (result: DropResult) => {
      const {source, destination} = result;
      setDragFinished(true);
      
      if (!destination) return;
  
      if (
        source.index === destination.index && 
        source.droppableId === destination.droppableId
      )
        return;
  
      let add,
        important = importantTasks,
        general = generalTasks,
        complete = completedTasks;
  
      if (source.droppableId === 'ImportantList'){
        add = important[source.index];
        important.splice(source.index, 1);
      } else if (source.droppableId === 'GeneralList'){
        add = general[source.index];
        general.splice(source.index, 1)
      } else {
        add = complete[source.index];
        complete.splice(source.index, 1)
      }
  
      if (destination.droppableId === 'ImportantList'){
        add.type = "important";
        important.splice(destination.index, 0, add)
      } else if (destination.droppableId === 'GeneralList'){
        add.type = "general";
        general.splice(destination.index, 0, add)
      } else { 
        complete.splice(destination.index, 0, add) 
      }
  
     setImportantTasks(important); 
     setGeneralTasks(general);
     setCompletedTasks(complete);
    }
  
    return (
      logout ? <SignIn/> :
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="App">
            <span className="heading"> Task Manager </span>
            <div className='logout_container'>
              <span className="username"> {username} </span>
              
              <button className='logout' 
              onClick={() => {setLogout(true);
                localStorage.removeItem("loggedInUser");
                }}>
                Logout
              </button>
            </div>

          <Input task={task} setTask={setTask}
           addToImportantList={addToImportantList} 
           addToGeneralList={addToGeneralList} />
          
          <TaskList
            importantTasks={importantTasks}
            setImportantTasks={setImportantTasks}
            generalTasks={generalTasks}
            setGeneralTasks={setGeneralTasks}
            completedTasks={completedTasks}
            setCompletedTasks={setCompletedTasks}
          />
        
        </div>
      </DragDropContext>
    );
  };

export default TaskManager