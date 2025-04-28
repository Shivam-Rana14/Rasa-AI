export const fetchReports = async () => {
  try {
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${BACKEND_URL}/api/profile/analysis-reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch analysis reports");
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    throw new Error("Failed to fetch reports");
  }
};

// Delete a report by date
export async function deleteReportByDate(date) {
  try {
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${BACKEND_URL}/api/profile/analysis-report/${encodeURIComponent(date)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete report");
    return await res.json();
  } catch (error) {
    throw error;
  }
}
