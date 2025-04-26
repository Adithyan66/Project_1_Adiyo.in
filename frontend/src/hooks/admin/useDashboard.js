// import { useState, useEffect } from 'react';
// import { getDashboartData } from '../../services/adminDashboardServices';

// // Custom hook for dashboard logic
// const useDashboard = () => {
//     const [dashboardData, setDashboardData] = useState({
//         summary: { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalSellers: 0, pendingOrders: 0 },
//         charts: { orders: [], revenue: [], users: [], sellers: [] },
//         topProducts: [],
//         topCategorys: [],
//         orderStatuses: [],
//         geoDistribution: []
//     });
//     const [timeFilter, setTimeFilter] = useState('monthly');
//     const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
//     const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
//     const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeSection, setActiveSection] = useState('overview');

//     const currentYear = new Date().getFullYear();
//     const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//     // Function to fetch dashboard data based on current filters
//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             const params = new URLSearchParams({
//                 timeFilter,
//                 year: yearFilter,
//                 ...(timeFilter === 'monthly' && { month: monthFilter }),
//                 ...(timeFilter === 'custom' && { startDate: customDateRange.start, endDate: customDateRange.end })
//             });
//             const response = await getDashboartData(params);
//             setDashboardData(response.data.data);
//             setError(null);
//         } catch (err) {
//             console.error("Error fetching dashboard data:", err);
//             setError("Failed to fetch dashboard data. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {

//         if (timeFilter !== 'custom' || (customDateRange.start && customDateRange.end)) {
//             fetchDashboardData();
//         }
//     }, [timeFilter, yearFilter, monthFilter, customDateRange.start, customDateRange.end]);

//     // Format currency for display
//     const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: 'INR',
//         maximumFractionDigits: 0
//     }).format(amount);

//     const handleDateRangeChange = (e) => {
//         const { name, value } = e.target;
//         setCustomDateRange(prev => ({ ...prev, [name]: value }));
//     };

//     return {
//         dashboardData,
//         timeFilter,
//         setTimeFilter,
//         yearFilter,
//         setYearFilter,
//         monthFilter,
//         setMonthFilter,
//         customDateRange,
//         handleDateRangeChange,
//         fetchDashboardData,
//         loading,
//         error,
//         activeSection,
//         setActiveSection,
//         formatCurrency,
//         years,
//         months
//     };
// };

// export default useDashboard;








import { useState, useEffect } from 'react';
import { getDashboartData } from '../../services/adminDashboardServices';

// Custom hook for dashboard logic
const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        summary: { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalSellers: 0, pendingOrders: 0 },
        charts: { orders: [], revenue: [], users: [], sellers: [] },
        topProducts: [],
        topCategorys: [],
        orderStatuses: [],
        geoDistribution: [],
    });
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Function to fetch dashboard data based on current filters
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                timeFilter,
                year: yearFilter,
                ...(timeFilter === 'monthly' && { month: monthFilter }),
                ...(timeFilter === 'custom' && { startDate: customDateRange.start, endDate: customDateRange.end }),
            });
            const response = await getDashboartData(params);
            setDashboardData(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to fetch dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeFilter !== 'custom' || (customDateRange.start && customDateRange.end)) {
            fetchDashboardData();
        }
    }, [timeFilter, yearFilter, monthFilter, customDateRange.start, customDateRange.end]);

    // Format currency for display
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);

    return {
        dashboardData,
        timeFilter,
        setTimeFilter,
        yearFilter,
        setYearFilter,
        monthFilter,
        setMonthFilter,
        customDateRange,
        setCustomDateRange,
        fetchDashboardData,
        loading,
        error,
        activeSection,
        setActiveSection,
        formatCurrency,
        years,
        months,
    };
};

export default useDashboard;