import {Box} from '@mui/material'
import KanbanBoard from './Component/KanbanBoard'

export default function App() {


  return (
    <Box maxWidth="lg" sx={{
      marginTop: 4,
      marginLeft: 4,
      height: '100vh',
    }}>
      <KanbanBoard/>
    </Box>
  )
}
