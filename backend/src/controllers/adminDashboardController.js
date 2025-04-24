
import HttpStatusCode from "../utils/httpStatusCodes.js";
const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode

import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js"







export const salesReport = async (req, res) => {

    try {

        const {
            searchTerm,
            dateRange,
            customStartDate,
            customEndDate,
            page = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;


        let filters = {};

        if (searchTerm) {
            filters.$or = [
                { orderStatus: { $regex: searchTerm, $options: 'i' } },
                { totalAmount: Number(searchTerm) || 0 },
                { orderId: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const now = new Date();
        if (dateRange === 'today') {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            filters.createdAt = { $gte: start, $lt: end };
        } else if (dateRange === 'last7days') {
            const start = new Date();
            start.setDate(now.getDate() - 6);
            filters.createdAt = { $gte: start, $lte: now };
        } else if (dateRange === 'thisMonth') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            filters.createdAt = { $gte: start, $lt: end };
        } else if (dateRange === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            filters.createdAt = { $gte: start, $lte: end };
        }


        let sortOptions = {};
        if (sortBy === 'totalAmount' || sortBy === 'discount') {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'createdAt') {
            sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const totalCount = await Order.countDocuments(filters);

        const pipeline = [
            { $match: filters },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: '$totalAmount' },
                                overallDiscount: { $sum: '$discount' },
                                totalOrders: { $sum: 1 }
                            }
                        }
                    ],
                    data: [
                        { $sort: sortOptions },
                        { $skip: (Number(page) - 1) * Number(pageSize) },
                        { $limit: Number(pageSize) }
                    ]
                }
            }
        ];

        const result = await Order.aggregate(pipeline);
        const summary = result[0].summary[0] || {
            totalSales: 0,
            overallDiscount: 0,
            totalOrders: 0
        };
        const data = result[0].data;

        res.status(OK).json({
            summary,
            data,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / Number(pageSize)),
                currentPage: Number(page),
                pageSize: Number(pageSize)
            }
        });
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Failed to generate sales report.' });
    }
}



const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);


export const getDashboardData = async (req, res) => {

    try {

        const { timeFilter = 'yearly', year, month, startDate, endDate } = req.query;

        let ordersPipeline = [];

        let customerPipeline = [];

        let sellersPipeline = [];


        if (timeFilter === 'yearly') {
            if (!year) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Year is required for yearly filter.' });
            }
            ordersPipeline = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-01-01`),
                            $lt: new Date(`${parseInt(year) + 1}-01-01`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' }
                    }
                },
                { $sort: { _id: 1 } }
            ]

            customerPipeline = [
                {
                    $match: {
                        registrationDate: {
                            $gte: new Date(`${year}-01-01`),
                            $lt: new Date(`${parseInt(year) + 1}-01-01`)
                        },
                        role: "customer"
                    }
                },
                {
                    $group: {
                        _id: { $month: "$registrationDate" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]

            // sellersPipeline = [
            //     {
            //         $match: {
            //             registrationDate: {
            //                 $gte: new Date(`${year}-01-01`),
            //                 $lt: new Date(`${parseInt(year) + 1}-01-01`)
            //             },
            //             role: "seller"
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: { $month: "$registrationDate" },
            //             count: { $sum: 1 }
            //         }
            //     }
            // ]

        } else if (timeFilter === 'monthly') {
            if (!year || !month) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Year and month are required for monthly filter.' });
            }
            ordersPipeline = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-${month}-01`),
                            $lt: new Date(`${year}-${parseInt(month) + 1}-01`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: '$createdAt' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ];

            customerPipeline = [
                {
                    $match: {
                        registrationDate: {
                            $gte: new Date(`${year}-${month}-01`),
                            $lt: new Date(`${year}-${parseInt(month) + 1}-01`)
                        },
                        role: "customer"
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$registrationDate" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]
        } else if (timeFilter === 'weekly') {
            const fiveWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 5);

            ordersPipeline = [
                {
                    $match: {
                        createdAt: { $gte: fiveWeeksAgo }
                    }
                },
                {
                    $addFields: {
                        isoWeek: { $isoWeek: '$createdAt' }
                    }
                },
                {
                    $group: {
                        _id: { week: '$isoWeek' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' }
                    }
                },
                { $sort: { '_id.week': 1 } }
            ];

            customerPipeline = [
                {
                    $match: {
                        registrationDate: { $gte: fiveWeeksAgo }
                    }
                },
                {
                    $addFields: {
                        isoWeek: { $isoWeek: "$registrationDate" },
                    }
                },
                {
                    $group: {
                        _id: { week: "$isoWeek" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.week": 1 }
                }
            ]
        } else if (timeFilter === 'custom') {

            if (!startDate || !endDate) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'StartDate and endDate are required for custom filter.' });
            }

            ordersPipeline = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: '$createdAt' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' }
                    }
                },
                { $sort: { _id: 1 } }
            ];

            customerPipeline = [
                {
                    $match: {
                        registrationDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$registrationDate" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]
        }



        const ordersData = await Order.aggregate(ordersPipeline);
        const customerData = await User.aggregate(customerPipeline)

        const summaryAgg = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const summaryData = summaryAgg[0] || { totalOrders: 0, totalRevenue: 0 };


        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

        const totalUsers = await User.countDocuments({ role: "customer" });
        const totalSellers = await User.countDocuments({ role: "seller" });

        let ordersChart = [];
        let revenueChart = [];
        let usersChart = [];

        if (timeFilter === 'yearly') {

            ordersChart = months.map((monthName, index) => {
                const record = ordersData.find(item => item._id === index + 1);

                return { name: monthName, value: record ? record.count : 0 };
            });

            revenueChart = months.map((monthName, index) => {
                const record = ordersData.find(item => item._id === index + 1);
                return { name: monthName, value: record ? record.revenue : 0 };
            });

            usersChart = months.map((monthName, index) => {
                const record = customerData.find((item => item._id == index + 1));
                return { name: monthName, value: record ? record.count : 0 }
            })


        } else if (timeFilter === 'monthly' || timeFilter === 'custom') {

            ordersChart = ordersData.map(item => ({ name: `Day ${item._id}`, value: item.count }));
            revenueChart = ordersData.map(item => ({ name: `Day ${item._id}`, value: item.revenue }));
            usersChart = customerData.map(item => ({ name: `Day ${item._id}`, value: item.count }))

        } else if (timeFilter === 'weekly') {

            ordersChart = ordersData.map(item => ({ name: `Week ${item._id.week}`, value: item.count }));
            revenueChart = ordersData.map(item => ({ name: `Week ${item._id.week}`, value: item.revenue }));
            usersChart = customerData.map(item => ({ name: `Week ${item._id.week}`, value: item.count }))
        }



        const topCategorysData = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $unwind: "$productData"
            },
            {
                $group: {
                    _id: "$productData.category",
                    totalSales: { $sum: "$orderItems.quantity" },
                    revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $limit: 5
            }
        ])


        const topCategorys = await Promise.all(
            topCategorysData.map(async (item) => {
                const category = await Category.findById(item._id).lean();
                return {
                    name: category ? category.name : "unknown Category",
                    sales: item.totalSales,
                    revenue: item.revenue
                }
            })
        )



        const topProductsAgg = await Order.aggregate([
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    sales: { $sum: '$orderItems.quantity' },
                    revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);


        const topProducts = await Promise.all(
            topProductsAgg.map(async (item) => {
                const product = await Product.findById(item._id).lean();
                return {
                    name: product ? product.name : 'Unknown Product',
                    sales: item.sales,
                    revenue: item.revenue
                };
            })
        );


        const orderStatusesData = await Order.aggregate([
            {
                $group: {
                    _id: {
                        name: '$orderStatus'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        const orderStatuses = orderStatusesData.map(order => ({ name: order._id.name, value: order.count }))


        const geoDistribution = await Order.aggregate([
            {
                $group: {
                    _id: '$shippingAddress.city',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const geoDistFormatted = geoDistribution.map(item => ({
            name: item._id || 'Unknown',
            value: item.count
        }));


        const data = {
            summary: {
                totalOrders: summaryData.totalOrders,
                totalRevenue: summaryData.totalRevenue,
                totalUsers,
                totalSellers,
                pendingOrders
            },
            charts: {
                orders: ordersChart,
                revenue: revenueChart,
                users: usersChart

            },
            topProducts,
            topCategorys,
            orderStatuses,
            geoDistribution: geoDistFormatted
        };

        return res.status(OK).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error. We couldn't drop the data right now."
        });
    }
};
