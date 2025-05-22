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
} from '@mui/material'
import {
  ArrowBack,
  Save,
  NavigateNext,
} from '@mui/icons-material'
import {createCountry, getCountryById, updateCountry} from "../../services/countryService.js";
import {formatDateTimeBE} from "../../utils/formatters.js";

const CountryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  // Form state
  const [country, setCountry] = useState({
    iso: '',
    name: '',
    upperName: '',
    iso3: '',
    numCode: '',
    phoneCode: '',
    countryStartDate: formatDateTimeBE(new Date()),
    countryEndDate: formatDateTimeBE(new Date()),
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  // Fetch country data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          // In a real app, this would be an API call with the country ID
          // For now, we're using mock data
          const data = await getCountryById(id);
          setCountry(data.data);
        }
      } catch (error) {
        console.error('Error fetching country data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, isEditing])
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
      setCountry({
        ...country,
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

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!country.iso.trim()) {
      newErrors.iso = 'Country iso is required'
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
      // In a real app, this would be an API call to save the country
      // For now, we'll just simulate success
      console.log('Saving country:', country)
      let payload = {
        iso: country.iso,
        name: country.name,
        upperName: country.upperName,
        iso3: country.iso3,
        numCode: country.numCode,
        phoneCode: country.phoneCode,
      }
      if (id) {
        await updateCountry(id, payload)
      } else {
        await createCountry(payload)
      }
      // Navigate back to country list after saving
      setTimeout(() => {
        navigate('/country')
      }, 1000)
    } catch (error) {
      console.error('Error saving country:', error)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return <Typography>Loading country data...</Typography>
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
            {isEditing ? 'Edit Country' : 'Add New Country'}
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
                navigate('/country')
              }}
            >
              Countrys
            </Link>
            <Typography color="text.primary">
              {isEditing ? 'Edit Country' : 'Add Country'}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/country')}
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
            {saving ? 'Saving...' : 'Save Country'}
          </Button>
        </Box>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: country.valueType === 'Text' ? 3 : 0 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Country Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country iso"
                name="iso"
                value={country.iso}
                onChange={handleChange}
                required
                error={!!errors.iso}
                helperText={errors.iso}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country Name"
                name="name"
                value={country.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Upper Name"
                name="upperName"
                value={country.upperName}
                onChange={handleChange}
                required
                error={!!errors.upperName}
                helperText={errors.upperName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Iso3"
                name="iso3"
                value={country.iso3}
                onChange={handleChange}
                error={!!errors.iso3}
                helperText={errors.iso3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Num Code"
                name="numCode"
                value={country.numCode}
                onChange={handleChange}
                required
                error={!!errors.numCode}
                helperText={errors.numCode}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Phone Code"
                name="phoneCode"
                value={country.phoneCode}
                onChange={handleChange}
                required
                error={!!errors.phoneCode}
                helperText={errors.phoneCode}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  )
}

export default CountryForm