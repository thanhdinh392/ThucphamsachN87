import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import BreadCrumb from '../../components/BreadCrumb';
import ProductList from '../../components/ProductList';
import productApi from './../../api/productApi';
import useSearchParams from './../../hooks/useSearchParams';

const Search = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  const inputRef = useRef('');

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const keyword = searchParams.get('q');

  useEffect(() => {
    const fetchProductList = async () => {
      if (!keyword) return;
      setIsLoading(true);
      try {
        const response = await productApi.searchProduct(keyword);
        setProductList(response.data.products);
      } catch (error) {
        if (error.response.status === 404) {
          setProductList(null);
        }
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchProductList();
  }, [searchParams.get('q')]);

  return (
    <div>
      <BreadCrumb isLoading={isLoading}>
        {keyword ? (
          <Fragment>
            <span>Tìm kiếm từ khóa: </span>
            <span className='text-primaryColor'> {keyword}</span>
          </Fragment>
        ) : (
          <Fragment>Tìm kiếm - Cool Organic</Fragment>
        )}
      </BreadCrumb>
      <div className='container'>
        <h2 className='mb-5 text-4xl font-medium text-center md:text-3xl md:text-left'>
          Trang tìm kiếm
        </h2>

        {keyword === null && (
          <div>
            <h4 className='mb-3 text-xl text-center md:text-2xl text-primaryColor md:text-left'>
              Nhập từ khóa để tìm kiếm sản phẩm
            </h4>
            <form
              className='flex flex-col md:flex-row'
              onSubmit={() => {
                navigate(`/search?q=${inputRef.current.value}`);
              }}
            >
              <div className='w-full md:w-[300px] mr-3'>
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Tìm kiếm'
                  className='block px-5 py-3 w-full h-full border border-borderColor focus:border-[#ccc] rounded-full'
                />
              </div>
              <button
                className='inline-block min-w-[167px] px-3 py-3 mt-5 md:mt-0 text-center text-sm rounded-full bg-[#ebebeb] gradient-primary text-white hover:bg-none hover:bg-primaryColor font-medium'
                type='submit'
              >
                Tìm kiếm
              </button>
            </form>
          </div>
        )}

        {keyword && (
          <Fragment>
            <h3 className='mb-5 text-xl font-medium'>
              Có
              <span className='mx-1 font-bold'>{productList?.length || 0}</span>
              kết quả tìm kiếm phù hợp
            </h3>

            {productList === null ? (
              <div>
                <h4 className='my-5 text-xl'>
                  Không tìm thấy sản phẩm nào phù hợp với từ khóa trên.
                </h4>
                <Link
                  to='/products'
                  className='inline-block min-w-[167px] text-center px-3 py-3 text-sm rounded-full bg-[#ebebeb] gradient-primary text-white hover:bg-none hover:bg-primaryColor font-medium'
                >
                  <span>Tiếp tục mua sắm</span>
                </Link>
              </div>
            ) : (
              <ProductList productList={productList} isLoading={isLoading} />
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Search;
