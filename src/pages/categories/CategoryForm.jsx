import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel, Autocomplete,
} from '@mui/material'
import {
  ArrowBack,
  Save,
  NavigateNext,
} from '@mui/icons-material'
import { mockCategories } from '../../utils/mockData'
import {
  createCategories,
  getCategoriesById,
  getCategoriess,
  updateCategories
} from "../../services/categoriesService.js";

const CategoryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  // Form state
  const [category, setCategory] = useState({
    categoryName: '',
    image: '',
    icon: '',
    placeholder: '',
    description: '',
    parent: null,
    status: 'Active',
    active: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  
  // Fetch category data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          // In a real app, this would be an API call with the category ID
          // For now, we're using mock data
          const data = await getCategoriesById(id)
          let parentId = data?.data?.parentId
          if (parentId) {
            const parent = await getCategoriesById(parentId)
            setCategory({...data.data, parent: parent.data})
          } else {
            setCategory(data.data)
          }
          // const fetchedCategory = mockCategories.find(c => c.id === parseInt(id))
          //
          // if (fetchedCategory) {
          //   setCategory({
          //     ...fetchedCategory,
          //     parent: '',
          //     active: false,
          //     metaTitle: fetchedCategory.name,
          //     metaDescription: fetchedCategory.description,
          //     metaKeywords: fetchedCategory.name.toLowerCase().split(' ').join(', '),
          //   })
          // }
        }
        // Fetch categories (excluding current one for parent selection)
        const datas = await getCategoriess()
        setCategories(datas.data.filter(c => c.id !== id))
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, isEditing])
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setCategory({
      ...category,
      [name]: type === 'checkbox' ? checked : value,
    })
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleChangeSelect = (name, value) => {
    setCategory({
      ...category,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!category.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      // In a real app, this would be an API call to save the category
      // For now, we'll just simulate success
      let payload = {
        categoryName: category.categoryName,
        image: category.image,
        icon: category.icon,
        placeholder: category.placeholder,
        description: category.description,
        active: category.active,
        parent: category.parent,
      }

      if (id) {
        await updateCategories(id, payload)
      } else {
        await createCategories(payload)
      }
      // Navigate back to category list after saving
      setTimeout(() => {
        navigate('/categories')
      }, 1000)
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading category data...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </Typography>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              Dashboard
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/categories')
              }}
            >
              Categories
            </Link>
            <Typography color="text.primary">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/categories')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Category'}
          </Button>
        </Box>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Category Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                name="categoryName"
                value={category.categoryName}
                onChange={handleChange}
                required
                error={!!errors.categoryName}
                helperText={errors.categoryName}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                  value={category.parent}
                  onChange={(e, value) => handleChangeSelect("parent", value)}
                  options={categories}
                  fullWidth
                  getOptionLabel={item => item.categoryName}
                  renderInput={(params) => <TextField {...params} label="Parent Category" />}
              />
              {/*<FormControl fullWidth>*/}
              {/*  <InputLabel>Parent Category</InputLabel>*/}
              {/*  <Select*/}
              {/*    name="parent"*/}
              {/*    value={category.parent}*/}
              {/*    onChange={handleChange}*/}
              {/*    label="Parent Category"*/}
              {/*  >*/}
              {/*    <MenuItem value="">None (Top Level)</MenuItem>*/}
              {/*    {categories.map((cat) => (*/}
              {/*      <MenuItem key={cat.id} value={cat.id}>*/}
              {/*        {cat.categoryName}*/}
              {/*      </MenuItem>*/}
              {/*    ))}*/}
              {/*  </Select>*/}
              {/*</FormControl>*/}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={category.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {/*<Grid item xs={12} md={6}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel>Status</InputLabel>*/}
            {/*    <Select*/}
            {/*      name="status"*/}
            {/*      value={category.status}*/}
            {/*      onChange={handleChange}*/}
            {/*      label="Status"*/}
            {/*    >*/}
            {/*      <MenuItem value="true">Active</MenuItem>*/}
            {/*      <MenuItem value="false">Inactive</MenuItem>*/}
            {/*    </Select>*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={category.active}
                    onChange={handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Is active"
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            More Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image"
                name="image"
                value={category.image}
                onChange={handleChange}
                placeholder="Category image"
              />
            </Grid>

             <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon"
                name="icon"
                value={category.icon}
                onChange={handleChange}
                placeholder="Category icon"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Placeholder"
                name="placeholder"
                value={category.placeholder}
                onChange={handleChange}
                placeholder="Brief description for search engines..."
              />
            </Grid>

          </Grid>
        </Paper>
      </Box>
    </Box>
  )
}

export default CategoryForm