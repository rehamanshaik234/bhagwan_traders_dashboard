import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Snackbar,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSubCategory } from "../../../hooks/subCategory/useSubCategory";
import { useCategory } from "../../../hooks/category/useCategory";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Add Sub Category" },
];

const AddSubCategory = () => {
  const { addSubCategory } = useSubCategory();
  const { getAllCategories } = useCategory();

  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories();
      if (res?.status) setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category_id: "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      category_id: Yup.string().required("Category is required"),
      file: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category_id", values.category_id);
        formData.append("file", values.file);

        const res = await addSubCategory(formData);
        if (res.status) {
          setSnackbar({ open: true, message: res.message });
          resetForm();
          setImagePreview(null);
        } else {
          setSnackbar({ open: true, message: res.error || "Error occurred" });
        }
      } catch (err) {
        setSnackbar({ open: true, message: err.message || "Error occurred" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Breadcrumb title="Add Sub Category" items={BCrumb} />

      <Paper
        elevation={4}
        sx={{
          p: 4,
          // maxWidth: 720,
          mx: "auto",
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add Sub Category
        </Typography>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Category"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category_id && !!formik.errors.category_id}
                helperText={formik.touched.category_id && formik.errors.category_id}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                variant="outlined"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && !!formik.errors.description}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  hidden
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    formik.setFieldValue("file", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
              {formik.touched.file && formik.errors.file && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {formik.errors.file}
                </Typography>
              )}
            </Grid>

            {imagePreview && (
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Submitting..." : "Add Sub Category"}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
};

export default AddSubCategory;
