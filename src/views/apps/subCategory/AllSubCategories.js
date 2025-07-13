import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Avatar,
  TextField,
  MenuItem,
  CircularProgress,
  Button,
} from '@mui/material';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { useSubCategory } from '../../../hooks/subCategory/useSubCategory';
import { useCategory } from '../../../hooks/category/useCategory';
import { useNavigate } from 'react-router';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'All Sub Categories' },
];

const AllSubCategory = () => {
  const { getAllSubCategories, getSubCategoryById, getSubCategoryByCategoryId } = useSubCategory();
  const { getAllCategories } = useCategory();
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState([]);
  const [allSubCategoryOptions, setAllSubCategoryOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const res = await getAllSubCategories();
    if (res?.status) {
      setSubCategories(res.data);
      setAllSubCategoryOptions(res.data); // For dropdown options
    }
    setLoading(false);
  };

  const handleCategoryFilter = async (id) => {
    setSelectedCategory(id);
    setSelectedSubCategoryId('');
    setLoading(true);
    if (id) {
      const res = await getSubCategoryByCategoryId(id);
      if (res?.status) setSubCategories(res.data);
    } else {
      await fetchAll();
    }
    setLoading(false);
  };

  const handleSubCategoryIdFilter = async (id) => {
    setSelectedCategory('');
    setSelectedSubCategoryId(id);
    if (!id) return await fetchAll();

    setLoading(true);
    const res = await getSubCategoryById(id);
    if (res?.status && res.data) {
      setSubCategories([res.data]);
    } else {
      setSubCategories([]);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSubCategoryId('');
    fetchAll();
  };

  useEffect(() => {
    const load = async () => {
      const catRes = await getAllCategories();
      if (catRes?.status) setCategories(catRes.data);
      await fetchAll();
    };
    load();
  }, []);

  return (
    <>
      <Breadcrumb title="All Sub Categories" items={BCrumb} />

      <Box sx={{ p: 2 }}>
        {/* Filters */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
        >
          <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
          >
          {/* Filter by Category */}
          <TextField
            label="Filter by Category"
            select
            size="small"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Filter by SubCategory ID Dropdown */}
          <TextField
            label="Filter by Sub Category"
            select
            size="small"
            value={selectedSubCategoryId}
            onChange={(e) => handleSubCategoryIdFilter(e.target.value)}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">All Sub Categories</MenuItem>
            {allSubCategoryOptions.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.id} - {sub.name}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          </Box>
          <Box>
            <Button 
            variant="outlined"               
            onClick={() => {
                navigate("/addSubCategory")
              }}>
              Add Sub Category
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : subCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No subcategories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subCategories.map((sub, i) => (
                    <TableRow key={sub.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Avatar
                          src={
                            sub.image_url?.startsWith('http')
                              ? sub.image_url
                              : `https://materialmart.shop${sub.image_url?.replace('D:', '')}`
                          }
                          alt={sub.name}
                          variant="rounded"
                        />
                      </TableCell>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell>{sub.description}</TableCell>
                      <TableCell>{sub.category?.name || '-'}</TableCell>
                      <TableCell>
                        {new Date(sub.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default AllSubCategory;
