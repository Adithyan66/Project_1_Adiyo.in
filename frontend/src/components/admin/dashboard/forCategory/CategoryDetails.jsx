import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EditIcon } from 'lucide-react';

const CategoryDetails = ({ category, onUpdateCategory }) => {
    const [editMode, setEditMode] = useState({ active: false, type: null });

    const toggleEditMode = (type) => {
        if (editMode.active && editMode.type === type) {
            setEditMode({ active: false, type: null });
        } else {
            setEditMode({ active: true, type });
        }
    };

    return (
        <div className="col-span-4 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-black border-b border-gray-200">
                <h2 className="font-semibold text-white">Category Details</h2>
            </div>
            <div className="p-4">
                <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Thumbnail URL</h3>
                    <div className="flex flex-col">
                        <img
                            src={
                                category.thumbnail ||
                                'https://imgs.search.brave.com/BROTLDRy85AwUbXbbtJ-FE7APPpmEwDArmQ4-J-U2Ow/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjM2/NDA5NjE4L3Bob3Rv/L3BvcnRyYWl0LW9m/LWEtc21pbGluZy1t/YW4uanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPVBKbXozcjZD/d1I4MlF3aG0zTG9O/WGJhQnMwM3FzZDZv/ZTBnM2NYd0N5dVU9'
                            }
                            alt={category.name}
                            className="w-32 h-32 object-cover rounded-md border border-gray-200 mb-3"
                        />
                        {editMode.active && editMode.type === 'thumbnail' ? (
                            <div className="w-full">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={category.thumbnail || ''}
                                        onChange={(e) => onUpdateCategory('thumbnail', e.target.value)}
                                        placeholder="Thumbnail URL"
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <button
                                        onClick={() => toggleEditMode('thumbnail')}
                                        className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => toggleEditMode('thumbnail')}
                                className="bg-gray-100 text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center w-fit"
                            >
                                <EditIcon className="mr-1" />
                                Edit Thumbnail URL
                            </button>
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Name</h3>
                    <div className="flex items-center">
                        {editMode.active && editMode.type === 'name' ? (
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    value={category.name}
                                    onChange={(e) => onUpdateCategory('name', e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <button
                                    onClick={() => toggleEditMode('name')}
                                    className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="flex-grow">{category.name}</p>
                                <button
                                    onClick={() => toggleEditMode('name')}
                                    className="ml-2 text-gray-600 hover:text-black"
                                >
                                    <EditIcon />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <div className="flex flex-col">
                        {editMode.active && editMode.type === 'description' ? (
                            <div className="flex flex-col w-full">
                                <textarea
                                    value={category.description || ''}
                                    onChange={(e) => onUpdateCategory('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="4"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => toggleEditMode('description')}
                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600">{category.description || 'No description provided.'}</p>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => toggleEditMode('description')}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <EditIcon />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

CategoryDetails.propTypes = {
    category: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        thumbnail: PropTypes.string,
    }).isRequired,
    onUpdateCategory: PropTypes.func.isRequired,
};

export default CategoryDetails;