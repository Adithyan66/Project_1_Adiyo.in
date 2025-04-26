
// import React from 'react';
// import CategoryList from './CategoryList.jsx';
// import SubcategoryList from './SubcategoryList.jsx';
// import CategoryDetails from './CategoryDetails.jsx';
// import AddCategoryModal from './AddCategoryModal.jsx';
// import AddSubcategoryModal from './AddSubcategoryModal.jsx';
// import useCategoryManagement from '../../../../hooks/admin/useCategoryManagement.js';
// import { PlusIcon } from 'lucide-react';
// import { PulseRingLoader } from '../../../common/loading/Spinner.jsx';

// const CategoryManagement = () => {
//     const {
//         categories,
//         selectedCategoryId,
//         setSelectedCategoryId,
//         isLoading,
//         error,
//         setError,
//         addCategory,
//         addSubcategory,
//         deleteCategory,
//         deleteSubcategory,
//         updateCategory,
//         updateSubcategory,
//         isAddingCategory,
//         setIsAddingCategory,
//         isAddingSubcategory,
//         setIsAddingSubcategory,
//     } = useCategoryManagement();

//     const selectedCategory = categories.find((c) => c._id === selectedCategoryId) || null;

//     if (isLoading) {
//         return (
//             <PulseRingLoader />
//         );
//     }
//     if (error) {
//         return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
//     }

//     return (
//         <div className="p-6 bg-white min-h-screen w-full">
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
//                     <button
//                         onClick={() => setIsAddingCategory(true)}
//                         className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
//                     >
//                         <PlusIcon className="w-4 h-4 mr-1" />
//                         Add Category
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-12 gap-6">
//                     <CategoryList
//                         categories={categories}
//                         selectedCategoryId={selectedCategoryId}
//                         onSelectCategory={setSelectedCategoryId}
//                         onDeleteCategory={deleteCategory}
//                     />
//                     {selectedCategory && (
//                         <>
//                             <SubcategoryList
//                                 category={selectedCategory}
//                                 onAddSubcategory={() => setIsAddingSubcategory(true)}
//                                 onDeleteSubcategory={deleteSubcategory}
//                                 onUpdateSubcategory={updateSubcategory}
//                             />
//                             <CategoryDetails
//                                 category={selectedCategory}
//                                 onUpdateCategory={updateCategory}
//                             />
//                         </>
//                     )}
//                 </div>

//                 <AddCategoryModal
//                     isOpen={isAddingCategory}
//                     onClose={() => setIsAddingCategory(false)}
//                     onAddCategory={addCategory}
//                 />
//                 <AddSubcategoryModal
//                     isOpen={isAddingSubcategory}
//                     onClose={() => setIsAddingSubcategory(false)}
//                     onAddSubcategory={addSubcategory}
//                 />
//             </div>
//         </div>
//     );
// };

// CategoryManagement.propTypes = {};

// export default CategoryManagement;





import React from 'react';
import CategoryList from './CategoryList.jsx';
import SubcategoryList from './SubcategoryList.jsx';
import CategoryDetails from './CategoryDetails.jsx';
import AddCategoryModal from './AddCategoryModal.jsx';
import AddSubcategoryModal from './AddSubcategoryModal.jsx';
import useCategoryManagement from '../../../../hooks/admin/useCategoryManagement.js';
import { PlusIcon } from 'lucide-react';
import { PulseRingLoader } from '../../../common/loading/Spinner.jsx';
import ErrorModal from '../../../common/error/ErrorModal.jsx';
import { useNavigate } from 'react-router';

const CategoryManagement = () => {

    const navigate = useNavigate()

    const {
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        isLoading,
        error,
        setError,
        addCategory,
        addSubcategory,
        deleteCategory,
        deleteSubcategory,
        updateCategory,
        updateSubcategory,
        isAddingCategory,
        setIsAddingCategory,
        isAddingSubcategory,
        setIsAddingSubcategory,
    } = useCategoryManagement();

    const selectedCategory = categories.find((c) => c._id === selectedCategoryId) || null;

    if (isLoading) {
        return (
            <PulseRingLoader />
        );
    }
    // if (error) {
    //     return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    // }

    return (
        <div className="p-3 sm:p-6 bg-white min-h-screen w-full">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Category Management</h1>
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="bg-black hover:bg-gray-700 text-white px-3 py-2 rounded-md flex items-center text-sm w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Add Category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    <div className="md:col-span-12 lg:col-span-4">
                        <CategoryList
                            categories={categories}
                            selectedCategoryId={selectedCategoryId}
                            onSelectCategory={setSelectedCategoryId}
                            onDeleteCategory={deleteCategory}
                        />
                    </div>

                    {selectedCategory && (
                        <>
                            <div className="md:col-span-6 lg:col-span-4">
                                <SubcategoryList
                                    category={selectedCategory}
                                    onAddSubcategory={() => setIsAddingSubcategory(true)}
                                    onDeleteSubcategory={deleteSubcategory}
                                    onUpdateSubcategory={updateSubcategory}
                                />
                            </div>
                            <div className="md:col-span-6 lg:col-span-4">
                                <CategoryDetails
                                    category={selectedCategory}
                                    onUpdateCategory={updateCategory}
                                />
                            </div>
                        </>
                    )}
                </div>

                <AddCategoryModal
                    isOpen={isAddingCategory}
                    onClose={() => setIsAddingCategory(false)}
                    onAddCategory={addCategory}
                />
                <AddSubcategoryModal
                    isOpen={isAddingSubcategory}
                    onClose={() => setIsAddingSubcategory(false)}
                    onAddSubcategory={addSubcategory}
                />
            </div>
        </div>
    );
};

CategoryManagement.propTypes = {};

export default CategoryManagement;