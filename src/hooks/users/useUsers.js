import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { setUsers, setLoadingUsers } from "../../store/apps/userProfile/usersSlice";

export const useUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.users);

  const getUsers = async () => {
    dispatch(setLoadingUsers(true));
    try {
      const res = await axios.get("/user/getUsers");
      if (res.data.success) dispatch(setUsers(res.data.users));
    } catch (err) {
      console.error("Fetch users failed", err);
    } finally {
      dispatch(setLoadingUsers(false));
    }
  };

  const addUser = async (user) => {
    console.log(user)
    await axios.post("/user/addUser", user);
}
  const updateUser = async (id, user) => await axios.put(`/user/updateUser/${id}`, user);
  const deleteUser = async (id) => await axios.delete(`/user/deleteUser/${id}`);
  const changePassword = async (id, data) => await axios.put(`/user/userChangePassword/${id}`, data);

  return { users, loading, getUsers, addUser, updateUser, deleteUser, changePassword };
};
