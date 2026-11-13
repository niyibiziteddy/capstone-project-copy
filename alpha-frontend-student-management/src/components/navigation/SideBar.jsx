import "./sideBar.css"
import { NavLink } from "react-router-dom"


export default function sideBar(){
    return(
        <>
            <div className="container">
                <div className="nav-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/students/add">Add Student</NavLink>
                    <NavLink to="/students" >All students</NavLink>
                </div>
            </div>
            
            
        </>
    )
}