import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TableFooter, TablePagination, TextField, Button, CircularProgress,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useCustomers } from "../../../hooks/customers/useCustomers";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "New Customers" },
];

const NewCustomers = () => {
  const { newCustomers, pagination, loadingNew, fetchNewCustomers } = useCustomers();
  const defaultFilters = { name: "", email: "", number: "", from: "", to: "" };
  const [filters, setFilters] = useState(defaultFilters);

  const theme = useTheme();

  useEffect(() => {
    fetchNewCustomers({ page: 1, limit: pagination.limit });
  }, []);

  const applyFilter = () => {
    fetchNewCustomers({ ...filters, page: 1, limit: pagination.limit });
  };

  return (
    <>
      <Breadcrumb title="New Customers" items={BCrumb} />
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        {["name", "email", "number", "from", "to"].map((key) => (
          <TextField
            key={key}
            label={
              key === "from" || key === "to"
                ? key === "from"
                  ? "From"
                  : "To"
                : key.charAt(0).toUpperCase() + key.slice(1)
            }
            size="small"
            type={key === "from" || key === "to" ? "date" : "text"}
            value={filters[key]}
            onChange={(e) => setFilters((x) => ({ ...x, [key]: e.target.value }))}
            InputLabelProps={
              key === "from" || key === "to" ? { shrink: true } : undefined
            }
          />
        ))}
          <Button variant="contained" disabled={loadingNew} onClick={applyFilter}>
            {loadingNew ? <CircularProgress size={20} /> : "Apply Filter"}
          </Button>
        <Box display="flex" justifyContent="flex-end" mb={1}>
        <Button
            variant="outlined"
            onClick={() => {
              setFilters(defaultFilters);
              fetchNewCustomers({ page: 1, limit: pagination.limit });
            }}
          >
            Reset
        </Button>
        </Box>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newCustomers.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.number}</TableCell>
                <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {newCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loadingNew ? "Loading..." : "No customers found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={pagination.total}
                page={pagination.page - 1}
                rowsPerPage={pagination.limit}
                rowsPerPageOptions={[5,10,25, {label:"All",value:-1}]}
                onPageChange={(e, pg) => fetchNewCustomers({ ...filters, page: pg+1, limit: pagination.limit })}
                onRowsPerPageChange={(e) => {
                  const lim = parseInt(e.target.value,10);
                  fetchNewCustomers({ ...filters, page: 1, limit: lim });
                }}
                ActionsComponent={({count,page,rowsPerPage,onPageChange}) => (
                  <Box sx={{ flexShrink:0, ml:2.5 }}>
                    <IconButton onClick={e=>onPageChange(e,0)} disabled={page===0}>
                      {theme.direction==="rtl"?<LastPageIcon />:<FirstPageIcon/>}
                    </IconButton>
                    <IconButton onClick={e=>onPageChange(e,page-1)} disabled={page===0}>
                      {theme.direction==="rtl"?<KeyboardArrowRight/>:<KeyboardArrowLeft/>}
                    </IconButton>
                    <IconButton
                      onClick={e=>onPageChange(e,page+1)}
                      disabled={page>=Math.ceil(count/rowsPerPage)-1}
                    >
                      {theme.direction==="rtl"?<KeyboardArrowLeft/>:<KeyboardArrowRight/>}
                    </IconButton>
                    <IconButton
                      onClick={e=>onPageChange(e,Math.max(0,Math.ceil(count/rowsPerPage)-1))}
                      disabled={page>=Math.ceil(count/rowsPerPage)-1}
                    >
                      {theme.direction==="rtl"?<FirstPageIcon/>:<LastPageIcon/>}
                    </IconButton>
                  </Box>
                )}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </>
  );
};

export default NewCustomers;
