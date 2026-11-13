import { NavLink } from "react-router-dom";
import "./navBar.css"

export default function navBar(){
    return(
        <>
            <div className="nav-list">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/students/add">Add Student</NavLink>
                <NavLink to="/students" className={"allStudent"}>All students</NavLink>
            </div>
        </>
    )
}