import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  TableContainer,
  TableFooter,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Typography,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useInventory } from "../../../hooks/inventory/useInventory";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Manage Products" },
];

const ManageProduct = () => {
  const {
    getProducts,
    products,
    loading,
    getCategories,
    categories,
    addOrEditProduct,
    getBrands,
    brands,
  } = useInventory();

  const [filters, setFilters] = useState({
    brand_id: "",
    category_id: "",
    name: "",
    is_active: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brand_id: "",
    category_id: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { meta } = useSelector((state) => state.inventory);

  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  useEffect(() => {
    fetchProductList();
  }, [filters, page, rowsPerPage]);

  const fetchProductList = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    getProducts({
      ...activeFilters,
      page: page + 1,
      limit: rowsPerPage,
      sort: "p.created_at",
      order: "desc",
    });
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      brand_id: prod.brand_id,
      category_id: prod.category_id,
    });
    setModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

    const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addOrEditProduct(editingProduct?.id, formData);
      setToast({
        open: true,
        type: "success",
        message: editingProduct ? "Product updated!" : "Product added!",
      });
      setModalOpen(false);
      getProducts(filters);
      fetchProductList()
    } catch (err) {
      setToast({ open: true, type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Manage Products" items={BCrumb} />

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <TextField
            label="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            size="small"
          />
          <FormControl sx={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select
              labelId="brand-label"
              value={filters.brand_id}
              label="Brand"
              onChange={(e) => setFilters({ ...filters, brand_id: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {brands.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={filters.category_id}
              label="Category"
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={filters.is_active}
              label="Status"
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Disabled</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <Button variant="contained" onClick={() => navigate("/addProducts")}>Add Product</Button>
        </Box>
      </Box>

      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((head) => (
                  <TableCell key={head} align="center" sx={{ fontWeight: 600 }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell align="center">
                    <img src={prod.image_urls?.[0] || "/no-image.png"} alt={prod.name} width={40} height={40} style={{ borderRadius: 4, objectFit: "cover" }} />
                  </TableCell>
                  <TableCell align="center">{prod.name}</TableCell>
                  <TableCell align="center">{prod.category?.name || "-"}</TableCell>
                  <TableCell align="center">₹{prod.price}</TableCell>
                  <TableCell align="center">{prod.stock}</TableCell>
                  <TableCell align="center">
                    <Chip label={prod.is_active ? "Active" : "Disabled"} color={prod.is_active ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button variant="outlined" size="small" onClick={() => handleViewProduct(prod)}>View</Button>
                      <Button variant="outlined" size="small" onClick={() => openEditModal(prod)}>Edit</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={meta.total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>

        <Dialog open={modalOpen} onClose={() => !submitting && setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            {["name", "description", "price", "stock"].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                type={["price", "stock"].includes(field) ? "number" : "text"}
              />
            ))}
            <FormControl fullWidth variant="outlined">
              <InputLabel id="modal-brand-label">Brand</InputLabel>
              <Select
                labelId="modal-brand-label"
                value={formData.brand_id}
                label="Brand"
                onChange={(e) =>
                  setFormData({ ...formData, brand_id: parseInt(e.target.value) })
                }
              >
                {brands.map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="modal-category-label">Category</InputLabel>
              <Select
                labelId="modal-category-label"
                value={formData.category_id}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Add brand input/select as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} variant="contained">
            {submitting ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
      >
          <DialogTitle sx={{ fontWeight: "bold", pb: 0 }}>Product Details</DialogTitle>
          <DialogContent dividers sx={{ pt: 2 }}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
              <Box>
                <img
                  src={selectedProduct?.image_urls?.[0] || "/no-image.png"}
                  alt="Main"
                  width={180}
                  height={180}
                  style={{ borderRadius: 12, objectFit: "cover", border: "1px solid #ddd" }}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>{selectedProduct?.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedProduct?.description}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Typography><strong>Price:</strong> ₹{selectedProduct?.price}</Typography>
                  <Typography><strong>Stock:</strong> {selectedProduct?.stock}</Typography>
                  <Typography><strong>Category:</strong> {selectedProduct?.category?.name}</Typography>
                  <Typography><strong>Sub-Category:</strong> {selectedProduct?.sub_category?.name}</Typography>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    <Chip
                      size="small"
                      label={selectedProduct?.is_active ? "Active" : "Disabled"}
                      color={selectedProduct?.is_active ? "success" : "default"}
                    />
                  </Typography>
                </Box>
              </Box>
            </Box>

            {selectedProduct?.image_urls?.length > 1 && (
              <>
                <Typography mt={3} mb={1} variant="subtitle1">More Images</Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {selectedProduct?.image_urls?.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${idx}`}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                    />
                  ))}
                </Box>
              </>
            )}
          </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ManageProduct;
