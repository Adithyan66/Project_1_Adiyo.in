// components/ui/card.jsx
import React from 'react';

// Card Container Component
export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={`rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Header Component
export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div
            className={`flex flex-col p-6 space-y-1.5 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Title Component
export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3
            className={`font-semibold text-lg leading-none tracking-tight ${className || ''}`}
            {...props}
        >
            {children}
        </h3>
    );
};

// Card Description Component
export const CardDescription = ({ className, children, ...props }) => {
    return (
        <p
            className={`text-sm text-gray-500 ${className || ''}`}
            {...props}
        >
            {children}
        </p>
    );
};

// Card Content Component
export const CardContent = ({ className, children, ...props }) => {
    return (
        <div
            className={`p-6 pt-0 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Footer Component
export const CardFooter = ({ className, children, ...props }) => {
    return (
        <div
            className={`flex items-center p-6 pt-0 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter
};