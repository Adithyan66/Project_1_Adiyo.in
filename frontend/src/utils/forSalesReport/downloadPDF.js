import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getSalesReport } from '../../services/adminDashboardServices';
import { formatDate } from '../formatDate';

const downloadPDF = async (params) => {
    try {
        const fullParams = { ...params, page: 1, pageSize: 10000 };
        const response = await getSalesReport(fullParams);
        const doc = new jsPDF('landscape');
        doc.setFontSize(18);
        doc.text('Sales Report', 14, 22);
        const summary = response.data.summary;
        doc.setFontSize(10);
        doc.text(`Total Sales: ₹${summary.totalSales.toLocaleString('en-IN')}`, 14, 30);
        doc.text(`Total Orders: ${summary.totalOrders}`, 14, 36);
        doc.text(`Overall Discounts: ₹${summary.overallDiscount.toLocaleString('en-IN')}`, 14, 42);
        const tableColumn = ['Order ID', 'Date', 'Total Amount', 'Discounts', 'Coupon Deduction', 'Status'];
        const tableRows = response.data.data.map(sale => [
            sale.orderId,
            formatDate(sale.createdAt),
            `₹${sale.totalAmount}`,
            `₹${sale.discount}`,
            `₹${sale.couponCode || 0}`,
            sale.orderStatus
        ]);
        autoTable(doc, {
            startY: 50,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 22, 22], textColor: 255 }
        });
        doc.text('Adiyo.in', 14, 202);
        const filename = `sales_report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        toast.error('Failed to download report');
    }
};

export default downloadPDF