import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_UNREACHABLE_MESSAGE } from "../utils/constants";
import apiClient from "../api/client";

export default function useDeleteStudent(id) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function handleDelete() {
    setDeleting(true);
    setActionError(null);

    try {
      const res = await apiClient.delete(`/${id}`, {
        validateStatus: () => true,
      });
      const body = res.data;

      if (res.status >= 400) {
        setActionError(body.message || "Could not delete the student.");
        setShowConfirm(false);
        return;
      }

      navigate("/students", { replace: true });
    } catch {
      setActionError(SERVER_UNREACHABLE_MESSAGE);
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  return {
    showConfirm,
    openConfirm: () => setShowConfirm(true),
    closeConfirm: () => setShowConfirm(false),
    deleting,
    actionError,
    handleDelete,
  };
}
