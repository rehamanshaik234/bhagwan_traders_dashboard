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
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useInventory } from "../../../hooks/inventory/useInventory";

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

  // Initial load
  useEffect(() => {
    getProducts();
    getCategories();
    getBrands();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      brand_id: "",
      category_id: "",
    });
    setModalOpen(true);
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
    } catch (err) {
      setToast({ open: true, type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyFilter = () => {
  // Remove empty filters
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "")
  );
  getProducts(activeFilters);
};

  return (
    <>
      <Breadcrumb title="Manage Products" items={BCrumb} />

      {/* Filters and Add Button */}
      <Box display="flex" justifyContent={"space-between"} flexWrap="wrap">
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
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
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
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              disabled={loading}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
        <Box mb={2}>
            <Button variant="outlined" onClick={openAddModal}>
              Add Product
            </Button>
        </Box>
      </Box>

      {/* Product Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ whiteSpace: "nowrap" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                  ? (products || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : (products || [])
                ).map((prod) => {
                const cat = categories.find((c) => c.id === prod.category_id);
                return (
                  <TableRow key={prod.id}>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>{cat ? cat.name : "-"}</TableCell>
                    <TableCell>{prod.price}</TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={prod.is_active ? "Active" : "Disabled"}
                        color={prod.is_active ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => openEditModal(prod)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={6}
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{ native: true }}
                  onPageChange={(e, p) => setPage(p)}
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

      {/* Add/Edit Modal */}
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
