import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout } from '../../store/apps/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = (username, password) => dispatch(loginUser({ username, password }));
  const logoutUser = () => dispatch(logout());

  return {
    user,
    token,
    loading,
    error,
    login,
    logoutUser,
    isAuthenticated: !!token,
  };
};

export default useAuth;
