import { useEffect, useState } from "react";
import {
  REQUIRED_FIELDS,
  INCOMPLETE_DATA_MESSAGE,
  SERVER_UNREACHABLE_MESSAGE,
} from "../utils/constants";
import apiClient from "../api/client";
export default function useStudent(id) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setStudent(null);

      try {
        const res = await apiClient.get(`/${id}`, {
          validateStatus: () => true,
        });
        const body = res.data;
        if (cancelled) return;

        if (res.status >= 400) {
          if (res.status === 404 || res.status === 400) {
            setNotFound(true);
          } else {
            setError(body.message || "Something went wrong");
          }
          return;
        }

        const missingFields = REQUIRED_FIELDS.filter(
          (field) => body.data?.[field] == null || body.data[field] === "",
        );

        if (missingFields.length > 0) {
          setError(INCOMPLETE_DATA_MESSAGE);
          return;
        }

        setStudent({
          ...body.data,
          dateOfBirth: String(body.data.dateOfBirth || "").slice(0, 10),
          enrollmentDate: String(body.data.enrollmentDate || "").slice(0, 10),
        });
      } catch {
        if (!cancelled) setError(SERVER_UNREACHABLE_MESSAGE);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStudent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { student, setStudent, loading, error, notFound };
}
