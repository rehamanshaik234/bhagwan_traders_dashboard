import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Snackbar,
  Autocomplete,
  TextField,
  TablePagination,
} from "@mui/material";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useCategory } from "../../../hooks/category/useCategory";
import { useNavigate } from "react-router";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "All Categories" },
];

const AllCategories = () => {
  const {
    getAllCategories,
    getCategoryById,
    categories,
    loading,
  } = useCategory();
  
  const [filteredData, setFilteredData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    setFilteredData(categories);
  }, [categories]);

  const handleSearch = async (option) => {
    if (!option) {
      setFilteredData(categories);
      return;
    }

    try {
      const res = await getCategoryById(option.id);
      if (res.status && res.data) {
        setFilteredData([res.data]);
        setPage(0);
      } else {
        setFilteredData([]);
        setSnackbar({ open: true, message: "Category not found." });
      }
    } catch {
      setSnackbar({ open: true, message: "Error while searching." });
    }
  };

  const paginatedData =
    rowsPerPage > 0
      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredData;

  return (
    <Box>
      <Breadcrumb title="All Categories" items={BCrumb} />

      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Categories List
        </Typography>

        <Box display="flex" gap={2} mb={2} flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
          <Box display='flex' gap={2}>
          <Autocomplete
            disablePortal
            options={categories}
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedOption}
            onChange={(event, newValue) => {
              setSelectedOption(newValue);
              handleSearch(newValue);
            }}
            sx={{ minWidth: 300 }}
            renderInput={(params) => <TextField {...params} label="Search Category" size="small" />}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedOption(null);
              setFilteredData(categories);
              setPage(0);
            }}
          >
            Clear
          </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/addCategory")
              }}
            >
              Add Category
          </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {loading ? "Loading..." : "No categories found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
};

export default AllCategories;
