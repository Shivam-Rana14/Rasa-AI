import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReports, deleteReportByDate } from "../utils/http";
import Section from "./Section";
import LoadingSpinner from "./LoadingSpinner";
import Notification from "./Notification";
import ReportCard from "./ReportCard";

const Profile = () => {
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  const queryClient = useQueryClient();
  const [deletingDate, setDeletingDate] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: deleteReportByDate,
    onMutate: (date) => setDeletingDate(date),
    onSettled: () => setDeletingDate(null),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
    },
  });

  const reports = data?.analysisReports || []

  return (
    <>
      {deleteMutation.isLoading && <LoadingSpinner />}
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
                {!loading && !error && reports.length === 0 && (
                  <div className="text-n-3 text-center">
                    No analysis reports found.
                  </div>
                )}
                {!loading && reports.length > 0 && (
                  <div className="space-y-6">
                    {deleteMutation.isError && (
                      <Notification message={deleteMutation.error?.message || "Failed to delete report."} type="error" />
                    )}
                    {reports.map((report, idx) => (
                      <ReportCard
                        key={idx}
                        report={report}
                        idx={idx}
                        total={reports.length}
                        onDelete={() => deleteMutation.mutate(report.date)}
                        deleting={deletingDate === report.date}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Profile;
