import React, { useCallback, useEffect, useRef, useState } from 'react'
import Task from './taskInfo'
import {GrEdit, GrReturn} from 'react-icons/gr'
import {AiTwotoneDelete} from 'react-icons/ai'
import './styles.css'
import { Draggable } from 'react-beautiful-dnd'

type Props = {
    index: number,
    task: Task,
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    importatTasks: Task[],
    setImportantTasks: React.Dispatch<React.SetStateAction<Task[]>>
    generalTasks: Task[],
    setGeneralTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const CompletedTask = ({index, task, tasks, setTasks, generalTasks, setGeneralTasks,
    importatTasks, setImportantTasks} : Props)  => {
    const [isEditClicked, setEditClicked] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(task.task);

    const backtrackTask = (id: number) => {
        tasks.forEach(() => {
          setImportantTasks(
            importatTasks.concat(
              tasks.filter((task) => task.id === id && task.type === 'important')
            )
          );
          
          setGeneralTasks(
            generalTasks.concat(
              tasks.filter((task) => task.id === id && task.type === 'general')
            )
          );
        });
    
        setTasks(tasks.filter((task) => task.id !== id));
    };
    
    const deleteTask = (id:number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    }

    const approveEdit = (e: React.FormEvent ,id:number) => {
        e.preventDefault();
        setTasks(tasks.map((task) => task.id === id?
         {...task, task:editText} : task));     
        
        setEditClicked(false)
        
    }

    const handleDoubleClick = () => {
        if (isEditClicked){
            setEditClicked(!isEditClicked);
        } else {
            setEditClicked(!isEditClicked);
        }
      }
    
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      inputRef.current?.focus();
    }, [isEditClicked])

    const handleClickOutside = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (inputRef.current && !inputRef.current.contains(target) && isEditClicked) {
          setEditClicked(false);
      }
    }, [isEditClicked, inputRef]);
  
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
            <form
                className={`single_task ${snapshot.isDragging ? "drag" : ""}`}
                onSubmit={(e) => approveEdit(e, task.id)}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                onDoubleClick={handleDoubleClick}
                >

                {isEditClicked ? (
                    <input
                    ref={inputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="single_task_text"
                    />
                ) : (
                    <span className="single_task_box">{task.task}</span>
                )}

                <div>

                    <span
                    className="icon"
                    onClick={() => {
                        if (isEditClicked) {
                        setEditClicked(!isEditClicked);
                        } else {
                        setEditClicked(!isEditClicked);
                        }
                    }}
                    >
                    <GrEdit />
                    </span>

                    <span className="icon" onClick={() => deleteTask(task.id)}>
                    <AiTwotoneDelete />
                    </span>

                    <span className="icon" onClick={() => backtrackTask(task.id)}>
                    <GrReturn />
                    </span>

                </div>
            </form>
        )}
    </Draggable>
  )
}
export default CompletedTask