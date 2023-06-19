import { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';

import BreadCrumb from './../../components/BreadCrumb';
import ProductHeaderFilter from './../../components/ProductHeaderFilter';
import FilterSideBar from '../../components/FilterSideBar/FilterSideBar';
import ProductList from '../../components/ProductList';
import Pagination from '../../components/Pagination/Pagination';

import productApi from './../../api/productApi';
import useSearchParams from './../../hooks/useSearchParams';

const Products = () => {
  const searchParams = useSearchParams();

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(() => {
    return {
      price: '',
      date: '',
      salePrice: [],
      supplier: [],
    };
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(searchParams.get('page')) || 1;
  });

  const perPage = 8;
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProducts({
          params: {
            page: currentPage,
            limit: perPage,
            ...filters,
          },
        });

        const queryParamObj = {
          ...filters,
          page: currentPage,
        };
        const queryParam = queryString.stringify(queryParamObj, {
          skipEmptyString: true,
        });
        if (queryParam) {
          window.history.replaceState({}, '', `?${queryParam}`);
        }

        setProductList(response.data.products);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [currentPage, filters]);

  const handlePageChange = (currentPageIndex) => {
    const currentPage = currentPageIndex.selected + 1;
    setCurrentPage(currentPage);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      return {
        ...prev,
        ...newFilters,
      };
    });
  };

  return (
    <Fragment>
      <BreadCrumb isLoading={isLoading} />
      <div className='container'>
        <ProductHeaderFilter
          categoryName='Tất cả sản phẩm'
          isLoading={isLoading}
          onFilterChange={handleFilterChange}
          setCurrentPage={setCurrentPage}
        />
        <div className='flex flex-col w-full lg:flex-row'>
          <div className='lg:w-[16.66667%] w-full mr-5'>
            <FilterSideBar
              filters={filters}
              handleFilterChange={handleFilterChange}
              setCurrentPage={setCurrentPage}
            />
          </div>
          <div className='lg:w-[83.33333%] w-full'>
            {!isLoading && productList.length === 0 && (
              <div className='flex items-center justify-center w-full h-full'>
                <h2 className='text-2xl font-medium'>
                  Hiện không có sản phẩm nào phù hợp
                </h2>
              </div>
            )}
            <ProductList
              productList={productList}
              isLoading={isLoading}
              skeletonItem={perPage}
            />
          </div>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </Fragment>
  );
};

export default Products;
