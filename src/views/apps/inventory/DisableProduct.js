import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  Chip,
  TableFooter,
  TablePagination,
  IconButton,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useInventory } from "../../../hooks/inventory/useInventory";

// Pagination action buttons
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
  { title: "Disabled Products" },
];

const DisableProduct = () => {
  const { getProducts, products, categories } = useInventory();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getProducts({ is_active: 0 });
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducts =
    rowsPerPage > 0
      ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : products;

  return (
    <Box>
      <Breadcrumb title="Disabled Products" items={BCrumb} />

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Disabled Product List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((prod) => {
                  const category = categories.find((cat) => cat.id === prod.category_id);
                  return (
                    <TableRow key={prod.id}>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell>{category?.name || "-"}</TableCell>
                      <TableCell>{prod.price}</TableCell>
                      <TableCell>{prod.stock}</TableCell>
                      <TableCell>
                        <Chip label="Disabled" color="default" size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No disabled products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{ native: true }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DisableProduct;
