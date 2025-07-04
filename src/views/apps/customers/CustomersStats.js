import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, CircularProgress, Button,
  TextField,
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, LabelList
} from "recharts";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { useCustomers } from "../../../hooks/customers/useCustomers";
import moment from "moment";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Customer Stats" },
];

const formatDate = (dateStr) => moment(dateStr).format("DD MMM"); // e.g., 05 Jul
const formatMonth = (monthStr) => moment(monthStr, "YYYY-MM").format("MMM YYYY"); // e.g., Jun 2025

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
        {/* DAILY STATS */}
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
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(value) => `Date: ${formatDate(value)}`}
                    formatter={(value) => [`${value}`, "Customers"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_customers"
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  >
                    <LabelList dataKey="total_customers" position="top" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* MONTHLY STATS */}
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
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(value) => `Month: ${formatMonth(value)}`}
                    formatter={(value) => [`${value}`, "Customers"]}
                  />
                  <Bar dataKey="total_customers" fill="#2e7d32">
                    <LabelList dataKey="total_customers" position="top" />
                  </Bar>
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
