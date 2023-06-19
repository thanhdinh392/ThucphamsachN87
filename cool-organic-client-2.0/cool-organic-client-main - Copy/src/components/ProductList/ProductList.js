import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './../ProductCard';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';

const ProductList = ({
  productList,
  className = '',
  isLoading,
  skeletonItem = 8,
}) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {productList.length > 0 &&
        !isLoading &&
        productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

      {isLoading &&
        Array(skeletonItem)
          .fill(0)
          .map((_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
};

ProductList.propTypes = {
  productList: PropTypes.array.isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  skeletonItem: PropTypes.number,
};

export default ProductList;
