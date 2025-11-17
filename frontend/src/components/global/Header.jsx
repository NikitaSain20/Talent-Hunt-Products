import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { CartIcon } from "../icons/ProductIcons";

const Header = () => {
  const { getTotalItems } = useContext(CartContext);
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-cyan-800 text-white px-6 py-4 flex justify-between items-center relative">
      <Link to={isAdmin ? "/admin" : "/"}>
        <h1 className="text-2xl font-bold">Talent Hunt Products</h1>
      </Link>

      <ul className="flex space-x-6 items-center font-medium">
        {!isLoggedIn && (
          <>
            <li>
              <a href="/login" className="hover:text-gray-200">
                Login
              </a>
            </li>
            <li>
              <a href="/signup" className="hover:text-gray-200">
                Signup
              </a>
            </li>
          </>
        )}

        {isLoggedIn && isAdmin && (
          <>
            <li>
              <Link to="/admin" className="hover:text-gray-200">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </li>
          </>
        )}

        {isLoggedIn && !isAdmin && (
          <>
            <li>
              <a href="/orders" className="hover:text-gray-200">
                Orders
              </a>
            </li>
            <li>
              <Link to="/cart" className="relative">
                <CartIcon size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
