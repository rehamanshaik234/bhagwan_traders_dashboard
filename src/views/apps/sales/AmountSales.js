import React, { useState, useEffect } from 'react';
import useSalesData from '../../../hooks/sales/useSalesData';
import axios from '../../../utils/axios';
import {
  Box, Typography, CircularProgress, Table, TableHead, TableBody, TableRow,
  TableCell, Tab, Tabs, Paper, TextField, MenuItem, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Users" },
];

const AmountSales = () => {
  const [view, setView] = useState('chart');
  const [chartType, setChartType] = useState('line');
  const [type, setType] = useState('monthly');
  const [filters, setFilters] = useState({ brand: '', product: '' });
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const { data, loading, error } = useSalesData({
    type,
    metric: 'amount',
    filters,
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandRes, productRes] = await Promise.all([
          axios.get('/products/getAllBrands'),
          axios.get('/products/getAllProducts?limit=1000')
        ]);
        if (brandRes.data.success) setBrands(brandRes.data.data);
        if (productRes.data.success) setProducts(productRes.data.data);
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    fetchFilters();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Breadcrumb title="Users" items={BCrumb} />
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: 100 }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </TextField>

        <TextField
          select
          name="brand"
          label="Filter by Brand"
          value={filters.brand}
          onChange={handleFilterChange}
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: 100 }}
        >
          <MenuItem value="">All</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b.id} value={b.name}>{b.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name="product"
          label="Filter by Product"
          value={filters.product}
          onChange={handleFilterChange}
          size="small"
          fullWidth
          sx={{ flex: 1, minWidth: 100 }}
        >
          <MenuItem value="">All</MenuItem>
          {products.map((p) => (
            <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
          ))}
        </TextField>

        {view === 'chart' && (
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, val) => val && setChartType(val)}
            size="small"
            sx={{ height: '40px', alignSelf: 'center' }}
          >
            <ToggleButton value="line">Line Chart</ToggleButton>
            <ToggleButton value="bar">Bar Chart</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      <Tabs value={view} onChange={(e, val) => setView(val)} sx={{ my: 5 }}>
        <Tab label="Chart" value="chart" />
        <Tab label="Table" value="table" />
      </Tabs>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : view === 'chart' ? (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 20, right: 40, left: 30, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                label={{ value: 'Date', position: 'insideBottom', offset: -1, style: { fontSize: 12 } }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{
                  value: 'Revenue (₹)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -10,
                  style: { fontSize: 12 }
                }}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="total_amount"
                stroke="#0f766e"
                name="Total Revenue"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                label={{ value: 'Date', position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{
                  value: 'Revenue (₹)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                }}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total_amount" fill="#0f766e" name="Total Revenue" />
            </BarChart>
          )}
        </ResponsiveContainer>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {data.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(item.label).toLocaleDateString()}</TableCell>
                    <TableCell>₹{item.total_amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                  <TableCell>Total</TableCell>
                  <TableCell>
                    ₹{data.reduce((acc, cur) => acc + cur.total_amount, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AmountSales;
