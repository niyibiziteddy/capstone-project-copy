import { useParams } from "react-router-dom"
import StudentForm from "../components/StudentForm.jsx"

export default function EditStudent() {
    const { id } = useParams()
    return <StudentForm key={id} mode="edit" id={id} />
}
