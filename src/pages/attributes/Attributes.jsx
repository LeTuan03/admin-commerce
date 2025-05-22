import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { mockAttributes } from '../../utils/mockData'
import {getAttributes} from "../../services/attributesService.js";

const Attributes = () => {
  const navigate = useNavigate()
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionAnchor, setActionAnchor] = useState(null)
  
  // Fetch attributes data
  const fetchAttributes = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const data = await getAttributes()
      setAttributes(data.data)
    } catch (error) {
      console.error('Error fetching attributes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttributes()
  }, [])
  
  // Filter attributes based on search term
  const filteredAttributes = attributes.filter((attribute) =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attribute.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle actions menu
  const handleActionClick = (event, attribute) => {
    event.stopPropagation()
    setSelectedAttribute(attribute)
    setActionAnchor(event.currentTarget)
  }
  
  const handleActionClose = () => {
    setActionAnchor(null)
  }
  
  // Handle attribute actions
  const handleViewAttribute = () => {
    // In a real app, this would navigate to an attribute detail view
    navigate(`/attributes/edit/${selectedAttribute.id}`)
    handleActionClose()
  }
  
  const handleEditAttribute = () => {
    navigate(`/attributes/edit/${selectedAttribute.id}`)
    handleActionClose()
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleActionClose()
  }
  
  const handleDeleteConfirm = () => {
    // In a real app, this would be an API call
    setAttributes(attributes.filter((attribute) => attribute.id !== selectedAttribute.id))
    setDeleteDialogOpen(false)
  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleAddAttribute = () => {
    navigate('/attributes/new')
  }
  
  // DataGrid columns
  const columns = [
    {
      field: 'name',
      headerName: 'Attribute Name',
      flex: 1,
      minWidth: 180,
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   flex: 2,
    //   minWidth: 250,
    // },
    // {
    //   field: 'valueType',
    //   headerName: 'Type',
    //   width: 120,
    //   renderCell: (params) => {
    //     const type = params.value
    //     let color = 'primary'
    //     if (type === 'Number') color = 'secondary'
    //     if (type === 'Boolean') color = 'info'
    //
    //     return (
    //       <Chip
    //         label={type}
    //         color={color}
    //         size="small"
    //         variant="outlined"
    //       />
    //     )
    //   },
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 120,
    //   renderCell: (params) => {
    //     const status = params.value
    //     return (
    //       <Chip
    //         label={status}
    //         color={status === 'Active' ? 'success' : 'error'}
    //         size="small"
    //       />
    //     )
    //   },
    // },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => handleActionClick(e, params.row)}
          size="small"
        >
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ]
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
          Attributes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddAttribute}
        >
          Add Attribute
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search attributes..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>
        
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={filteredAttributes}
            columns={columns}
            loading={loading}
            autoPageSize
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
              },
              border: 'none',
            }}
          />
        </Box>
      </Paper>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleViewAttribute}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography>View</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleEditAttribute}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Edit fontSize="small" />
            <Typography>Edit</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
            <Delete fontSize="small" />
            <Typography>Delete</Typography>
          </Stack>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Attribute</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the attribute "{selectedAttribute?.name}"? This will remove it from all products that use it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Attributes