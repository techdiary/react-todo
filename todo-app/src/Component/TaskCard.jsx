import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import dayjs from 'dayjs';
import { Box, Modal, Card, CardContent, CardActions, Button, Typography, TextField, FormGroup, Checkbox  } from '@mui/material'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const modalStyle = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '440px',
  height: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

const label = { inputProps: { 'aria-label': 'Fav' } };

const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));
  const [editMode, setEditMode] = useState(false)
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setMouseIsOver(false)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode(prev => !prev)
    setOpen(prev => !prev);
    setMouseIsOver(false)
  }

  if (isDragging) {
    return <Card ref={setNodeRef} style={style} variant="outlined"
          sx={{
            width: '120px',
            opacity: 0.8
          }}></Card>
  }

  // if (editMode) {
  //   return (
  //     <CardContent
  //       ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //     >
  //       <TextField
  //         value={task.content}
  //         autoFocus
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter" && e.shiftKey) {
  //             toggleEditMode();
  //           }
  //         }}
  //         onChange={(e) => updateTask(task.id, e.target.value)}
  //       />
  //     </CardContent>
  //   );
  // }

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card
          variant="outlined"
          sx={{
            margin: '4px',
            width: '240px',
          }}
        >
          <CardContent>
            <Typography variant="body2">{task.content}</Typography>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <Button size="small" onClick={toggleEditMode} color="warning">
                Edit
              </Button>
              <Button
                onClick={() => {
                  deleteTask(task.id)
                }}
                size="small"
                color="error"
              >
                Delete
              </Button>
            </Box>
          </CardActions>
        </Card>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <FormGroup>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Controlled picker"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </LocalizationProvider>
              <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{alignSelf: 'flex-end'}}/>
            </Box>
            <TextField
              required
              multiline
              label="Task Name"
              variant="filled"
              fullWidth
              size="small"
              value={task.content}
              autoFocus
              placeholder="Task content here"
              onChange={(e) => updateTask(task.id, e.target.value)}
              sx={{marginY: '8px'}}
            />
          </FormGroup>
          
        </Box>
      </Modal>
    </>
  )
}

export default TaskCard
