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

import mongoose from "mongoose";
import { generateTransactionId } from "../services/generateTransactionId.js";
import crypto from 'crypto';
import { generateReadableOrderId } from "../services/generateUnique.js";
import { verifyPayPalOrder, capturePayPalPayment } from "../services/paypal.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Address from "../models/addressModel.js";
import Order from "../models/orderModel.js";
import Coupon from "../models/couponModel.js";
import { Wallet, Transaction } from "../models/walletModel.js";
import { getSizeKey } from "../services/getSizeKey.js";
import { attachSignedUrlsToOrderItems, attachSignedUrlsToOrders, getSignedImageUrl } from "../utils/imageService.js";


// export const createOrder = async (req, res) => {

//     try {
//         const {
//             addressId,
//             productDetails,
//             paymentMethod,
//             couponCode,
//             paypalOrderID,
//         } = req.body;

//         if (!addressId || !productDetails || !paymentMethod) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "Missing required fields"
//             });
//         }

//         const user = await User.findById(req.user.userId);

//         if (!user) return res.status(UNAUTHORIZED).json({
//             success: false,
//             message: "Not authorized"
//         });

//         const selectedAddress = await Address.findOne({
//             _id: addressId,
//             userId: req.user.userId
//         });

//         if (!selectedAddress) return res.status(BAD_REQUEST).json({
//             success: false,
//             message: "Address not found"
//         });

//         const items = Array.isArray(productDetails) ? productDetails : [productDetails];

//         if (items.length === 0) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "No products provided for order"
//             });
//         }

//         const allProducts = [];
//         let totalSubtotal = 0;
//         const productCategories = new Set();

//         for (const item of items) {

//             const { productId, productColor, productSize, quantity } = item;

//             const product = await Product.findOne({ _id: productId, deletedAt: null }).populate('category');

//             if (!product) return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: `Product not found`
//             });

//             const colorVariant = product.colors.find(c => c.color === productColor);

//             const productImg = await getSignedImageUrl(colorVariant.images[0])

//             if (!colorVariant) return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: `Color ${productColor} not available for product ${product.name}`
//             });

//             const sizeKey = getSizeKey(productSize);
//             const sizeVariant = colorVariant.variants[sizeKey];

//             if (!sizeVariant) return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: `Size ${productSize} not available for product ${product.name}`
//             });

//             if (sizeVariant.stock < quantity) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: `Insufficient stock for ${product.name} in ${productColor} color, size ${productSize}`
//                 });
//             }

//             if (product.category && product.category.name) {
//                 productCategories.add(product.category._id);
//             }

//             const itemPrice = colorVariant.basePrice;
//             const itemDiscountedPrice = colorVariant.discountPrice;
//             const itemTotal = itemDiscountedPrice * quantity;

//             totalSubtotal += itemTotal;

//             allProducts.push({
//                 product,
//                 productId,
//                 productColor,
//                 productSize,
//                 quantity,
//                 itemPrice,
//                 itemDiscountedPrice,
//                 sizeKey,
//                 productImg
//             });
//         }

//         let appliedCoupon = null;
//         let totalDiscount = 0;

//         if (couponCode) {
//             appliedCoupon = await Coupon.findOne({
//                 code: couponCode,
//                 deletedAt: null,
//                 activeFrom: { $lte: new Date() },
//                 expiresAt: { $gt: new Date() },
//                 $expr: { $lt: ["$usedCount", "$maxUsage"] }
//             }).populate('applicableCategories');

//             if (!appliedCoupon) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "Invalid or expired coupon code"
//                 });
//             }

//             if (appliedCoupon.minimumOrderValue && totalSubtotal < appliedCoupon.minimumOrderValue) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: `Minimum order value of ${appliedCoupon.minimumOrderValue} required for this coupon`
//                 });
//             }

//             let isCouponApplicable = false;

//             if (
//                 !appliedCoupon.applicableCategories ||
//                 Object.keys(appliedCoupon.applicableCategories).length === 0
//             ) {
//                 isCouponApplicable = true;

//             } else {

//                 for (const category of productCategories) {

//                     if (appliedCoupon.applicableCategories._id.equals(category)) {
//                         isCouponApplicable = true;
//                         break;
//                     }
//                 }
//             }


//             if (!isCouponApplicable) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "Coupon not applicable to any products in your cart"
//                 });
//             }

//             if (appliedCoupon.discountType === "percentage") {
//                 totalDiscount = Math.round((totalSubtotal * appliedCoupon.discountValue) / 100);
//             } else {
//                 totalDiscount = appliedCoupon.discountValue;
//             }

//             totalDiscount = Math.min(totalDiscount, totalSubtotal);
//         }

//         const shippingFee = totalSubtotal >= 499 ? 0 : 49;

//         const taxRate = 0;
//         const totalTax = Math.round(totalSubtotal * taxRate);

//         const finalTotalAmount = totalSubtotal + shippingFee + totalTax - totalDiscount;

//         let paymentVerified = false;
//         let paymentDetails = null;
//         let walletTransaction = null;

//         if (paymentMethod === 'wallet') {

//             const wallet = await Wallet.findOne({ userId: req.user.userId });

//             if (!wallet) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "Wallet not found for this user"
//                 });
//             }

//             if (wallet.balance < finalTotalAmount) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "Insufficient wallet balance",
//                     walletBalance: wallet.balance,
//                     orderAmount: finalTotalAmount
//                 });
//             }

//             walletTransaction = new Transaction({
//                 transactionId: generateTransactionId(),
//                 walletId: wallet._id,
//                 userId: req.user.userId,
//                 type: 'order_payment',
//                 amount: finalTotalAmount,
//                 balance: wallet.balance - finalTotalAmount,
//                 description: `Payment for order #ORD-${Date.now()}`,
//                 status: 'completed',
//                 source: 'order_payment',
//                 reference: {}
//             });

//             wallet.balance -= finalTotalAmount;
//             await wallet.save();

//             paymentVerified = true;
//             paymentDetails = {
//                 paymentProvider: 'wallet',
//                 transactionId: walletTransaction._id.toString(),
//                 amount: finalTotalAmount,
//                 status: 'completed',
//                 createTime: new Date(),
//                 updateTime: new Date()
//             };
//         } else if (paymentMethod === 'paypal') {
//             if (!paypalOrderID) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "PayPal Order ID is required for PayPal payments"
//                 });
//             }

//             try {
//                 const paypalOrderDetails = await verifyPayPalOrder(paypalOrderID);

//                 const paypalAmount = parseFloat(paypalOrderDetails.purchase_units[0].amount.value);

//                 if (Math.abs(paypalAmount - finalTotalAmount) > 0.01) {
//                     return res.status(BAD_REQUEST).json({
//                         success: false,
//                         message: `Payment amount mismatch. Expected: ${finalTotalAmount}, Received: ${paypalAmount}`
//                     });
//                 }

//                 paymentDetails = await capturePayPalPayment(paypalOrderID);
//                 paymentVerified = true;

//             } catch (error) {

//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: error.message || "Failed to verify PayPal payment"
//                 });
//             }
//         }

//         const savedOrders = [];
//         const allOrderItems = [];
//         const commonOrderNumber = generateReadableOrderId();


//         for (const productData of allProducts) {

//             const {
//                 product, productId, productColor, productSize,
//                 quantity, itemPrice, itemDiscountedPrice, sizeKey, productImg
//             } = productData;

//             const orderItems = [];
//             const subtotal = itemDiscountedPrice * quantity;

//             const orderItem = {
//                 product: productId,
//                 color: productColor,
//                 size: productSize,
//                 quantity,
//                 price: itemPrice,
//                 discountedPrice: itemDiscountedPrice,
//                 productImg: productImg
//             };

//             orderItems.push(orderItem);

//             const productImage = product.images && product.images.length > 0 ? product.images[0] : '';

//             allOrderItems.push({
//                 ...orderItem,
//                 productName: product.name,
//                 productImage: productImage
//             });

//             const itemProportion = subtotal / totalSubtotal;
//             const itemDiscount = Math.round(totalDiscount * itemProportion);

//             const itemShippingFee = (shippingFee === 0) ? 0 : Math.round(shippingFee * itemProportion);
//             const itemTax = Math.round(totalTax * itemProportion);
//             const itemTotalAmount = subtotal - itemDiscount + itemShippingFee + itemTax;

//             const newOrder = new Order({
//                 orderNumber: commonOrderNumber,
//                 orderId: commonOrderNumber,
//                 user: req.user.userId,
//                 orderItems,
//                 shippingAddress: selectedAddress,
//                 paymentMethod,
//                 paymentStatus: paymentMethod === "cod" ? "pending" : (paymentVerified ? "paid" : "pending"),
//                 subtotal,
//                 shippingFee: itemShippingFee,
//                 tax: itemTax,
//                 discount: itemDiscount,
//                 couponCode: itemDiscount > 0 ? couponCode : null,
//                 totalAmount: itemTotalAmount,
//                 estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
//             });

//             if (paymentMethod === "paypal" && paymentVerified && paymentDetails) {
//                 newOrder.paymentDetails = {
//                     paymentProvider: "paypal",
//                     paymentDate: new Date(),
//                     transactionId: paymentDetails.transactionId,
//                     payerEmail: paymentDetails.payerEmail,
//                     amount: paymentDetails.amount.value,
//                     status: paymentDetails.status,
//                     createTime: paymentDetails.createTime,
//                     updateTime: paymentDetails.updateTime
//                 };
//             }
//             else if (paymentMethod === 'razorpay') {
//                 const { razorpayOrderDetails } = req.body;

//                 if (!razorpayOrderDetails ||
//                     !razorpayOrderDetails.razorpay_order_id ||
//                     !razorpayOrderDetails.razorpay_payment_id ||
//                     !razorpayOrderDetails.razorpay_signature) {
//                     return res.status(BAD_REQUEST).json({
//                         success: false,
//                         message: "Razorpay Order details are required for Razorpay payments"
//                     });
//                 }

//                 try {
//                     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpayOrderDetails;

//                     const generated_signature = crypto
//                         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//                         .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//                         .digest('hex');

//                     if (generated_signature !== razorpay_signature) {
//                         return res.status(BAD_REQUEST).json({
//                             success: false,
//                             message: "Invalid Razorpay signature"
//                         });
//                     }

//                     paymentVerified = true;
//                     newOrder.paymentDetails = {
//                         paymentProvider: "razorpay",
//                         paymentDate: new Date(),
//                         transactionId: razorpay_order_id,
//                     };
//                 } catch (error) {

//                     return res.status(BAD_REQUEST).json({
//                         success: false,
//                         message: error.message || "Failed to verify Razorpay payment"
//                     });
//                 }
//             }
//             else if (paymentMethod === "wallet" && paymentVerified && paymentDetails) {
//                 newOrder.paymentDetails = {
//                     paymentProvider: "wallet",
//                     paymentDate: new Date(),
//                     transactionId: paymentDetails.transactionId,
//                     amount: paymentDetails.amount,
//                     status: paymentDetails.status,
//                     createTime: paymentDetails.createTime,
//                     updateTime: paymentDetails.updateTime
//                 };
//             } else if (paymentMethod !== "cod") {
//                 newOrder.paymentDetails = {
//                     paymentProvider: paymentMethod,
//                     paymentDate: new Date()
//                 };
//             }

//             const savedOrder = await newOrder.save();
//             savedOrders.push(savedOrder);

//             await Product.findOneAndUpdate(
//                 {
//                     _id: productId,
//                     "colors.color": productColor
//                 },
//                 {
//                     $inc: {
//                         [`colors.$.variants.${sizeKey}.stock`]: -quantity,
//                         "colors.$.totalStock": -quantity,
//                         totalQuantity: -quantity
//                     }
//                 }
//             );
//         }

//         if (walletTransaction) {
//             walletTransaction.reference.orderId = savedOrders[0]._id;
//             await walletTransaction.save();
//         }

//         if (appliedCoupon) {
//             await Coupon.findByIdAndUpdate(appliedCoupon._id, {
//                 $inc: { usedCount: 1 }
//             });
//         }

//         const consolidatedOrderDetails = {
//             orderNumber: commonOrderNumber,
//             orderId: commonOrderNumber,
//             totalAmount: finalTotalAmount,
//             shippingAddress: selectedAddress,
//             paymentMethod,
//             orderItems: allOrderItems,
//             createdAt: new Date(),
//             estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//             subtotal: totalSubtotal,
//             shippingFee,
//             tax: totalTax,
//             discount: totalDiscount,
//             couponCode: totalDiscount > 0 ? couponCode : null,
//             paymentStatus: paymentMethod === "cod" ? "pending" : (paymentVerified ? "paid" : "pending"),
//             orders: savedOrders.map(order => order._id)
//         };

//         res.status(CREATED).json({
//             success: true,
//             message: "Order created successfully",
//             order: consolidatedOrderDetails
//         });

//     } catch (error) {
//         console.log("Error in createOrder:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: error.message || "Internal server error"
//         });
//     }
// };









export const createOrder = async (req, res) => {
    try {
        const {
            addressId,
            productDetails,
            paymentMethod,
            couponCode,
            paypalOrderID,
            razorpayOrderDetails
        } = req.body;

        // 1️⃣ Basic validations
        if (!addressId || !productDetails || !paymentMethod) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Missing required fields"
            });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "Not authorized"
            });
        }
        const selectedAddress = await Address.findOne({
            _id: addressId,
            userId: req.user.userId
        });
        if (!selectedAddress) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Address not found"
            });
        }

        // 2️⃣ Prepare items, totals & categories
        const items = Array.isArray(productDetails) ? productDetails : [productDetails];
        if (items.length === 0) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "No products provided for order"
            });
        }
        const allProducts = [];
        let totalSubtotal = 0;
        const productCategories = new Set();

        for (const item of items) {
            const { productId, productColor, productSize, quantity } = item;
            const product = await Product.findOne({ _id: productId, deletedAt: null }).populate('category');
            if (!product) {
                return res.status(NOT_FOUND).json({
                    success: false,
                    message: `Product not found`
                });
            }
            const colorVariant = product.colors.find(c => c.color === productColor);
            if (!colorVariant) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: `Color ${productColor} not available for product ${product.name}`
                });
            }
            const sizeKey = getSizeKey(productSize);
            const sizeVariant = colorVariant.variants[sizeKey];
            if (!sizeVariant) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: `Size ${productSize} not available for product ${product.name}`
                });
            }
            // if (sizeVariant.stock < quantity) {
            //     return res.status(BAD_REQUEST).json({
            //         success: false,
            //         message: `Insufficient stock for ${product.name} in ${productColor} color, size ${productSize}`
            //     });
            // }
            productCategories.add(product.category?._id);
            const productImg = await getSignedImageUrl(colorVariant.images[0]);
            const itemPrice = colorVariant.basePrice;
            const itemDiscountedPrice = colorVariant.discountPrice;
            totalSubtotal += itemDiscountedPrice * quantity;

            allProducts.push({
                product, productId, productColor, productSize,
                quantity, itemPrice, itemDiscountedPrice,
                sizeKey, productImg
            });
        }

        // 3️⃣ Coupon logic
        let appliedCoupon = null;
        let totalDiscount = 0;
        if (couponCode) {
            appliedCoupon = await Coupon.findOne({
                code: couponCode,
                deletedAt: null,
                activeFrom: { $lte: new Date() },
                expiresAt: { $gt: new Date() },
                $expr: { $lt: ["$usedCount", "$maxUsage"] }
            }).populate('applicableCategories');
            if (!appliedCoupon) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid or expired coupon code"
                });
            }
            if (appliedCoupon.minimumOrderValue && totalSubtotal < appliedCoupon.minimumOrderValue) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: `Minimum order value of ${appliedCoupon.minimumOrderValue} required`
                });
            }
            // check category applicability...
            const isApplicable =
                !appliedCoupon.applicableCategories.length ||
                Array.from(productCategories).some(catId =>
                    appliedCoupon.applicableCategories.some(c => c._id.equals(catId))
                );
            if (!isApplicable) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Coupon not applicable to any products in your cart"
                });
            }
            totalDiscount = appliedCoupon.discountType === "percentage"
                ? Math.round((totalSubtotal * appliedCoupon.discountValue) / 100)
                : appliedCoupon.discountValue;
            totalDiscount = Math.min(totalDiscount, totalSubtotal);
        }

        // 4️⃣ Shipping & tax
        const shippingFee = totalSubtotal >= 499 ? 0 : 49;
        const totalTax = 0;
        const finalTotalAmount = totalSubtotal + shippingFee + totalTax - totalDiscount;

        // 5️⃣ Payment handling (wallet / PayPal / Razorpay)
        let paymentVerified = false;
        let paymentDetails = null;
        let walletTransaction = null;

        if (paymentMethod === 'wallet') {
            // debit wallet
            const wallet = await Wallet.findOne({ userId: req.user.userId });
            if (!wallet || wallet.balance < finalTotalAmount) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Insufficient wallet balance",
                    walletBalance: wallet?.balance ?? 0,
                    orderAmount: finalTotalAmount
                });
            }
            walletTransaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId: req.user.userId,
                type: 'order_payment',
                amount: finalTotalAmount,
                balance: wallet.balance - finalTotalAmount,
                description: `Payment for order #ORD-${Date.now()}`,
                status: 'completed',
                source: 'order_payment'
            });
            wallet.balance -= finalTotalAmount;
            await wallet.save();
            paymentVerified = true;
            paymentDetails = {
                paymentProvider: 'wallet',
                transactionId: walletTransaction._id.toString(),
                amount: finalTotalAmount,
                status: 'completed',
                createTime: new Date(),
                updateTime: new Date()
            };
        } else if (paymentMethod === 'paypal') {
            if (!paypalOrderID) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "PayPal Order ID is required"
                });
            }
            try {
                const details = await verifyPayPalOrder(paypalOrderID);
                const paidAmt = parseFloat(details.purchase_units[0].amount.value);
                if (Math.abs(paidAmt - finalTotalAmount) > 0.01) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: `Payment amount mismatch. Expected: ${finalTotalAmount}, Received: ${paidAmt}`
                    });
                }
                const paypalDetails = await capturePayPalPayment(paypalOrderID);
                paymentVerified = true;

                paymentDetails = {
                    paymentProvider: "paypal",
                    paymentDate: new Date(),
                    transactionId: paypalDetails.transactionId,
                    payerEmail: paypalDetails.payerEmail,
                    createTime: paypalDetails.createTime,
                    updateTime: paypalDetails.updateTime
                }
            } catch (err) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: err.message || "Failed to verify PayPal payment"
                });
            }
        } else if (paymentMethod === 'razorpay') {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpayOrderDetails || {};
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Razorpay details are required"
                });
            }
            const generatedSig = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');
            if (generatedSig !== razorpay_signature) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid Razorpay signature"
                });
            }
            paymentVerified = true;
            paymentDetails = {
                paymentProvider: "razorpay",
                paymentDate: new Date(),
                transactionId: razorpay_payment_id
            };
        }

        // 6️⃣ Order creation + stock decrement, wrapped to catch stock errors
        const savedOrders = [];
        const allOrderItems = [];
        const commonOrderNumber = generateReadableOrderId();

        try {
            for (const pd of allProducts) {
                const {
                    product, productId, productColor, productSize,
                    quantity, itemPrice, itemDiscountedPrice, sizeKey, productImg
                } = pd;

                // Build orderItem & allOrderItems array for summary
                const orderItem = {
                    product: productId,
                    color: productColor,
                    size: productSize,
                    quantity,
                    price: itemPrice,
                    discountedPrice: itemDiscountedPrice,
                    productImg
                };
                allOrderItems.push({
                    ...orderItem,
                    productName: product.name,
                    productImage: product.images?.[0] || ''
                });

                // Proportional shipping / tax / discount for this item
                const subtotal = itemDiscountedPrice * quantity;
                const itemProp = subtotal / totalSubtotal;
                const itemDiscount = Math.round(totalDiscount * itemProp);
                const itemShipping = shippingFee ? Math.round(shippingFee * itemProp) : 0;
                // const itemTax = Math.round(totalTax * itemProp);
                const itemTotalAmt = subtotal - itemDiscount + itemShipping;

                const newOrder = new Order({
                    orderNumber: commonOrderNumber,
                    orderId: commonOrderNumber,
                    user: req.user.userId,
                    orderItems: [orderItem],
                    shippingAddress: selectedAddress,
                    paymentMethod,
                    paymentStatus: paymentVerified ? "paid" : "pending",
                    subtotal,
                    shippingFee: itemShipping,
                    // tax: itemTax,
                    discount: itemDiscount,
                    couponCode: itemDiscount ? couponCode : null,
                    totalAmount: itemTotalAmt,
                    orderStatus: "processing",
                    estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                });

                // attach provider‑specific paymentDetails
                if (paymentDetails) newOrder.paymentDetails = paymentDetails;

                const saved = await newOrder.save();
                savedOrders.push(saved);

                // Strict stock update check
                const justProduct = await Product.findOne({
                    _id: productId,
                    "colors.color": productColor,
                    [`colors.variants.${sizeKey}.stock`]: { $gte: quantity }
                },)
                console.log("need a product here", justProduct, "arguments are ", sizeKey, quantity);

                const updated = await Product.findOneAndUpdate(
                    {
                        _id: productId,
                        "colors.color": productColor,
                        [`colors.variants.${sizeKey}.stock`]: { $gte: quantity }
                    },
                    {
                        $inc: {
                            [`colors.$.variants.${sizeKey}.stock`]: -quantity,
                            "colors.$.totalStock": -quantity,
                            totalQuantity: -quantity
                        }
                    }
                );
                if (!updated) {
                    console.log("error thrown from here");

                    throw new Error(`Out of stock: ${product.name} (${productColor}/${productSize})`);
                }
            }
        } catch (stockError) {

            console.log("here not need to work", stockError);

            // 🔄 REFUND & FAILED ORDER HANDLING
            const refundAmt = finalTotalAmount;

            // 1) Refund to wallet
            let wallet = await Wallet.findOne({ userId: req.user.userId });
            if (!wallet) {
                wallet = await Wallet.create({ userId: req.user.userId, balance: 0 });
            }
            wallet.balance += refundAmt;
            await wallet.save();
            await Transaction.create({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId: req.user.userId,
                type: 'refund',
                amount: refundAmt,
                balance: wallet.balance,
                description: `Refund for failed order ${commonOrderNumber}: ${stockError.message}`,
                status: 'completed',
                source: 'order_refund',
                reference: { orderNumber: commonOrderNumber }
            });

            // 2) Roll back any coupon usage
            if (appliedCoupon) {
                await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: -1 } });
            }



            // 3) Remove partial orders & write one failed order
            await Order.deleteMany({ orderNumber: commonOrderNumber });

            const failed = await Order.create({
                orderId: commonOrderNumber,
                orderNumber: commonOrderNumber,
                user: req.user.userId,
                orderItems: allOrderItems,
                shippingAddress: selectedAddress,
                paymentMethod,
                paymentStatus: paymentVerified ? "refunded" : 'failed',
                subtotal: totalSubtotal,
                shippingFee,
                tax: totalTax,
                discount: totalDiscount,
                totalAmount: finalTotalAmount,
                couponCode: totalDiscount ? couponCode : null,
                orderStatus: 'failed',
                failureReason: stockError.message,
                createdAt: new Date()
            });

            return res.status(OK).json({
                success: false,
                message: `Order failed: ${stockError.message}. ₹${refundAmt} refunded to wallet.`,
                order: failed,
                walletBalance: wallet.balance
            });
        }

        // 7️⃣ All good: finalize and respond
        if (walletTransaction) {
            walletTransaction.reference.orderId = savedOrders[0]._id;
            await walletTransaction.save();
        }
        if (appliedCoupon) {
            await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });
        }

        const consolidated = {
            orderNumber: commonOrderNumber,
            orderId: commonOrderNumber,
            totalAmount: finalTotalAmount,
            shippingAddress: selectedAddress,
            paymentMethod,
            orderItems: allOrderItems,
            createdAt: new Date(),
            estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            subtotal: totalSubtotal,
            shippingFee,
            tax: totalTax,
            discount: totalDiscount,
            couponCode: totalDiscount ? couponCode : null,
            paymentStatus: paymentVerified ? "paid" : "pending",
            orders: savedOrders.map(o => o._id)
        };

        return res.status(CREATED).json({
            success: true,
            message: "Order created successfully",
            order: consolidated
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};




















export const getOrderById = async (req, res) => {

    try {

        const { orderId } = req.params

        const order = await Order.findById(orderId)
            .populate({
                path: 'orderItems.product',
                select: 'name colors'
            });


        if (!order) return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "order not found"
        });

        const orderForRes = await attachSignedUrlsToOrderItems(order)


        res.status(OK).json({
            success: true,
            order: orderForRes
        });

    } catch (error) {
        console.log(error);

        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error
        })
    }
};


export const getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({ user: req.user.userId })
            .populate({
                path: 'orderItems.product',
                select: 'name colors'
            })
            .sort({ createdAt: -1 });

        const ordersForRes = await attachSignedUrlsToOrders(orders)

        res.status(OK).json({
            success: true,
            count: orders.length,
            orders: ordersForRes
        });

    } catch (error) {
        console.log("errrrrrrrrrrorrrrrrrrr", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error
        })
    }
};


export const cancelOrder = async (req, res) => {

    const { orderId } = req.params;
    const { reason } = req.body;


    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);

        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        if (["delivered", "returned"].includes(order.orderStatus)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Cannot cancel order in current status"
            });
        }


        order.orderStatus = "cancelled";
        order.cancelReason = reason;

        let refundAmount = 0;
        let refundProcessed = false;

        if (order.paymentStatus === "paid" && order.paymentMethod !== "cod") {
            refundAmount = order.totalAmount - order.shippingFee;

            order.paymentStatus = "refunded";

            let wallet = await Wallet.findOne({ userId: order.user }).session(session);
            if (!wallet) {
                wallet = new Wallet({
                    userId: order.user,
                    balance: 0,
                    pendingBalance: 0
                });
            }

            wallet.balance += refundAmount;
            await wallet.save({ session });

            const transaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId: order.user,
                type: 'cancellation_refund',
                amount: refundAmount,
                balance: wallet.balance,
                description: `Refund for cancelled order #${order.orderNumber || orderId}`,
                status: 'completed',
                source: 'cancellation_refund',
                reference: {
                    orderId: order._id
                },
                metadata: new Map([
                    ['cancelReason', reason || 'Not specified'],
                    ['cancelDate', new Date()],
                    ['originalAmount', order.totalAmount],
                    ['shippingFee', order.shippingFee]
                ])
            });

            await transaction.save({ session });
            refundProcessed = true;
        }

        const updatedOrder = await order.save({ session });

        for (const item of order.orderItems) {
            const product = await Product.findById(item.product).session(session);
            if (product) {
                const colorIndex = product.colors.findIndex(c => c.color === item.color);
                if (colorIndex !== -1) {
                    const sizeKey = getSizeKey(item.size);
                    product.colors[colorIndex].variants[sizeKey].stock += item.quantity;
                    product.colors[colorIndex].totalStock += item.quantity;
                    product.totalQuantity += item.quantity;
                    await product.save({ session });
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(OK).json({
            success: true,
            message: refundProcessed
                ? `Order cancelled successfully. ₹${refundAmount.toFixed(2)} has been credited to your wallet.`
                : "Order cancelled successfully",
            order: updatedOrder,
            refundAmount: refundProcessed ? refundAmount : 0,
            refundProcessed
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error cancelling order:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error while cancelling order",
            error: error.message
        });
    }
};


export const returnRequest = async (req, res) => {

    const { orderId } = req.params;
    const { items, reason, quantity } = req.body;

    if (!reason || !reason.trim()) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Return reason is required."
        });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Please select at least one item to return."
        });
    }

    try {

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Order not found."
            });
        }

        if (order.user.toString() !== req.user.userId.toString()) {
            return res.status(FORBIDDEN).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        if (order.orderStatus !== "delivered") {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Return request can only be made for delivered orders."
            });
        }

        const deliveredDate = order.deliveredAt || order.createdAt;

        const now = new Date();

        const returnWindow = 7 * 24 * 60 * 60 * 1000;
        if (now - new Date(deliveredDate) > returnWindow) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Return window has expired."
            });
        }

        const orderItemIds = order.orderItems.map(item => item.product.toString());

        for (const returnItem of items) {

            if (!orderItemIds.includes(returnItem.productId.toString())) {

                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid item selected for return."
                });
            }

            const orderItem = order.orderItems.find(item => item.product.toString() === returnItem.productId);

            if (returnItem.quantity > orderItem.quantity) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Return quantity cannot exceed purchased quantity."
                });
            }
        }

        order.returnStatus = "requested";
        order.returnReason = reason;
        order.orderStatus = "return requested";

        await order.save();

        return res.status(OK).json({
            success: true,
            message: "Return request submitted successfully."
        });


    } catch (error) {

        console.error("Error processing return request:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error."
        });
    }
}



