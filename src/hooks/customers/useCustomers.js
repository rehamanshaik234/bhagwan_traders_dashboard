import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { setLoadingNew, setNewCustomers, setLoadingStats, setDailyStats, setMonthlyStats, } from "../../store/apps/customers/customersSlice";

export const useCustomers = () => {
  const dispatch = useDispatch();
  const { newCustomers, pagination, dailyStats, monthlyStats, loadingNew, loadingStats } = useSelector((s) => s.customers);

  const fetchNewCustomers = async (filters = {}) => {
    dispatch(setLoadingNew(true));
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/customer/new${query ? "?" + query : ""}`);
      if (res.data.success) {
        dispatch(setNewCustomers(res.data));
      }
    } catch (e) {
      console.error("Failed to fetch new customers:", e);
    } finally {
      dispatch(setLoadingNew(false));
    }
  };

  const fetchDailyStats = async (days = 30) => {
    dispatch(setLoadingStats(true));
    try {
      const res = await axios.get(`/customer/stats/daily`, { params: { days } });
      dispatch(setDailyStats(res.data.data || []));
    } catch (err) {
      console.error("Error fetching daily stats:", err);
    } finally {
      dispatch(setLoadingStats(false));
    }
  };

  const fetchMonthlyStats = async () => {
    dispatch(setLoadingStats(true));
    try {
      const res = await axios.get(`/customer/stats/monthly`);
      dispatch(setMonthlyStats(res.data.data || []));
    } catch (err) {
      console.error("Error fetching monthly stats:", err);
    } finally {
      dispatch(setLoadingStats(false));
    }
  };

  const exportStats = async () => {
    try {
      const res = await axios.get(`/customer/stats/export`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customer_stats.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export customer stats:", err);
    }
  };

  return { 
    newCustomers, 
    pagination, 
    loadingNew, 
    fetchNewCustomers, 
    dailyStats,
    monthlyStats,
    loadingStats,
    fetchDailyStats,
    fetchMonthlyStats,
    exportStats,};
};
