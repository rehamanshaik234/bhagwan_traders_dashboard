import { useCallback, useState } from "react";
import axiosInstance from "../../utils/axios";

export const useCategory = () => {
     const [categories, setCategories] = useState([]);
     const [loading, setLoading] = useState(false);


  const addCategory = useCallback(async (formData) => {
    try {
      const res = await axiosInstance.post("/categories/addCategory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return { status: false, error: error.message };
    }
  }, []);

    // Get All Categories
    const getAllCategories = useCallback(async () => {
    setLoading(true);
    try {
        const res = await axiosInstance.get("/categories/allCategories");
        if (res.data.status) {
        setCategories(res.data.data || []);
        }
        return res.data; // ✅ Return response
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { status: false, error: error.message }; // ✅ Return fallback error
    } finally {
        setLoading(false);
    }
    }, []);

  // Get Category by ID
  const getCategoryById = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(`/categories/categoryById?id=${id}`);
      return res.data;
    } catch (error) {
      return { status: false, error: error.message };
    }
  }, []);

  return { 
    addCategory,
    getAllCategories,
    getCategoryById,
    categories,
    loading, 
};
};
