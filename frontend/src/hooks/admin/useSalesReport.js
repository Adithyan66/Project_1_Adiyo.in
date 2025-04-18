import { useEffect, useState } from "react";
import { getSalesReport } from "../../services/adminDashboardServices";

const useSalesReport = ({
    searchTerm,
    dateRange,
    customStartDate,
    customEndDate,
    currentPage,
    pageSize,
    sortBy,
    sortOrder
}) => {
    const [reportData, setReportData] = useState({
        summary: { totalSales: 0, overallDiscount: 0, totalOrders: 0 },
        data: [],
        pagination: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    searchTerm,
                    dateRange,
                    customStartDate,
                    customEndDate,
                    page: currentPage,
                    pageSize,
                    sortBy,
                    sortOrder
                };
                const response = await getSalesReport(params);
                setReportData(response.data);
            } catch (err) {
                console.error('Error fetching sales report:', err);
                setError('Failed to load sales report.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchTerm, dateRange, customStartDate, customEndDate, currentPage, pageSize, sortBy, sortOrder]);

    return { reportData, loading, error };
};

export default useSalesReport