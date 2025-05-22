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
  MenuItem, Autocomplete,
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
import {getProducts} from "../../services/productService.js";
import {getAttributes} from "../../services/attributesService.js";
import {
  createProductAttribute,
  deleteProductAttribute,
  getProductAttributes, updateProductAttribute
} from "../../services/productAttributesService.js";
import {createAttributeValue, deleteAttributeValue} from "../../services/attributeValueService.js";

const ProductAttributes = () => {
  const navigate = useNavigate()
  const [productAttributes, setProductAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [attributes, setAttributes] = useState([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newAttributeProduct, setNewAttributeProduct] = useState(null)
  const [newAttributeData, setNewAttributeData] = useState(null)

  // Fetch data
  const fetchData = async () => {
    try {
      // In a real app, this would be API calls
      // For now, we're using mock data
      const listProducts = await getProducts();
      const listAttributes = await getAttributes();
      setProducts(listProducts.data)
      setAttributes(listAttributes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const featchProductAttributes = async () => {
    try {
      // In a real app, this would be API calls
      // For now, we're using mock data
      const listProductAttributes = await getProductAttributes()
      setProductAttributes(listProductAttributes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    featchProductAttributes()
    fetchData()
  }, [])
  
  // Filter product attributes based on search term
  const filteredProductAttributes = productAttributes.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle delete product attribute
  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (product) => {
    setNewAttributeData({
      id: product.attributeId,
      name: product.attributeName,
    })
    setNewAttributeProduct({
      id: product.productId,
      name: product.productName,
    })
    setEditMode(product)
    setAddDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteProductAttribute(selectedProduct.id);
      await featchProductAttributes();
    } catch (e) {
      console.error(e);
    }
    setDeleteDialogOpen(false)
  }

  // Handle opening add new product attribute dialog
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true)
  }
  
  // Handle saving new product attribute
  const handleSaveNewAttribute = async () => {

    try {
      // In a real app, this would be an API call to save the attribute
      // For now, we'll just simulate success
      let payload = {
        product: newAttributeProduct,
        attribute: newAttributeData,
      }

      if (editMode) {
        await updateProductAttribute(editMode.id, {...payload, id: editMode.id })
      } else {
        await createProductAttribute(payload)
      }

      // Navigate back to attribute list after saving
      // setTimeout(() => {
      //   navigate('/attributes')
      // }, 1000)
    } catch (error) {
      console.error('Error saving attribute:', error)
    } finally {
      setNewAttributeProduct(null)
      setNewAttributeData(null)
      setEditMode(null)
      setAddDialogOpen(false)
      await featchProductAttributes()
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

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.productName} - {item.attributeName}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
                      <Button
                          variant={"outlined"}
                          color={"primary"}
                          startIcon={<Edit />}
                          onClick={() => handleEditClick(item)}
                          size="small"
                          sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>

                      <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteClick(item)}
                          size="small"
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
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
              <Autocomplete
                  value={newAttributeProduct || null}
                  onChange={(e, value) => setNewAttributeProduct(value)}
                  options={products}
                  fullWidth
                  getOptionLabel={item => item.name}
                  renderInput={(params) => <TextField {...params} label="Product" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                  value={newAttributeData || null}
                  onChange={(e, value) => setNewAttributeData(value)}
                  options={attributes}
                  fullWidth
                  getOptionLabel={item => item.name}
                  renderInput={(params) => <TextField {...params} label="Attribute" />}
              />
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
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductAttributes