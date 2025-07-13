import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Typography,
  Snackbar,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../../utils/axios'; // adjust path based on your setup
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import {
  Autocomplete,
  Avatar,
  ListSubheader,
} from '@mui/material';


const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/manageProducts', title: 'Product' },
  { title: 'Add Product' },
];

const AddProduct = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const groupedSubCategories = subCategories.map((sub) => ({
  ...sub,
  group: sub.category?.name || 'Uncategorized',
}));

 useEffect(() => {
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get('/subcategories/allSubCategories');
      if (res.data?.status) {
        setSubCategories(res.data.data || []);
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to load sub-categories' });
    }
  };
  fetchSubCategories();
}, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      sub_category_id: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required').min(0),
      stock: Yup.number().required('Required').min(0),
      sub_category_id: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
    try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
        if (key === "files") {
            values.files.forEach((file) => formData.append("files", file));
        } else {
            formData.append(key, values[key]);
        }
        });

        const res = await axios.post("/products/addProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.status) {
        setSnackbar({ open: true, message: 'Product added successfully' });

        resetForm(); // ✅ Reset Formik
        setPreviewImages([]); // ✅ Clear previews
        if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ Clear input
        } else {
        setSnackbar({ open: true, message: 'Failed to add product' });
        }
    } catch (err) {
        setSnackbar({ open: true, message: '"Error while adding product"' });
    }
    }
  });

  return (
    <Box>
      <Breadcrumb title="Add Product" items={BCrumb} />

      <Paper elevation={3} sx={{ mt: 2, p: 3 }}>
        <Typography variant="h6" mb={3}>
          Add New Product
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                name="name"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && !!formik.errors.price}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && !!formik.errors.stock}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <Autocomplete
                options={groupedSubCategories}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option.name}
                value={
                groupedSubCategories.find(
                    (sub) => sub.id === formik.values.sub_category_id
                ) || null
                }
                onChange={(e, value) =>
                formik.setFieldValue('sub_category_id', value?.id || '')
                }
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Sub-Category"
                    fullWidth
                    error={
                    formik.touched.sub_category_id &&
                    Boolean(formik.errors.sub_category_id)
                    }
                    helperText={
                    formik.touched.sub_category_id && formik.errors.sub_category_id
                    }
                />
                )}
                renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Avatar
                    src={option.image_url}
                    alt={option.name}
                    sx={{ width: 30, height: 30, mr: 1 }}
                    />
                    <Typography variant="body2">{option.name}</Typography>
                </li>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description && !!formik.errors.description
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {previewImages.map((src, idx) => (
                  <Box key={idx} position="relative" display="inline-block">
                    <img
                      src={src}
                      alt={`Preview ${idx}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        const newPreviews = previewImages.filter((_, i) => i !== idx);
                        const newFiles = files.filter((_, i) => i !== idx);
                        setPreviewImages(newPreviews);
                        setFiles(newFiles);
                        formik.setFieldValue('files', newFiles);
                      }}
                      sx={{
                        minWidth: 0,
                        padding: 0,
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        zIndex: 2,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Product Images
                <input
                  ref={fileInputRef}
                  hidden
                  multiple
                  accept="image/*"
                  type="file"
                  name="files"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    const updatedFiles = [...files, ...newFiles];
                    const updatedPreviews = [
                      ...previewImages,
                      ...newFiles.map((file) => URL.createObjectURL(file)),
                    ];

                    setFiles(updatedFiles);
                    setPreviewImages(updatedPreviews);
                    formik.setFieldValue("files", updatedFiles);
                  }}
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Submit Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default AddProduct;
