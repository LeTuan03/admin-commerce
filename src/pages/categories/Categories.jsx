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
import { mockCategories } from '../../utils/mockData'
import {deleteCategories, getCategoriess} from "../../services/categoriesService.js";
import {flattenTree} from "../../utils/customUI.js";

const Categories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionAnchor, setActionAnchor] = useState(null)
  
  // Fetch categories data
  const fetchCategories = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we're using mock data
      const data = await getCategoriess()
      setCategories(data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchCategories()
  }, [])
  
  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Handle actions menu
  const handleActionClick = (event, category) => {
    event.stopPropagation()
    setSelectedCategory(category)
    setActionAnchor(event.currentTarget)
  }
  
  const handleActionClose = () => {
    setActionAnchor(null)
  }
  
  // Handle category actions
  const handleViewCategory = () => {
    // In a real app, this would navigate to a category detail view
    handleActionClose()
  }
  
  const handleEditCategory = () => {
    navigate(`/categories/edit/${selectedCategory.id}`)
    handleActionClose()
  }
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleActionClose()
  }
  
  const handleDeleteConfirm = async () => {
    // In a real app, this would be an API call
    try {
      await deleteCategories(selectedCategory.id)
      setDeleteDialogOpen(false)
      await fetchCategories()
    } catch (e) {
      console.log(e)
    }

  }
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleAddCategory = () => {
    navigate('/categories/new')
  }
  
  // DataGrid columns
  const columns = [
    {
      field: 'categoryName',
      headerName: 'Category Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 250,
    },
    // {
    //   field: 'productCount',
    //   headerName: 'Products',
    //   width: 120,
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value}
    //       size="small"
    //       color="primary"
    //       variant="outlined"
    //     />
    //   ),
    // },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const active = params.value
        return (
          <Chip 
            label={active ? 'Active' : 'Inactive'}
            color={active ? 'success' : 'error'}
            size="small"
          />
        )
      },
    },
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
          Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search categories..."
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
            treeData
            getRowId={(row) => row.id}
            getParent={(row) => row.parentId}

            // rows={filteredCategories}
            rows={flattenTree(filteredCategories)}
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
        <MenuItem onClick={handleViewCategory}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Visibility fontSize="small" />
            <Typography>View</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleEditCategory}>
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
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedCategory?.name}"? This will remove all associations with products.
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

export default Categories