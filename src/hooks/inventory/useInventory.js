// Updated useInventory.js with getCategories function
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setCategories, setMeta } from "../../store/apps/inventory/inventorySlice";
import axios from "../../utils/axios";
import { useState } from "react";

export const useInventory = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.inventory.products) || [];
  const categories = useSelector((state) => state.inventory.categories);
  const loading = useSelector((state) => state.inventory.loading);
  const { meta } = useSelector((state) => state.inventory);
  const [brands, setBrands] = useState([]);
    
    const getProducts = async (filters = {}) => {
      try {
        dispatch(setLoading(true));
        const query = new URLSearchParams(filters).toString();
        const response = await axios.get(`/products/allProducts?${query}`);
        console.log(response.data.meta)
        if (response.data.success) {
          dispatch(setProducts(response.data.data || []));
          dispatch(setMeta(response.data.meta));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateStock = async (id, stock) => {
    try {
      await axios.put(`/products/updateQuantity/${id}`, { stock: Number(stock) });
      getProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get('/categories/getAll');
      console.log(response)
      if (response.data.status) {
        dispatch(setCategories(response.data.data));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const addOrEditProduct = async (id, data) => {
    try {
      const url = id ? `/products/editProduct/${id}` : "/products/addProduct";
      const method = id ? "put" : "post";
      const response = await axios[method](url, data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Add/Edit error:", error);
      throw error;
    }
  };

  const getBrands = async () => {
    const res = await axios.get("/products/getAllBrands");
    if (res.data.success) setBrands(res.data.data);
  };

  const enableProduct = async (id) => {
    try {
      const res = await axios.put(`/products/enableProduct/${id}`);
      return res.data;
    } catch (err) {
      console.error("Enable product error:", err);
      throw err;
    }
  };


  const addProduct = async (id, data) => {
    try {
      const url = "/products/addProduct";
      const method = "post";
      const response = await axios[method](url, data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Add/Edit error:", error);
      throw error;
    }
  };

  const addNewProductWithImages = async (formData) => {
    try {
      const response = await axios.post("/products/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!response.data.status) {
        throw new Error(response.data.error || "Failed to add product");
      }
      return response.data;
    } catch (error) {
      console.error("Error adding product with images:", error);
      throw error;
    }
  };


  return {
    getProducts,
    updateStock,
    products,
    loading,
    getCategories,
    categories,
    addOrEditProduct,
    addProduct,
    addNewProductWithImages,
    getBrands,
    brands,
    meta,
    enableProduct,
  };
};