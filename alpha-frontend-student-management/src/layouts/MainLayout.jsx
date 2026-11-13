import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import "./MainLayout.css";
import logo from "../assets/logo.png";
import menu_lines from "../assets/menu-outline.png";
import SideBar from "../components/Navigation/SideBar.jsx";
import NavBar from "../components/Navigation/navBar.jsx";

export default function MainLayout() {
  const isDesktop = useMediaQuery({ minWidth: 600 });

  console.log("Running on the server: " + import.meta.env.VITE_LOCAL_URL);
  return (
    <>
      <nav>
        <div className="logo">
          <img src={logo} alt="" />
          <h3>STUDENTSYNC</h3>
        </div>
        <input type="checkbox" id="menu" />
        {!isDesktop && (
          <>
            <label htmlFor="menu" className="toggle_menu">
              <img src={menu_lines} alt="" />
            </label>
            <SideBar />
          </>
        )}
        {isDesktop && <NavBar />}
      </nav>
      <Outlet />
    </>
  );
}
