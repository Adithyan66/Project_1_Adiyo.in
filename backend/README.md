/backend
│── /src
│   ├── /config         # Configuration files (DB, env, etc.)
│   │   ├── db.js       # MongoDB connection
│   │   ├── env.js      # Environment variables
│   │
│   ├── /controllers    # Route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── sellerController.js
│   │   ├── deliveryAgentController.js
│   │
│   ├── /middlewares    # Middleware functions
│   │   ├── authMiddleware.js   # Auth & role-based access
│   │   ├── errorMiddleware.js  # Error handling
│   │   ├── uploadMiddleware.js # File uploads (Cloudinary, Multer)
│   │
│   ├── /models         # Mongoose models (Database schemas)
│   │   ├── adminModel.js
│   │   ├── customerModel.js
│   │   ├── sellerModel.js
│   │   ├── deliveryAgentModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │
│   ├── /routes         # Routes for different roles
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── sellerRoutes.js
│   │   ├── deliveryAgentRoutes.js
│   │
│   ├── /services       # Business logic services
│   │   ├── emailService.js   # Sending emails
│   │   ├── paymentService.js # Payment gateway integration
│   │   ├── orderService.js   # Order management logic
│   │
│   ├── /utils          # Utility functions/helpers
│   │   ├── generateToken.js   # JWT token generator
│   │   ├── errorHandler.js    # Error formatter
│   │
│   ├── app.js          # Express app initialization
│   ├── server.js       # Server entry point
│
│── /tests              # Unit & integration tests
│── /.env               # Environment variables
│── /package.json       # Dependencies & scripts
│── /README.md          # Project documentation