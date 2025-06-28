import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, CircularProgress, Button,
  TextField,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useCustomers } from "../../../hooks/customers/useCustomers";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Customer Stats" },
];

const CustomersStats = () => {
  const {
    dailyStats,
    monthlyStats,
    fetchDailyStats,
    fetchMonthlyStats,
    exportStats,
    loadingStats,
  } = useCustomers();

  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchDailyStats(days);
    fetchMonthlyStats();
  }, [days]);

  return (
    <>
      <Breadcrumb title="Customer Statistics" items={BCrumb} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Statistics Overview (Last {days} Days)</Typography>
        <Box display="flex" gap={2}>
          <TextField
            type="number"
            label="Days"
            size="small"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            sx={{ width: 120 }}
          />
          <Button variant="outlined" onClick={exportStats}>
            Export CSV
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Daily New Customers
            </Typography>
            {loadingStats ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_customers" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Monthly New Customers
            </Typography>
            {loadingStats ? (
              <CircularProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_customers" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default CustomersStats;
