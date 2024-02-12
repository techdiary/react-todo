import React, { useMemo, useState } from 'react'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Paper, Box, Input, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import TaskCard from './TaskCard'

const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) => {
  const [editMode, setEditMode] = useState(false)

  const taskIds = useMemo(() => {
    console.log('MEMOINNGG task ids')
    return tasks.map(task => task.id)
  }, [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <Box
        ref={setNodeRef}
        style={style}
      ></Box>
    )
  }

  console.log('col')
  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        padding: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '280px',
        gap: 2,
      }}
    >
      {/* Column title */}
      <Box
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true)
        }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          maxHeight: '40px',
        }}
      >
        {!editMode && (
          <Typography variant="h6" justifySelf={'flex-end'}>
            {column.title}
          </Typography>
        )}
        {editMode && (
          <Input
            value={column.title}
            onChange={e => updateColumn(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false)
            }}
            onKeyDown={e => {
              if (e.key !== 'Enter') return
              setEditMode(false)
            }}
          />
        )}
        <Button
          onClick={() => {
            deleteColumn(column.id)
          }}
          sx={{
            alignSelf: 'baseline',
          }}
          size="small"
        >
          <DeleteIcon style={{ color: 'red' }} fontSize="small" />
        </Button>
      </Box>
      {/* Column Task Container */}
      
      <SortableContext items={taskIds}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
        ))}
      </SortableContext>
      {/* Column footer */}
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => createTask(column.id)}>
        Add Task
      </Button>
    </Paper>
  )
}

export default ColumnContainer
