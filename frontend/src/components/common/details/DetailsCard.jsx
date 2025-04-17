import React from 'react';
import PropTypes from 'prop-types';

// Reusable DetailsCard Component
const DetailsCard = ({ title, children }) => {
    return (
        <div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">{children}</div>
        </div>
    );
};

DetailsCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default DetailsCard;