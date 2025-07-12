import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
} from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCategory } from "../../../hooks/category/useCategory";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Add Category" },
];

const AddCategory = () => {
  const { addCategory } = useCategory();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
});

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      file: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("file", values.file);

        const res = await addCategory(formData);

        if (res?.status) {
        setSnackbar({ open: true, message: "Category added successfully" });
        resetForm();
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
        setSnackbar({ open: true, message: res?.error || "Failed to add category" });
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Error while adding category" });
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("file", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box>
      <Breadcrumb title="Add Category" items={BCrumb} />

      <Paper sx={{ mt: 2, p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Create New Category
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>
              {formik.touched.file && formik.errors.file && (
                <Typography color="error" variant="body2">
                  {formik.errors.file}
                </Typography>
              )}
            </Grid>

            {preview && (
              <Grid item xs={12}>
                <Box mt={1}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      </Paper>
    </Box>
  );
};

export default AddCategory;
