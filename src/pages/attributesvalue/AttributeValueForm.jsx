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
  FormControlLabel,
  Chip,
  Stack,
  Divider, Autocomplete,
} from '@mui/material'
import {
  ArrowBack,
  Save,
  NavigateNext,
  Add,
} from '@mui/icons-material'
import { mockAttributes } from '../../utils/mockData'
import {getAttributes} from "../../services/attributesService.js";
import {
  createAttributeValue,
  getAttributeValueById,
  updateAttributeValue
} from "../../services/attributeValueService.js";

const AttributeValueForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  // Form state
  const [attribute, setAttribute] = useState({
    value: '',
    color: '',
    description: '',
    attribute: null,
    status: 'Active',
    required: false,
    filterable: true,
    predefinedValues: [],
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [newValue, setNewValue] = useState('')
  const [attributes, setAttributes] = useState([])

  const getAllAttributes = async () => {
    try {
      const data = await getAttributes()
      setAttributes(data.data)
    } catch (error) {
      console.error('Error fetching attributes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch attribute data if editing
  const fetchData = async () => {
    try {
      if (isEditing) {
        // In a real app, this would be an API call with the attribute ID
        // For now, we're using mock data
        // const fetchedAttribute = mockAttributes.find(attr => attr.id === parseInt(id))

        const data = await getAttributeValueById(id)
        setAttribute({
          ...data.data, attribute: {
            id: data.data.attributeId,
            name: data.data.attributeName,
          }
        })

        // if (fetchedAttribute) {
        //   setAttribute({
        //     ...fetchedAttribute,
        //     required: false,
        //     filterable: true,
        //     predefinedValues: fetchedAttribute.valueType === 'Text'
        //         ? ['Small', 'Medium', 'Large', 'XL']
        //         : [],
        //   })
        // }
      }
    } catch (error) {
      console.error('Error fetching attribute data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllAttributes()
    fetchData()
  }, [id, isEditing])
  
  // Handle form changes
  const handleChange = (e, valueSelect ,source) => {
    const { name, value, checked, type } = e.target
    if(source) {
      setAttribute({
        ...attribute,
        [source]: valueSelect,
      })
    } else
    // If changing valueType, clear predefined values if switching to non-text
    if (name === 'valueType' && value !== 'Text') {
      setAttribute({
        ...attribute,
        valueType: value,
        predefinedValues: [],
      })
    } else {
      setAttribute({
        ...attribute,
        [name]: type === 'checkbox' ? checked : value,
      })
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }
  
  // Handle adding predefined value
  const handleAddValue = () => {
    if (newValue.trim() && !attribute.predefinedValues.includes(newValue.trim())) {
      setAttribute({
        ...attribute,
        predefinedValues: [...attribute.predefinedValues, newValue.trim()],
      })
      setNewValue('')
    }
  }
  
  // Handle removing predefined value
  const handleRemoveValue = (valueToRemove) => {
    setAttribute({
      ...attribute,
      predefinedValues: attribute.predefinedValues.filter(value => value !== valueToRemove),
    })
  }
  
  // Handle keypress in new value input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddValue()
    }
  }
  
  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!attribute.value.trim()) {
      newErrors.value = 'Attribute value is required'
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
      // In a real app, this would be an API call to save the attribute
      // For now, we'll just simulate success
      console.log('Saving attribute:', attribute)
      let payload = {
        attribute: attribute.attribute,
        value: attribute.value,
        color: attribute.color,
      }

      if (id) {
        await updateAttributeValue(id, payload)
      } else {
        await createAttributeValue(payload)
      }
      // Navigate back to attribute list after saving
      // setTimeout(() => {
      //   navigate('/attributes')
      // }, 1000)
    } catch (error) {
      console.error('Error saving attribute:', error)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading attribute data...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            {isEditing ? 'Edit Attribute' : 'Add New Attribute'}
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
                navigate('/attributes')
              }}
            >
              Attributes
            </Link>
            <Typography color="text.primary">
              {isEditing ? 'Edit Attribute' : 'Add Attribute'}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/attributes')}
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
            {saving ? 'Saving...' : 'Save Attribute'}
          </Button>
        </Box>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: attribute.valueType === 'Text' ? 3 : 0 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Attribute Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {/*<FormControl fullWidth required>*/}
              {/*  <InputLabel>Attribute</InputLabel>*/}
              {/*  <Select*/}
              {/*      name="valueType"*/}
              {/*      value={attribute.valueType}*/}
              {/*      onChange={handleChange}*/}
              {/*      label="Attribute"*/}
              {/*  >*/}
              {/*    {attributes.map(x => <MenuItem key={x.id} value={x.id}>{x.name}</MenuItem>)}*/}
              {/*  </Select>*/}
              {/*</FormControl>*/}
              <Autocomplete
                  value={attribute.attribute}
                  onChange={(e, value) => handleChange(e, value, "attribute")}
                  options={attributes}
                  fullWidth
                  getOptionLabel={item => item.name}
                  renderInput={(params) => <TextField {...params} label="Attribute" />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Attribute value"
                name="value"
                value={attribute.value}
                onChange={handleChange}
                required
                error={!!errors.value}
                helperText={errors.value}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Attribute color"
                name="color"
                value={attribute.color}
                onChange={handleChange}
                required
                error={!!errors.color}
                helperText={errors.color}
              />
            </Grid>

            {/*<Grid item xs={12}>*/}
            {/*  <TextField*/}
            {/*    fullWidth*/}
            {/*    label="Description"*/}
            {/*    name="description"*/}
            {/*    value={attribute.description}*/}
            {/*    onChange={handleChange}*/}
            {/*    multiline*/}
            {/*    rows={3}*/}
            {/*    placeholder="Describe what this attribute is used for..."*/}
            {/*  />*/}
            {/*</Grid>*/}
            
            {/*<Grid item xs={12} md={6}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel>Status</InputLabel>*/}
            {/*    <Select*/}
            {/*      name="status"*/}
            {/*      value={attribute.status}*/}
            {/*      onChange={handleChange}*/}
            {/*      label="Status"*/}
            {/*    >*/}
            {/*      <MenuItem value="Active">Active</MenuItem>*/}
            {/*      <MenuItem value="Inactive">Inactive</MenuItem>*/}
            {/*    </Select>*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            
            {/*<Grid item xs={12} md={6}>*/}
            {/*  <Box sx={{ display: 'flex', gap: 4 }}>*/}
            {/*    <FormControlLabel*/}
            {/*      control={*/}
            {/*        <Switch*/}
            {/*          checked={attribute.required}*/}
            {/*          onChange={handleChange}*/}
            {/*          name="required"*/}
            {/*          color="primary"*/}
            {/*        />*/}
            {/*      }*/}
            {/*      label="Required"*/}
            {/*    />*/}
            {/*    */}
            {/*    <FormControlLabel*/}
            {/*      control={*/}
            {/*        <Switch*/}
            {/*          checked={attribute.filterable}*/}
            {/*          onChange={handleChange}*/}
            {/*          name="filterable"*/}
            {/*          color="primary"*/}
            {/*        />*/}
            {/*      }*/}
            {/*      label="Filterable"*/}
            {/*    />*/}
            {/*  </Box>*/}
            {/*</Grid>*/}
          </Grid>
        </Paper>
        
        {/*{attribute.valueType === 'Text' && (*/}
        {/*  <Paper sx={{ p: 3, borderRadius: 2 }}>*/}
        {/*    <Typography variant="h6" sx={{ mb: 3 }}>*/}
        {/*      Predefined Values*/}
        {/*    </Typography>*/}
        {/*    */}
        {/*    <Grid container spacing={3}>*/}
        {/*      <Grid item xs={12}>*/}
        {/*        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>*/}
        {/*          <TextField*/}
        {/*            label="Add New Value"*/}
        {/*            fullWidth*/}
        {/*            value={newValue}*/}
        {/*            onChange={(e) => setNewValue(e.target.value)}*/}
        {/*            onKeyPress={handleKeyPress}*/}
        {/*            placeholder="Enter value and press Enter or Add button"*/}
        {/*          />*/}
        {/*          <Button*/}
        {/*            variant="contained"*/}
        {/*            startIcon={<Add />}*/}
        {/*            onClick={handleAddValue}*/}
        {/*            disabled={!newValue.trim()}*/}
        {/*          >*/}
        {/*            Add*/}
        {/*          </Button>*/}
        {/*        </Box>*/}
        {/*      </Grid>*/}
        {/*      */}
        {/*      <Grid item xs={12}>*/}
        {/*        <Divider sx={{ mb: 2 }} />*/}
        {/*        */}
        {/*        {attribute.predefinedValues.length > 0 ? (*/}
        {/*          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>*/}
        {/*            {attribute.predefinedValues.map((value, index) => (*/}
        {/*              <Chip*/}
        {/*                key={index}*/}
        {/*                label={value}*/}
        {/*                onDelete={() => handleRemoveValue(value)}*/}
        {/*                color="primary"*/}
        {/*                variant="outlined"*/}
        {/*              />*/}
        {/*            ))}*/}
        {/*          </Stack>*/}
        {/*        ) : (*/}
        {/*          <Typography color="text.secondary">*/}
        {/*            No predefined values yet. Add some values that will be available as options for this attribute.*/}
        {/*          </Typography>*/}
        {/*        )}*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </Paper>*/}
        {/*)}*/}
      </Box>
    </Box>
  )
}

export default AttributeValueForm