import axiosInstance from '../../utils/axios';
import axios from 'axios';

export const useSubCategory = () => {
  const getAllSubCategories = async () => {
    const response = await axiosInstance.get('/subcategories/allSubCategories');
    return response.data;
  };

  const getSubCategoryById = async (id) => {
    const response = await axiosInstance.get(`/subcategories/subCategoryById?id=${id}`);
    return response.data;
  };

  const getSubCategoryByCategoryId = async (categoryId) => {
    const response = await axiosInstance.get(`/subcategories/subCategoryByCategoryId?categoryId=${categoryId}`);
    return response.data;
  };

  const addSubCategory = async (formData) => {
    const response = await axios.post('https://materialmart.shop/materialmartapi/subcategories/addSubCategory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  return {
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoryByCategoryId,
    addSubCategory,
  };
};
