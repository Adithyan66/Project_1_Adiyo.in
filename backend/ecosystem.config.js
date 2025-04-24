

export default {
    apps: [
        {
            name: 'server',
            script: './src/server.js',
            env: {
                RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
                RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
            },
        },
    ],
};
