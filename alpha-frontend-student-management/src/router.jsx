import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import AddStudents from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Home from "./pages/Home";
import AllStudents from "./pages/AllStudents";
import StudentDetail from "./pages/StudentDetail";
import { studentsLoader } from "./components/students/Table";
import { studentLoader } from "./components/StudentForm";
import StudentDetails, { studentDetailsLoader } from "./pages/StudentDetails";
import ErrorPage from "./pages/ErrorPage";
import LoadingSpiner from "./components/LoadingSpiner";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/students",
        element: <AllStudents />,
        loader: studentsLoader,
        HydrateFallback: LoadingSpiner,
      },
      {
        path: "/students/add",
        element: <AddStudents />,
      },
      {
        path: "/students/:id",
        element: <StudentDetail />,
        loader: studentDetailsLoader,
        HydrateFallback: () => (
          <div className="loader-container">Loading student details...</div>
        ),
      },
      {
        path: "/students/:id/edit",
        element: <EditStudent />,
        loader: studentLoader,
        HydrateFallback: () => (
          <div className="loader-container">Loading student details...</div>
        ),
      },
    ],
  },
]);

export default router;
