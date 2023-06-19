import React, { useState, useEffect } from 'react';

import SectionLayout from '../../components/SectionLayout';
import ProductList from '../../components/ProductList';
import NoProductInCategory from '../../components/NoProductInCategory';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import breakPoints from '../../utils/breakPoints';

const CategoryProductList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [categorySlug, setCategorySlug] = useState('rau-cu');
  const [productList, setProductList] = useState([]);
  const [categoryName, setCategoryName] = useState('Rau củ');
  const [showMenuCategory, setShowMenuCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await categoryApi.getCategories({
          params: {
            limit: 5,
          },
        });
        setCategoryList(response.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);

  let perPage = 8;
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (breakPoints.isMobile()) {
        perPage = 4;
      }
      try {
        const response = await productApi.getProductsByCategory(categorySlug, {
          params: {
            page: 1,
            limit: perPage,
          },
        });
        setProductList(response.data.products);
      } catch (error) {
        if (error.response.status === 404) {
          setProductList(null);
        }
      }
      setIsLoading(false);
    };
    fetchProductsByCategory();
  }, [categorySlug]);

  return (
    <SectionLayout
      className='category-product-list'
      title='Danh mục sản phẩm'
      path='/products'
    >
      <div className='items-center justify-center hidden mt-4 mb-10 md:flex'>
        {categoryList.map((item) => (
          <button
            key={item.id}
            className={`${
              item.categorySlug === categorySlug
                ? 'bg-primaryColor text-white'
                : ''
            } border border-borderColor rounded-full py-3 px-5 mr-4 hover:bg-primaryColor hover:text-white transition-all text-sm`}
            onClick={() => setCategorySlug(item.categorySlug)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className='block md:hidden'>
        <div
          className='flex items-center justify-between px-3 py-2 border-2 rounded-full border-primaryColor'
          onClick={() => setShowMenuCategory((prev) => !prev)}
        >
          <span>{categoryName}</span>
          <span>
            <i className='fa-sharp fa-solid fa-caret-down'></i>
          </span>
        </div>
        <div
          className={`mt-3 mb-5 transition-all duration-300 overflow-hidden ${
            showMenuCategory ? 'max-h-[1000px]' : 'max-h-[0px]'
          }`}
        >
          {categoryList.map((item) => (
            <button
              key={item.id}
              className={`w-full py-2 mb-2 text-sm border rounded-full border-borderColor ${
                item.categorySlug === categorySlug
                  ? 'bg-primaryColor text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => {
                setCategorySlug(item.categorySlug);
                setCategoryName(item.name);
                setShowMenuCategory(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {productList === null ? (
        <NoProductInCategory />
      ) : (
        <ProductList
          productList={productList}
          isLoading={isLoading}
          skeletonItem={perPage}
        />
      )}
    </SectionLayout>
  );
};

export default CategoryProductList;
