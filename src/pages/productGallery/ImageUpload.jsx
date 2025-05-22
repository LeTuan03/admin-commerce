import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    TextField,
    Divider,
} from '@mui/material';
import { Upload, X, Link as LinkIcon } from '@mui/icons-material';

const ImageUpload = ({ value, onChange, placeholder = 'Upload an image or enter image URL' }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useUrl, setUseUrl] = useState(!value || !value.startsWith('data:image'));
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError(null);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            onChange(base64String);
            setUseUrl(false);
            setLoading(false);
        };
        reader.onerror = () => {
            setError('Failed to read file');
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files?.[0];
        if (file) {
            // Create a synthetic event object with files property
            const syntheticEvent = { target: { files: event.dataTransfer.files } };
            handleFileChange(syntheticEvent);
        }

        setDragActive(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const [dragActive, setDragActive] = useState(false);

    const handleRemoveImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUrlChange = (e) => {
        onChange(e.target.value);
    };

    const toggleInputMode = () => {
        setUseUrl(!useUrl);
        if (!useUrl) {
            // Switching to URL mode, clear the base64 image
            onChange('');
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {useUrl ? (
                <Box>
                    <TextField
                        fullWidth
                        label="Image URL"
                        value={value || ''}
                        onChange={handleUrlChange}
                        placeholder={placeholder}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={toggleInputMode}
                                    size="small"
                                    color="primary"
                                    title="Switch to file upload"
                                >
                                    <Upload />
                                </IconButton>
                            ),
                        }}
                        error={!!error}
                        helperText={error}
                    />
                    {value && !value.startsWith('data:image') && value.trim() !== '' && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Preview (from URL):
                            </Typography>
                            <Box
                                component="img"
                                src={value}
                                alt="Preview"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                }}
                                onError={() => setError('Invalid image URL')}
                            />
                        </Box>
                    )}
                </Box>
            ) : (
                <Box>
                    <Box
                        sx={{
                            border: dragActive
                                ? '2px dashed #1976d2'
                                : '2px dashed rgba(0, 0, 0, 0.23)',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            bgcolor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        {loading ? (
                            <CircularProgress size={40} />
                        ) : value && value.startsWith('data:image') ? (
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={value}
                                    alt="Uploaded preview"
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: -12,
                                        right: -12,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        '&:hover': {
                                            bgcolor: 'background.paper',
                                        },
                                    }}
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                    }}
                                >
                                    <X fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Upload color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="body1">
                                        Drag and drop an image here, or click to select
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Supports: JPG, PNG, GIF (max 5MB)
                                    </Typography>
                                    {error && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            {error}
                                        </Typography>
                                    )}
                                </Box>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Button
                            variant="text"
                            size="small"
                            onClick={toggleInputMode}
                            startIcon={<LinkIcon />}
                            sx={{ mx: 2 }}
                        >
                            Use URL instead
                        </Button>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ImageUpload;