

// import { useState, useEffect } from 'react';
// import { Trash, Edit, Plus, X } from 'lucide-react';
// import axios from 'axios';


// const API_BASE_URL = import.meta.env.VITE_API_URL;



// const CategoryManagement = () => {


//     const [categories, setCategories] = useState([]);
//     const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Changed from [] to null
//     const [newCategory, setNewCategory] = useState({ name: '', description: '', thumbnail: '' });
//     const [newSubcategory, setNewSubcategory] = useState({ name: '' });
//     const [isAddingCategory, setIsAddingCategory] = useState(false);
//     const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
//     const [editMode, setEditMode] = useState({ active: false, type: null, id: null });
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Ensure categories is an array
//     const safeCategories = Array.isArray(categories) ? categories : [];
//     const selectedCategory = safeCategories.find(c => c._id === selectedCategoryId) ||
//         (safeCategories.length > 0 ? safeCategories[0] : null);

//     // Fetch categories from backend
//     useEffect(() => {
//         fetchCategories();
//     }, []);




//     const fetchCategories = async () => {

//         setIsLoading(true);
//         try {

//             const response = await axios.get(`${API_BASE_URL}/admin/categories`);

//             console.log(response.data);

//             const fetchedCategories = Array.isArray(response.data)
//                 ? response.data
//                 : [];

//             setCategories(fetchedCategories);

//             if (fetchedCategories.length > 0) {
//                 setSelectedCategoryId(fetchedCategories[0]._id);
//             }


//             setError(null);

//         } catch (err) {

//             setError('Failed to fetch categories. Please try again.');
//             console.error('Error fetching categories:', err);

//         } finally {

//             setIsLoading(false);
//         }
//     };


//     // Handle category selection
//     const selectCategory = (categoryId) => {
//         setSelectedCategoryId(categoryId);
//         setEditMode({ active: false, type: null, id: null });
//     };

//     // Add new category
//     const addCategory = async () => {


//         if (!newCategory.name) return;


//         try {
//             const response = await axios.post(`${API_BASE_URL}/admin/add-category`, newCategory);
//             const addedCategory = response.data;
//             setCategories([...categories, addedCategory]);
//             setIsAddingCategory(false);
//             setSelectedCategoryId(addedCategory.id);
//             setNewCategory({ name: '', description: '', thumbnail: '' });
//         } catch (err) {
//             setError('Failed to add category. Please try again.');
//             console.error('Error adding category:', err);
//         }
//     };

//     // Add new subcategory
//     const addSubcategory = async () => {
//         console.log("1");
//         if (!newSubcategory.name || !selectedCategoryId) return;
//         console.log("2");

//         try {
//             const response = await axios.post(`${API_BASE_URL}/admin/${selectedCategoryId}/add-subcategories`, newSubcategory);

//             const updatedCategories = categories.map(category => {
//                 if (category.id === selectedCategoryId) {
//                     return {
//                         ...category,
//                         subcategories: [...(category.subcategories || []), response.data]
//                     };
//                 }
//                 return category;
//             });
//             setCategories(updatedCategories);
//             setIsAddingSubcategory(false);
//             setNewSubcategory({ name: '' });
//             fetchCategories()

//         } catch (err) {
//             setError('Failed to add subcategory. Please try again.');
//             console.error('Error adding subcategory:', err);
//         }
//     };

//     // Delete category
//     const deleteCategory = async (categoryId) => {
//         try {
//             await axios.delete(`${API_BASE_URL}/admin/delete-categories/${categoryId}`);
//             const updatedCategories = categories.filter(category => category.id !== categoryId);
//             setCategories(updatedCategories);
//             // Update selectedCategoryId based on the new list
//             if (selectedCategoryId === categoryId) {
//                 if (updatedCategories.length > 0) {
//                     setSelectedCategoryId(updatedCategories[0].id);
//                 } else {
//                     setSelectedCategoryId(null);
//                 }

//             }
//             fetchCategories()
//         } catch (err) {
//             setError('Failed to delete category. Please try again.');
//             console.error('Error deleting category:', err);
//         }
//     };

//     // Delete subcategory
//     const deleteSubcategory = async (subcategoryId) => {

//         if (!selectedCategoryId) return;

//         console.log("working");

//         try {
//             await axios.delete(`${API_BASE_URL}/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`);

//             const updatedCategories = categories.map(category => {
//                 if (category.id === selectedCategoryId) {
//                     return {
//                         ...category,
//                         subcategories: (category.subcategories || []).filter(
//                             subcategory => subcategory.id !== subcategoryId
//                         )
//                     };
//                 }
//                 return category;
//             });
//             setCategories(updatedCategories);
//             fetchCategories()
//         } catch (err) {
//             setError('Failed to delete subcategory. Please try again.');
//             console.error('Error deleting subcategory:', err);
//         }
//     };

//     // Toggle edit mode
//     const toggleEditMode = (type, id = null) => {
//         if (editMode.active && editMode.type === type && editMode.id === id) {
//             setEditMode({ active: false, type: null, id: null });
//         } else {
//             setEditMode({ active: true, type, id });
//         }
//     };

//     // Update category
//     const updateCategory = async (field, value) => {
//         if (!selectedCategoryId) return;

//         try {
//             const updatedCategory = {
//                 ...selectedCategory,
//                 [field]: value
//             };

//             await axios.put(`/api/admin/categories/${selectedCategoryId}`, updatedCategory);

//             setCategories(categories.map(category => {
//                 if (category.id === selectedCategoryId) {
//                     return { ...category, [field]: value };
//                 }
//                 return category;
//             }));
//         } catch (err) {
//             setError('Failed to update category. Please try again.');
//             console.error('Error updating category:', err);
//         }
//     };

//     // Update subcategory
//     const updateSubcategory = async (subcategoryId, field, value) => {

//         if (!selectedCategoryId) return;



//         try {
//             const subcategory = selectedCategory.subcategories?.find(sc => sc._id === subcategoryId);
//             if (!subcategory) return;

//             console.log("id", subcategory);
//             const updatedSubcategory = {
//                 ...subcategory,
//                 [field]: value
//             };

//             await axios.put(`${API_BASE_URL}/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`, updatedSubcategory);

//             setCategories(categories.map(category => {
//                 if (category.id === selectedCategoryId) {
//                     return {
//                         ...category,
//                         subcategories: category.subcategories.map(sc => {
//                             if (sc.id === subcategoryId) {
//                                 return { ...sc, [field]: value };
//                             }
//                             return sc;
//                         })
//                     };
//                 }
//                 return category;
//             }));
//         } catch (err) {
//             setError('Failed to update subcategory. Please try again.');
//             console.error('Error updating subcategory:', err);
//         } finally {
//             fetchCategories()
//             toggleEditMode('subcategory')
//         }
//     }


//     if (isLoading) {

//         return (
//             <div className="p-6 flex justify-center items-center min-h-screen">
//                 <p>Loading categories...</p>
//             </div>
//         );
//     }



//     return (
//         <div className="p-6 bg-white min-h-screen w-full">
//             <div className="max-w-6xl mx-auto">
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex justify-between items-center">
//                         <span>{error}</span>
//                         <button onClick={() => setError(null)}>
//                             <X size={16} />
//                         </button>
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
//                     <button
//                         onClick={() => setIsAddingCategory(true)}
//                         className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
//                     >
//                         <Plus size={18} className="mr-1" />
//                         Add Category
//                     </button>
//                 </div>

//                 {/* Main Layout */}
//                 <div className="grid grid-cols-12 gap-6">
//                     {/* Categories List - Left Panel */}
//                     <div className="col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
//                         <div className="p-4 bg-black border-b border-gray-200">
//                             <h2 className="font-semibold text-white">Categories</h2>
//                         </div>
//                         <div className="overflow-y-auto ">
//                             {safeCategories.map(category => (
//                                 <div
//                                     key={category.id}
//                                     className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${category._id === selectedCategoryId ? 'bg-gray-100 border-l-4 border-l-black' : 'hover:bg-gray-50'}`}
//                                     onClick={() => selectCategory(category._id)}
//                                 >
//                                     <div className="flex-shrink-0 mr-3">
//                                         <img
//                                             src={category.thumbnail || '/api/placeholder/200/200'}
//                                             alt={category.name}
//                                             className="w-10 h-10 rounded-md object-cover"
//                                         />
//                                     </div>
//                                     <div className="flex-grow">
//                                         <h3 className="font-medium">{category.name}</h3>
//                                         <p className="text-gray-500 text-sm truncate">
//                                             {category.description ? (category.description.substring(0, 25) + '...') : 'No description'}
//                                         </p>
//                                     </div>
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             deleteCategory(category._id);
//                                         }}
//                                         className="text-gray-500 hover:text-black ml-2"
//                                     >
//                                         <Trash size={16} />
//                                     </button>
//                                 </div>
//                             ))}

//                             {safeCategories.length === 0 && (
//                                 <div className="p-4 text-center text-gray-500">
//                                     No categories found.
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Selected Category Details - Middle Panel */}
//                     {selectedCategory && (
//                         <div className="col-span-5 bg-white rounded-lg shadow-md overflow-hidden">
//                             <div className="p-4 bg-black border-b border-black flex justify-between items-center">
//                                 <h2 className="font-semibold text-white">
//                                     {selectedCategory.name} - Subcategories
//                                 </h2>
//                             </div>

//                             <div className="p-4 grid grid-cols-1 sm:grid-cols-1 gap-4">
//                                 {selectedCategory.subcategories && selectedCategory.subcategories.map(subcategory => (
//                                     <div key={subcategory.id} className="border border-gray-200 rounded-md p-3 flex flex-col">
//                                         <div className="flex items-start mb-1">
//                                             <div className="ml-3 flex-grow">
//                                                 <div className="flex justify-between items-center">
//                                                     <h4 className="font-medium text-lg">{subcategory.name}</h4>
//                                                     <div className="flex items-center space-x-2">
//                                                         <button
//                                                             onClick={() => toggleEditMode('subcategory', subcategory._id)}
//                                                             className="bg-gray-100 text-black hover:bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center"
//                                                         >
//                                                             <Edit size={14} className="mr-1" />
//                                                             Edit Name
//                                                         </button>
//                                                         <button
//                                                             onClick={() => deleteSubcategory(subcategory._id)}
//                                                             className="text-gray-500 hover:text-black"
//                                                         >
//                                                             <Trash size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <p className="text-gray-500 mt-1">Stock: {subcategory.stock || 0}</p>
//                                             </div>
//                                         </div>



//                                         {editMode.active && editMode.type === 'subcategory' && editMode.id === subcategory._id && (
//                                             <div className="mt-3 border-t border-gray-200 pt-3">
//                                                 <div className="flex items-center">
//                                                     <input
//                                                         type="text"
//                                                         defaultValue={subcategory.name}
//                                                         onBlur={(e) => updateSubcategory(subcategory._id, 'name', e.target.value)}
//                                                         className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
//                                                     />
//                                                     <button
//                                                         onClick={() => toggleEditMode('subcategory', subcategory._id)}
//                                                         className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
//                                                     >
//                                                         <X size={16} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 {(!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) && (
//                                     <div className="col-span-full p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">
//                                         No subcategories found. Click 'Add Subcategory' to create one.
//                                     </div>
//                                 )}
//                                 <div className="flex justify-end">
//                                     <button
//                                         onClick={() => setIsAddingSubcategory(true)}
//                                         className="bg-black hover:bg-gray-700 text-white px-3 p-2 m-3 rounded-md text-sm flex items-center"
//                                     >
//                                         <Plus size={16} className="mr-1" />
//                                         Add Subcategory
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Category Details - Right Panel */}
//                     {selectedCategory && (
//                         <div className="col-span-4 bg-white rounded-lg shadow-md overflow-hidden">
//                             <div className="p-4 bg-black border-b border-gray-200">
//                                 <h2 className="font-semibold text-white">Category Details</h2>
//                             </div>

//                             <div className="p-4">
//                                 <div className="mb-6">
//                                     <h3 className="font-medium text-gray-700 mb-2">Thumbnail URL</h3>
//                                     <div className="flex flex-col">
//                                         <img
//                                             src={selectedCategory.thumbnail || '/api/placeholder/200/200'}
//                                             alt={selectedCategory.name}
//                                             className="w-32 h-32 object-cover rounded-md border border-gray-200 mb-3"
//                                         />

//                                         {editMode.active && editMode.type === 'thumbnail' ? (
//                                             <div className="w-full">
//                                                 <div className="flex items-center">
//                                                     <input
//                                                         type="text"
//                                                         value={selectedCategory.thumbnail || ''}
//                                                         onChange={(e) => updateCategory('thumbnail', e.target.value)}
//                                                         placeholder="Thumbnail URL"
//                                                         className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
//                                                     />
//                                                     <button
//                                                         onClick={() => toggleEditMode('thumbnail')}
//                                                         className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
//                                                     >
//                                                         <X size={16} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <button
//                                                 onClick={() => toggleEditMode('thumbnail')}
//                                                 className="bg-gray-100 text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center w-fit"
//                                             >
//                                                 <Edit size={16} className="mr-1" />
//                                                 Edit Thumbnail URL
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="mb-6">
//                                     <h3 className="font-medium text-gray-700 mb-2">Name</h3>
//                                     <div className="flex items-center">
//                                         {editMode.active && editMode.type === 'name' ? (
//                                             <div className="flex w-full">
//                                                 <input
//                                                     type="text"
//                                                     value={selectedCategory.name}
//                                                     onChange={(e) => updateCategory('name', e.target.value)}
//                                                     className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
//                                                 />
//                                                 <button
//                                                     onClick={() => toggleEditMode('name')}
//                                                     className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
//                                                 >
//                                                     <X size={16} />
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <p className="flex-grow">{selectedCategory.name}</p>
//                                                 <button
//                                                     onClick={() => toggleEditMode('name')}
//                                                     className="ml-2 text-gray-600 hover:text-black"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </button>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <h3 className="font-medium text-gray-700 mb-2">Description</h3>
//                                     <div className="flex flex-col">
//                                         {editMode.active && editMode.type === 'description' ? (
//                                             <div className="flex flex-col w-full">
//                                                 <textarea
//                                                     value={selectedCategory.description || ''}
//                                                     onChange={(e) => updateCategory('description', e.target.value)}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                                     rows="4"
//                                                 />
//                                                 <div className="flex justify-end mt-2">
//                                                     <button
//                                                         onClick={() => toggleEditMode('description')}
//                                                         className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
//                                                     >
//                                                         <X size={16} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <p className="text-gray-600">{selectedCategory.description || 'No description provided.'}</p>
//                                                 <div className="flex justify-end mt-2">
//                                                     <button
//                                                         onClick={() => toggleEditMode('description')}
//                                                         className="text-gray-600 hover:text-black"
//                                                     >
//                                                         <Edit size={16} />
//                                                     </button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Add Category Modal */}
//                 {isAddingCategory && (
//                     <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10 backdrop-blur-sm">
//                         <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black ">
//                             <h2 className="text-xl font-bold mb-4">Add New Category</h2>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                                     <input
//                                         type="text"
//                                         value={newCategory.name}
//                                         onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         placeholder="Category name"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                     <textarea
//                                         value={newCategory.description}
//                                         onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         rows="3"
//                                         placeholder="Category description"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
//                                     <input
//                                         type="text"
//                                         value={newCategory.thumbnail}
//                                         onChange={(e) => setNewCategory({ ...newCategory, thumbnail: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         placeholder="Thumbnail URL"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex justify-end mt-6 space-x-2">
//                                 <button
//                                     onClick={() => {
//                                         setIsAddingCategory(false);
//                                         setNewCategory({ name: '', description: '', thumbnail: '' });
//                                     }}
//                                     className="px-4 py-2 border border-gray-300 rounded-md"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={addCategory}
//                                     disabled={!newCategory.name}
//                                     className={`px-4 py-2 ${!newCategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
//                                 >
//                                     Add Category
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Add Subcategory Modal */}
//                 {isAddingSubcategory && (
//                     <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-10 backdrop-blur-sm ">
//                         <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black">
//                             <h2 className="text-xl font-bold mb-4">Add New Subcategory</h2>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                                     <input
//                                         type="text"
//                                         value={newSubcategory.name}
//                                         onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         placeholder="Subcategory name"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex justify-end mt-6 space-x-2">
//                                 <button
//                                     onClick={() => {
//                                         setIsAddingSubcategory(false);
//                                         setNewSubcategory({ name: '' });
//                                     }}
//                                     className="px-4 py-2 border border-gray-300 rounded-md"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={addSubcategory}
//                                     disabled={!newSubcategory.name}
//                                     className={`px-4 py-2 ${!newSubcategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
//                                 >
//                                     Add Subcategory
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

// }
// export default CategoryManagement;



import { useState, useEffect } from 'react';
import { Trash, Edit, Plus, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', thumbnail: '' });
    const [newSubcategory, setNewSubcategory] = useState({ name: '' });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
    const [editMode, setEditMode] = useState({ active: false, type: null, id: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ensure categories is an array
    const safeCategories = Array.isArray(categories) ? categories : [];
    const selectedCategory = safeCategories.find(c => c._id === selectedCategoryId) ||
        (safeCategories.length > 0 ? safeCategories[0] : null);

    // Fetch categories from backend
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/categories`);
            console.log(response.data);

            // Assuming the response data has a structure like { categories: [...], message, success }
            const fetchedCategories = Array.isArray(response.data.categories)
                ? response.data.categories
                : response.data; // adjust as necessary

            setCategories(fetchedCategories);

            if (fetchedCategories.length > 0) {
                setSelectedCategoryId(fetchedCategories[0]._id);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories. Please try again.');
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle category selection
    const selectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setEditMode({ active: false, type: null, id: null });
    };

    // Add new category
    const addCategory = async () => {
        if (!newCategory.name) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/add-category`, newCategory);
            const addedCategory = response.data;
            setCategories([...categories, addedCategory]);
            setIsAddingCategory(false);
            setSelectedCategoryId(addedCategory._id);
            setNewCategory({ name: '', description: '', thumbnail: '' });
        } catch (err) {
            setError('Failed to add category. Please try again.');
            console.error('Error adding category:', err);
        }
    };

    // Add new subcategory
    const addSubcategory = async () => {
        if (!newSubcategory.name || !selectedCategoryId) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/${selectedCategoryId}/add-subcategories`, newSubcategory);
            const addedSubcategory = response.data;
            const updatedCategories = categories.map(category => {
                if (category._id === selectedCategoryId) {
                    return {
                        ...category,
                        subcategories: [...(category.subcategories || []), addedSubcategory]
                    };
                }
                return category;
            });
            setCategories(updatedCategories);
            setIsAddingSubcategory(false);
            setNewSubcategory({ name: '' });
            fetchCategories();
        } catch (err) {
            setError('Failed to add subcategory. Please try again.');
            console.error('Error adding subcategory:', err);
        }
    };

    // Delete category
    const deleteCategory = async (categoryId) => {
        try {
            await axios.delete(`${API_BASE_URL}/admin/delete-categories/${categoryId}`);
            const updatedCategories = categories.filter(category => category._id !== categoryId);
            setCategories(updatedCategories);
            if (selectedCategoryId === categoryId) {
                setSelectedCategoryId(updatedCategories.length > 0 ? updatedCategories[0]._id : null);
            }
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category. Please try again.');
            console.error('Error deleting category:', err);
        }
    };

    // Delete subcategory
    const deleteSubcategory = async (subcategoryId) => {
        if (!selectedCategoryId) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`);
            const updatedCategories = categories.map(category => {
                if (category._id === selectedCategoryId) {
                    return {
                        ...category,
                        subcategories: (category.subcategories || []).filter(
                            subcategory => subcategory._id !== subcategoryId
                        )
                    };
                }
                return category;
            });
            setCategories(updatedCategories);
            fetchCategories();
        } catch (err) {
            setError('Failed to delete subcategory. Please try again.');
            console.error('Error deleting subcategory:', err);
        }
    };

    // Toggle edit mode
    const toggleEditMode = (type, id = null) => {
        if (editMode.active && editMode.type === type && editMode.id === id) {
            setEditMode({ active: false, type: null, id: null });
        } else {
            setEditMode({ active: true, type, id });
        }
    };

    // Update category
    const updateCategory = async (field, value) => {
        if (!selectedCategoryId) return;
        try {
            const updatedCategory = { ...selectedCategory, [field]: value };
            await axios.put(`${API_BASE_URL}/admin/categories/${selectedCategoryId}`, updatedCategory);
            setCategories(categories.map(category => {
                if (category._id === selectedCategoryId) {
                    return { ...category, [field]: value };
                }
                return category;
            }));
        } catch (err) {
            setError('Failed to update category. Please try again.');
            console.error('Error updating category:', err);
        }
    };

    // Update subcategory
    const updateSubcategory = async (subcategoryId, field, value) => {
        if (!selectedCategoryId) return;
        try {
            const subcategory = selectedCategory.subcategories?.find(sc => sc._id === subcategoryId);
            if (!subcategory) return;
            const updatedSubcategory = { ...subcategory, [field]: value };
            await axios.put(`${API_BASE_URL}/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`, updatedSubcategory);
            setCategories(categories.map(category => {
                if (category._id === selectedCategoryId) {
                    return {
                        ...category,
                        subcategories: category.subcategories.map(sc => {
                            if (sc._id === subcategoryId) {
                                return { ...sc, [field]: value };
                            }
                            return sc;
                        })
                    };
                }
                return category;
            }));
        } catch (err) {
            setError('Failed to update subcategory. Please try again.');
            console.error('Error updating subcategory:', err);
        } finally {
            fetchCategories();
            toggleEditMode('subcategory');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-screen w-full">
            <div className="max-w-6xl mx-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <Plus size={18} className="mr-1" />
                        Add Category
                    </button>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Categories List - Left Panel */}
                    <div className="col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 bg-black border-b border-gray-200">
                            <h2 className="font-semibold text-white">Categories</h2>
                        </div>
                        <div className="overflow-y-auto">
                            {safeCategories.map(category => (
                                <div
                                    key={category._id}
                                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${category._id === selectedCategoryId ? 'bg-gray-100 border-l-4 border-l-black' : 'hover:bg-gray-50'}`}
                                    onClick={() => selectCategory(category._id)}
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        <img
                                            src={category.thumbnail || '/api/placeholder/200/200'}
                                            alt={category.name}
                                            className="w-10 h-10 rounded-md object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-medium">{category.name}</h3>
                                        <p className="text-gray-500 text-sm truncate">
                                            {category.description ? (category.description.substring(0, 25) + '...') : 'No description'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCategory(category._id);
                                        }}
                                        className="text-gray-500 hover:text-black ml-2"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            {safeCategories.length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    No categories found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Category Details - Middle Panel */}
                    {selectedCategory && (
                        <div className="col-span-5 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 bg-black border-b border-black flex justify-between items-center">
                                <h2 className="font-semibold text-white">
                                    {selectedCategory.name} - Subcategories
                                </h2>
                            </div>
                            <div className="p-4 grid grid-cols-1 gap-4">
                                {selectedCategory.subcategories && selectedCategory.subcategories.map(subcategory => (
                                    <div key={subcategory._id} className="border border-gray-200 rounded-md p-3 flex flex-col">
                                        <div className="flex items-start mb-1">
                                            <div className="ml-3 flex-grow">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-lg">{subcategory.name}</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => toggleEditMode('subcategory', subcategory._id)}
                                                            className="bg-gray-100 text-black hover:bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center"
                                                        >
                                                            <Edit size={14} className="mr-1" />
                                                            Edit Name
                                                        </button>
                                                        <button
                                                            onClick={() => deleteSubcategory(subcategory._id)}
                                                            className="text-gray-500 hover:text-black"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 mt-1">Stock: {subcategory.stock || 0}</p>
                                            </div>
                                        </div>
                                        {editMode.active && editMode.type === 'subcategory' && editMode.id === subcategory._id && (
                                            <div className="mt-3 border-t border-gray-200 pt-3">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        defaultValue={subcategory.name}
                                                        onBlur={(e) => updateSubcategory(subcategory._id, 'name', e.target.value)}
                                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    />
                                                    <button
                                                        onClick={() => toggleEditMode('subcategory', subcategory._id)}
                                                        className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) && (
                                    <div className="col-span-full p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">
                                        No subcategories found. Click 'Add Subcategory' to create one.
                                    </div>
                                )}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsAddingSubcategory(true)}
                                        className="bg-black hover:bg-gray-700 text-white px-3 py-2 m-3 rounded-md text-sm flex items-center"
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Subcategory
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Details - Right Panel */}
                    {selectedCategory && (
                        <div className="col-span-4 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 bg-black border-b border-gray-200">
                                <h2 className="font-semibold text-white">Category Details</h2>
                            </div>
                            <div className="p-4">
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Thumbnail URL</h3>
                                    <div className="flex flex-col">
                                        <img
                                            src={selectedCategory.thumbnail || '/api/placeholder/200/200'}
                                            alt={selectedCategory.name}
                                            className="w-32 h-32 object-cover rounded-md border border-gray-200 mb-3"
                                        />
                                        {editMode.active && editMode.type === 'thumbnail' ? (
                                            <div className="w-full">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        value={selectedCategory.thumbnail || ''}
                                                        onChange={(e) => updateCategory('thumbnail', e.target.value)}
                                                        placeholder="Thumbnail URL"
                                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    />
                                                    <button
                                                        onClick={() => toggleEditMode('thumbnail')}
                                                        className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => toggleEditMode('thumbnail')}
                                                className="bg-gray-100 text-black hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center w-fit"
                                            >
                                                <Edit size={16} className="mr-1" />
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
                                                    value={selectedCategory.name}
                                                    onChange={(e) => updateCategory('name', e.target.value)}
                                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                                <button
                                                    onClick={() => toggleEditMode('name')}
                                                    className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="flex-grow">{selectedCategory.name}</p>
                                                <button
                                                    onClick={() => toggleEditMode('name')}
                                                    className="ml-2 text-gray-600 hover:text-black"
                                                >
                                                    <Edit size={16} />
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
                                                    value={selectedCategory.description || ''}
                                                    onChange={(e) => updateCategory('description', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    rows="4"
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => toggleEditMode('description')}
                                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-600">{selectedCategory.description || 'No description provided.'}</p>
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => toggleEditMode('description')}
                                                        className="text-gray-600 hover:text-black"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Category Modal */}
                {isAddingCategory && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black">
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
                                        setIsAddingCategory(false);
                                        setNewCategory({ name: '', description: '', thumbnail: '' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addCategory}
                                    disabled={!newCategory.name}
                                    className={`px-4 py-2 ${!newCategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
                                >
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Subcategory Modal */}
                {isAddingSubcategory && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black">
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
                                        setIsAddingSubcategory(false);
                                        setNewSubcategory({ name: '' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addSubcategory}
                                    disabled={!newSubcategory.name}
                                    className={`px-4 py-2 ${!newSubcategory.name ? 'bg-gray-300' : 'bg-black'} text-white rounded-md`}
                                >
                                    Add Subcategory
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
