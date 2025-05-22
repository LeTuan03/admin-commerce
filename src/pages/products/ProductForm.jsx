import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Stack,
  Chip,
} from '@mui/material'
import {
  ArrowBack,
  Save,
  Upload,
  Delete,
  Add,
  NavigateNext,
} from '@mui/icons-material'
import { mockCategories, mockAttributes } from '../../utils/mockData'
import {createProducts, getProductById, getProducts, updateProduct} from "../../services/productService.js";

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  // Tab state
  const [tabValue, setTabValue] = useState(0)
  
  // Form state
  const [product, setProduct] = useState({
    slug: '',
    name: '',
    sku: '',
    comparePrice: '',
    salePrice: '',
    buyingPrice: '',
    quantity: '',
    description: '',
    shortDescription: '',
    note: '',
    // stock: '',
    type: '',
    // status: 'Active',
    featured: false,
    published: false,
    disableOutOfStock: false,
    images: [],
    attributes: [],
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [availableAttributes, setAvailableAttributes] = useState([])

  const featchProducts = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data?.data)
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }
  // Fetch product data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          featchProducts();
          // In a real app, this would be an API call with the product ID
          // For now, we're using mock data
          // const mockProduct = {
          //   id: parseInt(id),
          //   slug: 'Wireless Bluetooth Headphones',
          //   name: 'Wireless Bluetooth Headphones',
          //   sku: 'SKU-' + id.padStart(6, '0'),
          //   comparePrice: 129.99,
          //   salePrice: 99.99,
          //   buyingPrice: 65.00,
          //   description: 'Premium wireless headphones with noise cancellation technology and long battery life.',
          //   shortDescription: 'Premium wireless headphones with noise cancellation.',
          //   // stock: 45,
          //   quantity: 45,
          //   type: 'Electronics',
          //   note: 'Note ss',
          //   // status: 'Active',
          //   featured: true,
          //   published: true,
          //   disableOutOfStock: true,
          //   images: [
          //     'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          //     'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          //   ],
          //   attributes: [
          //     { id: 1, name: 'Color', value: 'Black' },
          //     { id: 2, name: 'Connectivity', value: 'Bluetooth 5.0' },
          //   ],
          // }
          // setProduct(mockProduct)
        }
        
        // Fetch categories and attributes
        setCategories(mockCategories)
        setAvailableAttributes(mockAttributes)
      } catch (error) {
        console.error('Error fetching product data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, isEditing])
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setProduct({
      ...product,
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
  
  // Handle tab change
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue)
  }
  
  // Add attribute
  const handleAddAttribute = () => {
    setProduct({
      ...product,
      attributes: [
        ...product.attributes,
        { id: null, name: '', value: '' },
      ],
    })
  }
  
  // Update attribute
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...product.attributes]
    updatedAttributes[index][field] = value
    setProduct({
      ...product,
      attributes: updatedAttributes,
    })
  }
  
  // Remove attribute
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = [...product.attributes]
    updatedAttributes.splice(index, 1)
    setProduct({
      ...product,
      attributes: updatedAttributes,
    })
  }
  
  // Handle image upload
  const handleImageUpload = (e) => {
    // In a real app, this would upload to a server
    // For now, we'll simulate with local file objects
    const files = Array.from(e.target.files)
    
    // Create URLs for preview (in a real app you'd upload files to server)
    const newImages = files.map((file) => URL.createObjectURL(file))
    
    setProduct({
      ...product,
      images: [...product.images, ...newImages],
    })
  }
  
  // Remove image
  const handleRemoveImage = (index) => {
    const updatedImages = [...product.images]
    updatedImages.splice(index, 1)
    setProduct({
      ...product,
      images: updatedImages,
    })
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!product.name.trim()) newErrors.name = 'Product name is required'
    if (!product.sku.trim()) newErrors.sku = 'SKU is required'
    if (!product.comparePrice) newErrors.comparePrice = 'Price is required'
    if (isNaN(product.comparePrice) || parseFloat(product.comparePrice) < 0) {
      newErrors.comparePrice = 'Price must be a positive number'
    }
    if (product.salePrice && (isNaN(product.salePrice) || parseFloat(product.salePrice) < 0)) {
      newErrors.salePrice = 'Sale comparePrice must be a positive number'
    }
    // if (!product.stock) newErrors.stock = 'Stock is required'
    // if (isNaN(product.stock) || parseInt(product.stock) < 0) {
    //   newErrors.stock = 'Stock must be a positive number'
    // }
    if (!product.type) newErrors.type = 'Category is required'
    
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
      // In a real app, this would be an API call to save the product
      // For now, we'll just simulate success
      const payload = {
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        comparePrice: product.comparePrice,
        salePrice: product.salePrice,
        buyingPrice: product.buyingPrice,
        quantity: product.quantity,
        description: product.description,
        shortDescription: product.shortDescription,
        note: product.note,
        type: product.type,
        published: product.published,
        disableOutOfStock: product.disableOutOfStock,
      }

      console.log('Saving product:', payload)
      if (id) {
        await updateProduct(id, payload)
      } else {
        await createProducts(payload);
      }
      // // Navigate back to product list after saving
      // setTimeout(() => {
      //   navigate('/products')
      // }, 1000)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading product data...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
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
                navigate('/products')
              }}
            >
              Products
            </Link>
            <Typography color="text.primary">
              {isEditing ? 'Edit Product' : 'Add Product'}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
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
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
        </Box>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Basic Information" />
        <Tab label="Images" />
        <Tab label="Attributes" />
        <Tab label="Advanced" />
      </Tabs>
      
      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Information Tab */}
        {tabValue === 0 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  required
                  error={!!errors.sku}
                  helperText={errors.sku}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Compare Price"
                  name="comparePrice"
                  type="number"
                  value={product.comparePrice}
                  onChange={handleChange}
                  required
                  error={!!errors.comparePrice}
                  helperText={errors.comparePrice}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  name="salePrice"
                  type="number"
                  value={product.salePrice}
                  onChange={handleChange}
                  error={!!errors.salePrice}
                  helperText={errors.salePrice}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buying Price"
                  name="buyingPrice"
                  type="number"
                  value={product.buyingPrice}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Slug"
                  name="slug"
                  type="text"
                  value={product.slug}
                  onChange={handleChange}
                />
              </Grid>

               <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required error={!!errors.type}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="type"
                    value={product.type}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((type) => (
                      <MenuItem key={type.id} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <FormHelperText>{errors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/*<Grid item xs={12} md={3}>*/}
              {/*  <TextField*/}
              {/*    fullWidth*/}
              {/*    label="Stock"*/}
              {/*    name="stock"*/}
              {/*    type="number"*/}
              {/*    value={product.stock}*/}
              {/*    onChange={handleChange}*/}
              {/*    required*/}
              {/*    error={!!errors.stock}*/}
              {/*    helperText={errors.stock}*/}
              {/*  />*/}
              {/*</Grid>*/}
              
              {/*<Grid item xs={12} md={3}>*/}
              {/*  <FormControl fullWidth required>*/}
              {/*    <InputLabel>Status</InputLabel>*/}
              {/*    <Select*/}
              {/*      name="status"*/}
              {/*      value={product.status}*/}
              {/*      onChange={handleChange}*/}
              {/*      label="Status"*/}
              {/*    >*/}
              {/*      <MenuItem value="Active">Active</MenuItem>*/}
              {/*      <MenuItem value="Draft">Draft</MenuItem>*/}
              {/*      <MenuItem value="Archived">Archived</MenuItem>*/}
              {/*    </Select>*/}
              {/*  </FormControl>*/}
              {/*</Grid>*/}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  name="note"
                  value={product.note}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

               <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  name="shortDescription"
                  value={product.shortDescription}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  multiline
                  rows={6}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.featured}
                      onChange={handleChange}
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.published}
                      onChange={handleChange}
                      name="published"
                      color="primary"
                    />
                  }
                  label="Published"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.disableOutOfStock}
                      onChange={handleChange}
                      name="disableOutOfStock"
                      color="primary"
                    />
                  }
                  label="Disable Out Of Stock"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {/* Images Tab */}
        {tabValue === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload product images. The first image will be used as the product thumbnail.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {product.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`Product image ${index + 1}`}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    {index === 0 && (
                      <Chip
                        label="Primary"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                        }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {/* Attributes Tab */}
        {tabValue === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Attributes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add attributes like color, size, material, etc. to your product.
              </Typography>
            </Box>
            
            {product.attributes.map((attr, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <InputLabel>Attribute</InputLabel>
                    <Select
                      value={attr.name}
                      onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                      label="Attribute"
                    >
                      {availableAttributes.map((availableAttr) => (
                        <MenuItem key={availableAttr.id} value={availableAttr.name}>
                          {availableAttr.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Value"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveAttribute(index)}
                    sx={{ height: '100%' }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddAttribute}
              >
                Add Attribute
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Advanced Tab */}
        {tabValue === 3 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  SEO Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  name="metaTitle"
                  placeholder="Product name - Your Brand"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  name="metaDescription"
                  multiline
                  rows={3}
                  placeholder="Brief description of the product for search engines..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Keywords"
                  name="metaKeywords"
                  placeholder="product, type, features, separated by commas"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Additional Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  name="weight"
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barcode (ISBN, UPC, GTIN, etc.)"
                  name="barcode"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch name="trackInventory" color="primary" />}
                  label="Track Inventory"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch name="allowBackorders" color="primary" />}
                  label="Allow Backorders"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default ProductForm