import { Icons } from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom"; 
import { Bell, LogOut, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenAuthoritastionModalVisiblity } from "../../redux/modal-slice";
import type { AuthType } from "../../@types";
import Cookies from "js-cookie";
import { Badge } from "antd";
import { useReduxSelector } from "../../hooks/useRedux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState<Partial<AuthType>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = useReduxSelector((state) => state.shopSlice);

  useEffect(() => {
    if (Cookies.get("user")) {
      const data: AuthType = JSON.parse(Cookies.get("user") as string);
      setUser(data);
    }
  }, []);

  const handleLoginClick = () => {
    if (user.name) {
      navigate("/profile");
    } else {
      dispatch(setOpenAuthoritastionModalVisiblity());
    }
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUser({});
    navigate("/");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Blogs", to: "/blogs" },
  ];

  return (
    <header className="w-[90%] m-auto p-4 flex items-center justify-between gap-4 border-b border-[#46A358]">
      <Icons.Logo_Svg />

      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="relative font-normal text-base leading-none text-[#3D3D3D] hover:text-[#2e2e2e] cursor-pointer 
              after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full 
              after:h-[2px] after:bg-green-600 after:transition-all after:duration-300"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Search className="w-[20px] h-[20px] text-[#3D3D3D] cursor-pointer" />
        <Bell className="w-[20px] h-[20px] text-[#3D3D3D] cursor-pointer" />
        <Link to={"/shop"}>
          <Badge count={data.length}>
            <ShoppingCart className="w-[20px] h-[20px] text-[#3D3D3D] cursor-pointer" />
          </Badge>
        </Link>

        <button
          onClick={handleLoginClick}
          className="w-[100px] h-[35px] bg-[#46A358] text-white border-2 border-[#46A358] rounded-md
            flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-200"
        >
          <LogOut className="w-[20px] h-[20px] text-white" />
          <span className="font-medium text-base leading-none text-white">
            {user.name ? user.name : "Login"}
          </span>
        </button>

        {user.name && (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block text-sm text-[#FF4D4F] underline"
          >
            Logout
          </button>
        )}

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-4 mt-2">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="text-[#3D3D3D] font-medium text-base border-b border-gray-200 pb-2"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLoginClick}
              className="text-[#46A358] font-medium text-base"
            >
              {user.name ? "Profile" : "Login"}
            </button>
            {user.name && (
              <button
                onClick={handleLogout}
                className="text-[#FF4D4F] font-medium text-base"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
