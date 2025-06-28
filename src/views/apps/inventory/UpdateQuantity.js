import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  TablePagination,
} from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useInventory } from "../../../hooks/inventory/useInventory";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Update Stock" },
];

const UpdateQuantity = () => {
  const { getProducts, products, updateStock, categories, getCategories, brands, getBrands } =
    useInventory();

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getProducts();
    getCategories();
    getBrands();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);

      if (search && filtered.length === 0) {
    setToast({
      open: true,
      message: "No products found for the search term.",
      type: "warning",
    });
  }
  }, [products, search]);

  const openUpdateDialog = (prod) => {
    setSelectedProduct(prod);
    setNewStock(prod.stock);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateStock(selectedProduct.id, parseInt(newStock));
      setToast({ open: true, message: "Stock updated", type: "success" });
      setOpenDialog(false);
      getProducts(); // Refresh list
    } catch (err) {
      setToast({ open: true, message: "Update failed", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Update Stock" items={BCrumb} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={1}>
        <TextField
          label="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
      </Box>

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((prod) => {
                const brand = brands.find((b) => b.id === prod.brand_id);
                const category = categories.find((c) => c.id === prod.category_id);
                return (
                  <TableRow key={prod.id}>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>{category?.name || "-"}</TableCell>
                    <TableCell>{brand?.name || "-"}</TableCell>
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
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openUpdateDialog(prod)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Update Dialog */}
      <Dialog open={openDialog} onClose={() => !submitting && setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <TextField
              label="Stock Quantity"
              fullWidth
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
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

export default UpdateQuantity;
