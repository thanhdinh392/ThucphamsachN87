import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import NotFound from '../NotFound/NotFound';
import BreadCrumb from '../../components/BreadCrumb';
import ProductDetailContent from '../../components/ProductDetailContent';
import RelatedProductList from './RelatedProductList';
import productApi from './../../api/productApi';

import { backgroundProductDetail } from '../../assets/images/common';
import ProductConfirmModal from '../../components/Modal/ProductConfirmModal';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [categorySlug, setCategorySlug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductConfirmModal, setShowProductConfirmModal] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await productApi.getProductBySlug(slug);
        setProduct(response.data.product);
        setCategorySlug(response.data.product.categorySlug);
      } catch (error) {
        if (error.response.status === 404) {
          setProduct(null);
        }
      }
      setIsLoading(false);
    };
    fetchProductDetail();
  }, [slug]);

  return (
    <Fragment>
      {product === null && <NotFound />}
      {product && (
        <Fragment>
          <BreadCrumb isLoading={isLoading}>{product.name}</BreadCrumb>
          <div className='container'>
            <ProductDetailContent
              product={product}
              setShowProductConfirmModal={setShowProductConfirmModal}
              isLoading={isLoading}
              className='gap-6 lg:gap-0'
            />
          </div>
          <div
            style={{
              backgroundImage: `url(${backgroundProductDetail})`,
              backgroundSize: 'cover',
              backgroundPosition: '46% center',
              backgroundRepeat: 'no-repeat',
            }}
            className='h-[200px] mt-8 w-full md:container'
          ></div>
          <RelatedProductList slug={slug} categorySlug={categorySlug} />

          {!isLoading && (
            <ProductConfirmModal
              product={product}
              showModal={showProductConfirmModal}
              handleCloseModal={() => setShowProductConfirmModal(false)}
              classContainer={product.slug}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetail;
