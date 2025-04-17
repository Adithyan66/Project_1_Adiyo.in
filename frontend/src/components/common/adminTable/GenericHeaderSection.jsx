
// import React, { useRef, memo } from 'react';
// import PropTypes from 'prop-types';

// const GenericHeaderSection = memo(
//     ({
//         title,
//         searchPlaceholder,
//         searchTerm,
//         setSearchTerm,
//         handleSearch,
//         clearSearch,
//         filterValue,
//         setFilterValue,
//         setCurrentPage,
//         filterOptions,
//         showFilter = true,
//         actionButton,
//     }) => {
//         const inputRef = useRef(null);

//         // Log to debug re-renders (remove in production)
//         console.log(`${title} HeaderSection rendered`);

//         return (
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 w-full">
//                 <h1 className="text-2xl font-bold mb-4 md:mb-0">{title}</h1>
//                 <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
//                     <form onSubmit={handleSearch} className="flex">
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             placeholder={searchPlaceholder}
//                             value={searchTerm}
//                             onChange={(e) => {
//                                 setSearchTerm(e.target.value);
//                                 inputRef.current.focus(); // Retain focus after typing
//                             }}
//                             className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
//                         />
//                         <button type="submit" className="bg-black text-white px-4 py-2">
//                             Search
//                         </button>
//                         {searchTerm && (
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     clearSearch();
//                                     inputRef.current.focus(); // Retain focus after clearing
//                                 }}
//                                 className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300"
//                             >
//                                 Clear
//                             </button>
//                         )}
//                     </form>
//                     {actionButton && <div className="flex items-center">{actionButton}</div>}
//                     {showFilter && (
//                         <select
//                             value={filterValue}
//                             onChange={(e) => {
//                                 setFilterValue(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                             className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
//                         >
//                             {filterOptions.map((option) => (
//                                 <option key={option.value} value={option.value}>
//                                     {option.label}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>
//             </div>
//         );
//     }
// );

// GenericHeaderSection.propTypes = {
//     title: PropTypes.string.isRequired,
//     searchPlaceholder: PropTypes.string.isRequired,
//     searchTerm: PropTypes.string.isRequired,
//     setSearchTerm: PropTypes.func.isRequired,
//     handleSearch: PropTypes.func.isRequired,
//     clearSearch: PropTypes.func.isRequired,
//     filterValue: PropTypes.string,
//     setFilterValue: PropTypes.func,
//     setCurrentPage: PropTypes.func,
//     filterOptions: PropTypes.arrayOf(
//         PropTypes.shape({
//             value: PropTypes.string.isRequired,
//             label: PropTypes.string.isRequired,
//         })
//     ),
//     showFilter: PropTypes.bool,
//     actionButton: PropTypes.node,
// };

// export default GenericHeaderSection;






import React, { useRef, memo } from 'react';
import PropTypes from 'prop-types';

const GenericHeaderSection = memo(
    ({
        title,
        searchPlaceholder,
        searchTerm,
        setSearchTerm,
        handleSearch,
        clearSearch,
        filterValue,
        setFilterValue,
        setCurrentPage,
        filterOptions,
        showFilter = true,
        actionButton,
    }) => {
        const inputRef = useRef(null);

        // Log to debug re-renders (remove in production)
        console.log(`${title} HeaderSection rendered`);

        return (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 w-full">
                <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">{title}</h1>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                inputRef.current.focus(); // Retain focus after typing
                            }}
                            className="flex-grow min-w-0 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 whitespace-nowrap">
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    clearSearch();
                                    inputRef.current.focus(); // Retain focus after clearing
                                }}
                                className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300 whitespace-nowrap"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                    {actionButton && <div className="flex items-center">{actionButton}</div>}
                    {showFilter && (
                        <select
                            value={filterValue}
                            onChange={(e) => {
                                setFilterValue(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        );
    }
);

GenericHeaderSection.propTypes = {
    title: PropTypes.string.isRequired,
    searchPlaceholder: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    clearSearch: PropTypes.func.isRequired,
    filterValue: PropTypes.string,
    setFilterValue: PropTypes.func,
    setCurrentPage: PropTypes.func,
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    showFilter: PropTypes.bool,
    actionButton: PropTypes.node,
};

export default GenericHeaderSection;