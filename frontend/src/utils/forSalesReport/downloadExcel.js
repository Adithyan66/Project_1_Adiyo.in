import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getSalesReport } from '../../services/adminDashboardServices';
import { formatDate } from '../formatDate';


const downloadExcel = async (params) => {
    try {
        const fullParams = { ...params, page: 1, pageSize: 10000 };
        const response = await getSalesReport(fullParams);
        const salesData = response.data.data.map(sale => ({
            'Order ID': sale.orderId,
            'Date': formatDate(sale.createdAt),
            'Total Amount': `₹${sale.totalAmount}`,
            'Discounts': `₹${sale.discount}`,
            'Coupon Deduction': `₹${sale.couponCode || 0}`,
            'Status': sale.orderStatus
        }));
        const summary = response.data.summary;
        const summaryData = [
            { 'Metric': 'Total Sales', 'Value': `₹${summary.totalSales.toLocaleString('en-IN')}` },
            { 'Metric': 'Total Orders', 'Value': summary.totalOrders },
            { 'Metric': 'Overall Discounts', 'Value': `₹${summary.overallDiscount.toLocaleString('en-IN')}` }
        ];
        const workbook = XLSX.utils.book_new();
        const salesWorksheet = XLSX.utils.json_to_sheet(salesData);
        const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
        XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Sales Details');
        const filename = `sales_report_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, filename);
    } catch (error) {
        console.error('Error downloading Excel:', error);
        toast.error('Failed to download report');
    }
};


export default downloadExcel