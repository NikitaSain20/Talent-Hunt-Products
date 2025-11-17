import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./components/context/AuthContext.jsx";

import Header from "./components/global/Header.jsx";
import Footer from "./components/global/Footer.jsx";
import Login from "./components/forms/Login.jsx";
import Signup from "./components/forms/SignUp.jsx";
import ProductsGrid from "./components/pages/ProductGrid.jsx";
import Cart from "./components/pages/Cart.jsx";
import Orders from "./components/pages/Orders.jsx";
import AdminDashboard from "./components/pages/AdminDashboard.jsx";

function App() {
  const { isLoggedIn, isAdmin, isInitialized } = useContext(AuthContext);

  if (!isInitialized) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <Navigate to="/admin" />
                ) : (
                  <ProductsGrid />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isLoggedIn && isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/cart"
            element={
              isLoggedIn && !isAdmin ? <Cart /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/orders"
            element={
              isLoggedIn && !isAdmin ? <Orders /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login />
              ) : isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
