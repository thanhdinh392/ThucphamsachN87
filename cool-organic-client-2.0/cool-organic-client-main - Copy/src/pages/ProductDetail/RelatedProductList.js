import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ProductList from '../../components/ProductList';
import SectionLayout from '../../components/SectionLayout';
import productApi from '../../api/productApi';

const RelatedProductList = ({ slug, categorySlug }) => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (categorySlug) {
          const response = await productApi.getRelatedProducts({
            params: {
              slug,
              categorySlug,
            },
          });
          setProductList(response.data.products);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchRelatedProducts();
  }, [categorySlug, slug]);

  return (
    <SectionLayout title='Sản phẩm liên quan' path={`/${categorySlug}`}>
      {!isLoading && productList.length === 0 && (
        <div className='mx-auto my-12 text-xl text-center text-textColor'>
          <p>Hiện chưa có sản phẩm liên quan nào</p>
        </div>
      )}
      <ProductList
        productList={productList}
        isLoading={isLoading}
        skeletonItem={4}
      />
    </SectionLayout>
  );
};

RelatedProductList.propTypes = {
  slug: PropTypes.string.isRequired,
  categorySlug: PropTypes.string,
};

export default RelatedProductList;
