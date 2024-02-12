import React, { useMemo, useState} from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove} from '@dnd-kit/sortable'
import {Button, Stack} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ColumnContainer from './ColumnContainer';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';
// import ColumnContainer from './ColumnContainer';

const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
    description: ""
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];


function KanbanBoard() {

  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => {
    console.log("MEMOING")
    return columns.map((col) => col.id)
  }, [columns]);

  const [tasks, setTasks] = useState(defaultTasks);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function onDragStart(event) {
    console.log(event);
    if (event.active.data.current?.type === "Column") {
      console.log("column drag: start")
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      console.log("task drag: start")
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    console.log("END DRAG")
    console.log(event)
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    console.log("OVER DRAG!!")
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function generateId() {
  /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
  }

  function createNewColumn () { 
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    }
    setColumns([...columns, columnToAdd]);
  }

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask (id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask (id, content)  {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function deleteColumn (id)  {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn (id, title)  {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  return (
    <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
    >
      <Stack direction="row" useFlexGap spacing={2}> 
        <Stack direction={"row"} useFlexGap spacing={2}>
          <SortableContext items={columnsId}>
            {columns.map( (col) => {
              return (<ColumnContainer 
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              )}
            )}
          </SortableContext>
        </Stack>
        <Button startIcon={<AddIcon/>} onClick={createNewColumn} size='small'>
          Add Column
        </Button>
      </Stack>
      {createPortal(<DragOverlay>
        {activeColumn && (
          <ColumnContainer
            column={activeColumn}
            deleteColumn={deleteColumn}
            updateColumn={updateColumn}
            createTask={createTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            tasks={tasks.filter(
              (task) => task.columnId === activeColumn.id
            )}
          />
        )}
        {activeTask && (
          <TaskCard
            task={activeTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        )}
      </DragOverlay>,document.body)}
        
    </DndContext>
  )
}

export default KanbanBoard