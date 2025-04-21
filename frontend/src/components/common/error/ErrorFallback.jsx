import React, { useState, useEffect } from 'react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

// This is our fallback component that displays when an error occurs
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const navigateToHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
                <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    We apologize for the inconvenience. The application encountered an unexpected error.
                </p>
                <div className="mb-4 p-3 sm:p-4 bg-gray-100 rounded-md overflow-auto text-left max-h-32 sm:max-h-40">
                    <p className="text-xs sm:text-sm font-mono text-gray-700 break-words">
                        {error.message || error.toString()}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={resetErrorBoundary}
                        className="py-2 px-4 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 text-gray-800 font-medium rounded-lg transition duration-150 ease-in-out text-sm sm:text-base"
                    >
                        Try again
                    </button>
                    <button
                        onClick={navigateToHome}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg transition duration-150 ease-in-out flex-1 text-sm sm:text-base"
                    >
                        Return to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function ErrorBoundaryWrapper({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                console.error("Caught by ErrorBoundary:", error, info);
                // 🚀 You could log to Sentry or your backend here
            }}
        >
            {children}
        </ErrorBoundary>
    );
}