import { Navigate } from 'react-router-dom';

// rolesAllowed: array of roles e.g. ['admin','manager','staff']
// roleRequired: single role string (legacy, still supported)
const PrivateRoute = ({ children, rolesAllowed, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user'));

  if (!token) return <Navigate to="/login" />;

  const allowed = rolesAllowed || (roleRequired ? [roleRequired] : null);
  if (allowed && !allowed.includes(user?.role)) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
