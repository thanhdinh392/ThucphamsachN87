import { useState, useEffect, Fragment } from 'react';
import queryString from 'query-string';
import { Link, useParams } from 'react-router-dom';

import ProductHeaderFilter from '../../components/ProductHeaderFilter';
import ProductList from '../../components/ProductList';
import NoProductInCategory from './../../components/NoProductInCategory';
import BreadCrumb from '../../components/BreadCrumb';
import NotFound from './../NotFound';
import Pagination from '../../components/Pagination';
import productApi from '../../api/productApi';
import FilterSideBar from './../../components/FilterSideBar';
import useSearchParams from '../../hooks/useSearchParams';

const CategoryProduct = () => {
  const searchParams = useSearchParams();

  const [productList, setProductList] = useState([]);
  const [categoryName, setCategoryName] = useState('');
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
  const { categorySlug } = useParams();
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProductsByCategory(categorySlug, {
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
        setCategoryName(response.data.categoryName);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        if (error.response.status === 404) {
          setProductList(null);
          setCategoryName(error.response.data.categoryName);
        }
        if (
          error.response.status === 400 &&
          !error.response.data.categoryName
        ) {
          setCategoryName(null);
        }
      }
      setIsLoading(false);
    };
    fetchProductsByCategory();
  }, [currentPage, categorySlug, filters]);

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

  let content;
  if (productList) {
    content = (
      <Fragment>
        <BreadCrumb isLoading={isLoading}>{categoryName}</BreadCrumb>
        <div className='container'>
          <ProductHeaderFilter
            categoryName={categoryName}
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
  }

  if (categoryName === null) {
    content = <NotFound />;
  }

  if (productList === null) {
    content = (
      <Fragment>
        <BreadCrumb isLoading={isLoading}>{categoryName}</BreadCrumb>
        <NoProductInCategory />
        <div className='container text-center'>
          <h4 className='mb-6 text-xl font-medium'>
            Vui lòng quay lại trang sản phẩm để tiếp tục mua sắm!
          </h4>
          <Link
            className='inline-block min-w-[300px] py-2 mb-2 text-base text-center text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
            to='/products'
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </Fragment>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default CategoryProduct;
