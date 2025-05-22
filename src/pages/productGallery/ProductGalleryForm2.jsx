import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
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
import {
  createProductGallery,
  getProductGalleryById,
  updateProductGallery
} from "../../services/productGalleryService.js";
import {getProducts} from "../../services/productService.js";

const ProductGalleryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  // Form state
  const [productGallery, setProductGallery] = useState({
    image: '',
    placeholder: '',
    product: null,
    isThumbnail: false,
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState([])
  
  // Fetch productGallery data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          // In a real app, this would be an API call with the productGallery ID
          // For now, we're using mock data
          const data = await getProductGalleryById(id)
          setProductGallery(data.data)
        }
        const datas = await getProducts()
        setProducts(datas.data)
      } catch (error) {
        console.error('Error fetching productGallery data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, isEditing])
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setProductGallery({
      ...productGallery,
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
    setProductGallery({
      ...productGallery,
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
    
    // if (!productGallery.productGalleryName.trim()) {
    //   newErrors.productGalleryName = 'ProductGallery name is required'
    // }
    
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
      // In a real app, this would be an API call to save the productGallery
      // For now, we'll just simulate success
      let payload = {
        image: productGallery.image,
        placeholder: productGallery.placeholder,
        isThumbnail: productGallery.isThumbnail,
        productId: productGallery.product.id,
      }

      if (id) {
        await updateProductGallery(id, payload)
      } else {
        await createProductGallery(payload)
      }
      // Navigate back to productGallery list after saving
      setTimeout(() => {
        navigate('/product-gallery')
      }, 1000)
    } catch (error) {
      console.error('Error saving productGallery:', error)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading productGallery data...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            {isEditing ? 'Edit Product Gallery' : 'Add New Product Gallery'}
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
                navigate('/product-gallery')
              }}
            >
              Product Gallery
            </Link>
            <Typography color="text.primary">
              {isEditing ? 'Edit Product Gallery' : 'Add Product Gallery'}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/product-gallery')}
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
            {saving ? 'Saving...' : 'Save Product Gallery'}
          </Button>
        </Box>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Product Gallery Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Autocomplete
                  value={productGallery.product}
                  onChange={(e, value) => handleChangeSelect("product", value)}
                  options={products}
                  fullWidth
                  getOptionLabel={item => item.name}
                  renderInput={(params) => <TextField {...params} label="Product" />}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={productGallery.isThumbnail}
                    onChange={handleChange}
                    name="isThumbnail"
                    color="primary"
                  />
                }
                label="Is Thumbnail"
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
                value={productGallery.image}
                onChange={handleChange}
                placeholder="Product Gallery image"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Placeholder"
                name="placeholder"
                value={productGallery.placeholder}
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

export default ProductGalleryForm