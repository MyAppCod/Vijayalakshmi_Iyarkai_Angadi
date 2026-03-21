import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar      from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Home         from './pages/Home';
import ShopProducts from './pages/ShopProducts';
import Login        from './pages/Login';
import Register     from './pages/Register';
import About        from './pages/About';

// Customer pages
import Cart      from './pages/Cart';
import Checkout  from './pages/Checkout';
import Profile   from './pages/Profile';
import MyOrders  from './pages/MyOrders';

// Admin pages
import AdminDashboard from './pages/Dashboard';
import AdminProducts  from './pages/Products';
import AdminOrders    from './pages/Orders';
import AdminUsers     from './pages/Users';
import AdminContent   from './pages/Content';
import Finance        from './pages/Finance';
import POS            from './pages/POS';
import Reports        from './pages/Reports';

const ADMIN_MGR       = ['admin', 'manager'];
const ADMIN_MGR_STAFF = ['admin', 'manager', 'staff'];
const ADMIN_ONLY      = ['admin'];

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/"         element={<Home />} />
        <Route path="/products" element={<ShopProducts />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about"    element={<About />} />

        {/* CUSTOMER PROTECTED */}
        <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders"   element={<PrivateRoute><MyOrders /></PrivateRoute>} />

        {/* ADMIN + MANAGER */}
        <Route path="/admin"          element={<PrivateRoute rolesAllowed={ADMIN_MGR}      ><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute rolesAllowed={ADMIN_MGR}      ><AdminProducts  /></PrivateRoute>} />
        <Route path="/admin/orders"   element={<PrivateRoute rolesAllowed={ADMIN_MGR}      ><AdminOrders    /></PrivateRoute>} />
        <Route path="/admin/finance"  element={<PrivateRoute rolesAllowed={ADMIN_MGR}      ><Finance        /></PrivateRoute>} />
        <Route path="/admin/reports"  element={<PrivateRoute rolesAllowed={ADMIN_MGR}      ><Reports        /></PrivateRoute>} />

        {/* ADMIN + MANAGER + STAFF */}
        <Route path="/admin/pos"      element={<PrivateRoute rolesAllowed={ADMIN_MGR_STAFF}><POS            /></PrivateRoute>} />

        {/* ADMIN ONLY */}
        <Route path="/admin/users"    element={<PrivateRoute rolesAllowed={ADMIN_ONLY}     ><AdminUsers     /></PrivateRoute>} />
        <Route path="/admin/content"  element={<PrivateRoute rolesAllowed={ADMIN_ONLY}     ><AdminContent   /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
