import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddSubcategoryModal = ({ isOpen, onClose, onAddSubcategory }) => {
    const [newSubcategory, setNewSubcategory] = useState({ name: '' });

    const handleAddSubcategory = () => {
        onAddSubcategory(newSubcategory, () => setNewSubcategory({ name: '' }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10 ">
                <div className="bg-white rounded-lg p-6 w-full max-w-md ">
                    <h2 className="text-xl font-bold mb-4">Add New Subcategory</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={newSubcategory.name}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Subcategory name"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-2">
                        <button
                            onClick={() => {
                                onClose();
                                setNewSubcategory({ name: '' });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSubcategory}
                            disabled={!newSubcategory.name}
                            className={`px-4 py-2 ${!newSubcategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
                        >
                            Add Subcategory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

AddSubcategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddSubcategory: PropTypes.func.isRequired,
};

export default AddSubcategoryModal;