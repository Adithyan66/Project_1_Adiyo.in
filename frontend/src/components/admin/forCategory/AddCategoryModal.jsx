import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
    const [newCategory, setNewCategory] = useState({ name: '', description: '', thumbnail: '' });

    const handleAddCategory = () => {
        onAddCategory(newCategory, () => setNewCategory({ name: '', description: '', thumbnail: '' }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10 ">
                <div className="bg-white rounded-lg p-6 w-full max-w-md ">

                    <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Category name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="3"
                                placeholder="Category description"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                            <input
                                type="text"
                                value={newCategory.thumbnail}
                                onChange={(e) => setNewCategory({ ...newCategory, thumbnail: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Thumbnail URL"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-2">
                        <button
                            onClick={() => {
                                onClose();
                                setNewCategory({ name: '', description: '', thumbnail: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddCategory}
                            disabled={!newCategory.name}
                            className={`px-4 py-2 ${!newCategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

AddCategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddCategory: PropTypes.func.isRequired,
};

export default AddCategoryModal;