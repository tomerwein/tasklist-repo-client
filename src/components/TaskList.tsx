import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './taskInfo';
import CompletedTask from './CompletedTask';
import SingleTask from './SingleTask';

interface Props {
  importantTasks: Task[],
  setImportantTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  generalTasks: Task[],
  setGeneralTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  completedTasks: Task[],
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskList = ({
  importantTasks, setImportantTasks,
  generalTasks, setGeneralTasks,
  completedTasks, setCompletedTasks,
}: Props) => {
  return (
    <div className='container'>
      <Droppable droppableId='ImportantList'>
        {
          (provided, snapshot) => (
            <div className={`important_tasks ${snapshot.isDraggingOver ? "drag_important" : ""}`}
              ref={provided.innerRef}
              {...provided.droppableProps}>

              <span className='important_tasks_heading'>
                Important Tasks
              </span>

              {
                importantTasks?.map((task, index) => (
                  <SingleTask
                    key={task.id}
                    index={index}
                    task={task}
                    tasks={importantTasks}
                    setTasks={setImportantTasks}
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                  />
                ))
              }

              {provided.placeholder}

            </div>
          )
        }
      </Droppable>

      <Droppable droppableId='GeneralList'>
        {
          (provided, snapshot) => (

            <div className={`general_tasks ${snapshot.isDraggingOver ? "drag_general" : ""}`}
              ref={provided.innerRef}
              {...provided.droppableProps}>

              <span className='general_tasks_heading'>
                General Tasks
              </span>

              {
                generalTasks?.map((task, index) => (
                  <SingleTask
                    key={task.id}
                    index={index}
                    task={task}
                    tasks={generalTasks}
                    setTasks={setGeneralTasks}
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                  />
                ))
              }

              {provided.placeholder}

            </div>
          )
        }
      </Droppable>

      <Droppable droppableId='CompleteList'>
        {
          (provided, snapshot) => (
            <div className={`completed_tasks ${snapshot.isDraggingOver ? "drag_complete" : ""}`}
              ref={provided.innerRef}
              {...provided.droppableProps}>

              <span className='completed_tasks_heading'>
                Completed Tasks
              </span>

              {
                completedTasks?.map((task, index) => (
                  <CompletedTask
                    key={task.id}
                    index={index}
                    task={task}
                    tasks={completedTasks}
                    setTasks={setCompletedTasks}
                    importatTasks={importantTasks}
                    setImportantTasks={setImportantTasks}
                    generalTasks={generalTasks}
                    setGeneralTasks={setGeneralTasks}
                  />
                ))
              }

              {provided.placeholder}

            </div>
          )
        }
      </Droppable>
    </div>
  )
}

export default TaskList;