import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import PaginationSkeleton from '../Skeleton/PaginationSkeleton';

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
  className = '',
}) => {
  return (
    <div>
      {isLoading ? (
        <PaginationSkeleton />
      ) : (
        <ReactPaginate
          previousLabel={
            <span
              className={`w-[40px] h-[40px] rounded-full border border-[#ccc] flex items-center justify-center ${
                currentPage === 1
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-primaryColor'
              }`}
            >
              <i className='fa-sharp fa-solid fa-angle-left'></i>
            </span>
          }
          nextLabel={
            <span
              className={`w-[40px] h-[40px] rounded-full border border-[#ccc] flex items-center justify-center ${
                currentPage === totalPages
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-primaryColor'
              }`}
            >
              <i className='fa-sharp fa-solid fa-angle-right'></i>
            </span>
          }
          breakLabel={
            <span
              className={`w-[40px] h-[40px] rounded-full border border-[#ccc] flex items-center justify-center font-normal ${
                currentPage === totalPages
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-primaryColor'
              }`}
            >
              <i className='fa-sharp fa-solid fa-ellipsis'></i>
            </span>
          }
          initialPage={currentPage - 1} // currentPage start from 1, initialPage start from 0
          onPageChange={onPageChange}
          pageRangeDisplayed={2}
          pageCount={totalPages}
          renderOnZeroPageCount={null}
          className={`flex justify-center gap-3 ${
            className ? `${className}` : 'mt-20'
          }`}
          pageLinkClassName='w-[40px] h-[40px] rounded-full border border-[#ccc] flex items-center justify-center hover:border-primaryColor hover:text-primaryColor'
          activeLinkClassName='!border-primaryColor bg-primaryColor cursor-default text-white font-bold hover:text-white'
        />
      )}
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default Pagination;
