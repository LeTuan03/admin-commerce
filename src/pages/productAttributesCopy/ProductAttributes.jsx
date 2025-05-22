import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Search,
  ExpandMore,
  Edit,
  Delete,
  Save,
  Add,
} from '@mui/icons-material'
import { mockProductAttributes, mockProducts, mockAttributes } from '../../utils/mockData'

const ProductAttributes = () => {
  const navigate = useNavigate()
  const [productAttributes, setProductAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState({})
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tempAttributes, setTempAttributes] = useState({})
  const [products, setProducts] = useState([])
  const [attributes, setAttributes] = useState([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newAttributeProduct, setNewAttributeProduct] = useState('')
  const [newAttributeData, setNewAttributeData] = useState([])
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        // For now, we're using mock data
        setProductAttributes(mockProductAttributes)
        setProducts(mockProducts)
        setAttributes(mockAttributes)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Filter product attributes based on search term
  const filteredProductAttributes = productAttributes.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Toggle edit mode for a product
  const toggleEditMode = (productId) => {
    if (editMode[productId]) {
      // Save changes
      const updatedProductAttributes = productAttributes.map((item) => {
        if (item.productId === productId) {
          return { ...item, attributes: [...tempAttributes[productId]] }
        }
        return item
      })
      setProductAttributes(updatedProductAttributes)
      
      // Reset edit mode and temp data
      setEditMode({ ...editMode, [productId]: false })
      setTempAttributes({ ...tempAttributes, [productId]: null })
    } else {
      // Enter edit mode
      const currentAttributes = productAttributes.find(
        (item) => item.productId === productId
      )?.attributes || []
      setTempAttributes({ ...tempAttributes, [productId]: [...currentAttributes] })
      setEditMode({ ...editMode, [productId]: true })
    }
  }
  
  // Handle delete product attribute
  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    setProductAttributes(
      productAttributes.filter((item) => item.productId !== selectedProduct.productId)
    )
    setDeleteDialogOpen(false)
  }
  
  // Handle attribute value change during edit
  const handleAttributeValueChange = (productId, attrIndex, value) => {
    const updatedAttributes = [...tempAttributes[productId]]
    updatedAttributes[attrIndex] = { ...updatedAttributes[attrIndex], value }
    setTempAttributes({ ...tempAttributes, [productId]: updatedAttributes })
  }
  
  // Handle adding new attribute to a product
  const handleAddAttribute = (productId) => {
    const availableAttributes = attributes.filter(
      (attr) => 
        !tempAttributes[productId].some((existing) => existing.name === attr.name)
    )
    
    if (availableAttributes.length > 0) {
      const newAttr = {
        id: availableAttributes[0].id,
        name: availableAttributes[0].name,
        value: '',
      }
      
      const updatedAttributes = [...tempAttributes[productId], newAttr]
      setTempAttributes({ ...tempAttributes, [productId]: updatedAttributes })
    }
  }
  
  // Handle removing attribute during edit
  const handleRemoveAttribute = (productId, attrIndex) => {
    const updatedAttributes = [...tempAttributes[productId]]
    updatedAttributes.splice(attrIndex, 1)
    setTempAttributes({ ...tempAttributes, [productId]: updatedAttributes })
  }
  
  // Handle opening add new product attribute dialog
  const handleOpenAddDialog = () => {
    // Find products that don't have attributes defined yet
    const productsWithoutAttributes = products.filter(
      (product) => !productAttributes.some((item) => item.productId === product.id)
    )
    
    if (productsWithoutAttributes.length > 0) {
      setNewAttributeProduct(productsWithoutAttributes[0].id)
      setNewAttributeData([{ 
        id: attributes[0].id, 
        name: attributes[0].name, 
        value: '' 
      }])
      setAddDialogOpen(true)
    } else {
      // All products already have attributes
      alert('All products already have attributes defined.')
    }
  }
  
  // Handle adding new attribute field in dialog
  const handleAddNewAttributeField = () => {
    const availableAttributes = attributes.filter(
      (attr) => 
        !newAttributeData.some((existing) => existing.name === attr.name)
    )
    
    if (availableAttributes.length > 0) {
      setNewAttributeData([
        ...newAttributeData, 
        { 
          id: availableAttributes[0].id, 
          name: availableAttributes[0].name, 
          value: '' 
        }
      ])
    }
  }
  
  // Handle changing attribute in dialog
  const handleNewAttributeChange = (index, field, value) => {
    const updated = [...newAttributeData]
    updated[index] = { ...updated[index], [field]: value }
    
    // If changing the name, update the id too
    if (field === 'name') {
      const attr = attributes.find(a => a.name === value)
      if (attr) {
        updated[index].id = attr.id
      }
    }
    
    setNewAttributeData(updated)
  }
  
  // Handle removing attribute field in dialog
  const handleRemoveNewAttributeField = (index) => {
    const updated = [...newAttributeData]
    updated.splice(index, 1)
    setNewAttributeData(updated)
  }
  
  // Handle saving new product attribute
  const handleSaveNewAttribute = () => {
    const product = products.find(p => p.id === parseInt(newAttributeProduct))
    
    if (product && newAttributeData.length > 0) {
      const newEntry = {
        id: productAttributes.length + 1,
        productName: product.name,
        productId: product.id,
        attributes: newAttributeData.filter(a => a.value.trim() !== '')
      }
      
      setProductAttributes([...productAttributes, newEntry])
      setAddDialogOpen(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading product attributes...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
          Product Attributes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Add Product Attributes
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search products..."
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
        
        {filteredProductAttributes.length > 0 ? (
          <Box>
            {filteredProductAttributes.map((item) => (
              <Accordion key={item.productId} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel-${item.productId}-content`}
                  id={`panel-${item.productId}-header`}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.productName}
                    </Typography>
                    <Box>
                      <Chip 
                        label={`${item.attributes.length} attributes`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant={editMode[item.productId] ? "contained" : "outlined"}
                      color={editMode[item.productId] ? "success" : "primary"}
                      startIcon={editMode[item.productId] ? <Save /> : <Edit />}
                      onClick={() => toggleEditMode(item.productId)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      {editMode[item.productId] ? "Save" : "Edit"}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(item)}
                      size="small"
                      disabled={editMode[item.productId]}
                    >
                      Remove
                    </Button>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {editMode[item.productId] ? (
                    <Box>
                      {tempAttributes[item.productId]?.map((attr, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                          <Grid item xs={5}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Attribute</InputLabel>
                              <Select
                                value={attr.name}
                                label="Attribute"
                                disabled
                              >
                                {attributes.map((a) => (
                                  <MenuItem key={a.id} value={a.name}>
                                    {a.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              label="Value"
                              value={attr.value}
                              onChange={(e) => handleAttributeValueChange(item.productId, index, e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="error"
                              onClick={() => handleRemoveAttribute(item.productId, index)}
                              sx={{ height: '100%' }}
                            >
                              Remove
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                      
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleAddAttribute(item.productId)}
                        disabled={
                          attributes.length <= tempAttributes[item.productId]?.length
                        }
                      >
                        Add Attribute
                      </Button>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {item.attributes.map((attr, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 2, 
                              borderRadius: 1,
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: 1,
                              },
                            }}
                          >
                            <Typography variant="subtitle2" color="text.secondary">
                              {attr.name}
                            </Typography>
                            <Typography variant="body1">
                              {attr.value || '-'}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
            No product attributes found matching your search.
          </Typography>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Product Attributes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all attributes for "{selectedProduct?.productName}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add New Product Attributes Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Product Attributes</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  value={newAttributeProduct}
                  onChange={(e) => setNewAttributeProduct(e.target.value)}
                  label="Product"
                >
                  {products
                    .filter(product => !productAttributes.some(pa => pa.productId === product.id))
                    .map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attributes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {newAttributeData.map((attr, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Attribute</InputLabel>
                      <Select
                        value={attr.name}
                        onChange={(e) => handleNewAttributeChange(index, 'name', e.target.value)}
                        label="Attribute"
                      >
                        {attributes.map((a) => (
                          <MenuItem key={a.id} value={a.name}>
                            {a.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={attr.value}
                      onChange={(e) => handleNewAttributeChange(index, 'value', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveNewAttributeField(index)}
                      disabled={newAttributeData.length <= 1}
                      sx={{ height: '100%' }}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddNewAttributeField}
                disabled={attributes.length <= newAttributeData.length}
              >
                Add Attribute
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNewAttribute} 
            variant="contained" 
            color="primary"
            disabled={newAttributeData.every(attr => !attr.value.trim())}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductAttributes