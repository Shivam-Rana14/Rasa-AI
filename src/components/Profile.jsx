import React, { useEffect, useState } from "react";
import Section from "./Section";
import LoadingSpinner from "./LoadingSpinner";
import Notification from "./Notification";
import ReportCard from "./ReportCard";

const Profile = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${BACKEND_URL}/api/auth/analysis-reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch analysis reports");
        }
        const data = await res.json();
        setReports(data.analysisReports || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const deleteReport = async (report) => {
    setDeleteError(null);
    setDeletingId(report._id || report.date); // fallback to date if no _id
    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_API_URL;
      // Use _id if present, else date as identifier
      const id = report._id || report.date;
      const res = await fetch(`${BACKEND_URL}/api/auth/analysis-reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete report");
      }
      setReports((prev) => prev.filter((r) => (r._id || r.date) !== id));
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Section className="relative min-h-[calc(100vh-80px)] flex items-center py-12">
      <div className="container h-full">
        <div className="flex flex-col h-full">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-n-1 bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="mx-auto mt-4 text-lg text-n-3 max-w-2xl">
              View your previous skin tone analysis reports below.
            </p>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-n-7/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 border border-n-6 shadow-xl">
              {loading && <LoadingSpinner />}
              {error && <Notification message={error} type="error" />}
              {deleteError && <Notification message={deleteError} type="error" />}
              {!loading && !error && reports.length === 0 && (
                <div className="text-n-3 text-center">
                  No analysis reports found.
                </div>
              )}
              {!loading && !error && reports.length > 0 && (
                <div className="space-y-6">
                  {reports.map((report, idx) => (
                    <ReportCard
                      key={report._id || report.date || idx}
                      report={report}
                      idx={idx}
                      total={reports.length}
                      onDelete={deleteReport}
                      deleting={deletingId === (report._id || report.date)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Profile;
