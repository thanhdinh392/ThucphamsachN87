import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import formatPrice from './../../utils/formatPrice';
import { setCart } from './../../redux/cartSlice';
import cartApi from '../../api/cartApi';
import ProductConfirmModal from '../Modal/ProductConfirmModal';
import ProductDetailModal from '../Modal/ProductDetailModal';

const ProductCard = ({ product }) => {
  const [showProductConfirmModal, setShowProductConfirmModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateCart = async () => {
    let products = [...cart.products];
    const index = products.findIndex((item) => item.product.id === product.id);

    if (index === -1) {
      products.push({
        product,
        quantity: 1,
      });
    } else {
      const newQuantity = products[index].quantity + 1;
      if (newQuantity > product.inventory[0].quantity) {
        if (product.inventory[0].quantity === 0) {
          toast.info('Sản phẩm đã hết hàng. Vui lòng quay lại sau!');
        } else {
          toast.info(
            `Chỉ còn ${product.inventory[0].quantity} sản phẩm còn lại cho sản phẩm này`
          );
        }
        return;
      }
      products[index] = {
        ...products[index],
        quantity: products[index].quantity + 1,
      };
    }

    const productList = products.map((item) => {
      return {
        product: item.product.id,
        quantity: item.quantity,
      };
    });
    try {
      const res = await cartApi.updateCart(productList);
      dispatch(setCart(res.data.cart));
      setShowProductConfirmModal(true);
    } catch (error) {
      toast.error('Thêm sản phẩm vào giỏ hàng không thành công!');
    }
  };

  return (
    <div className='relative overflow-hidden transition-all border rounded hover:shadow-xl border-borderColor group'>
      <Link
        to={`/products/${product.slug}`}
        className='flex items-center justify-center select-none hover:opacity-60'
      >
        <img src={product.images[0]?.url} alt={product.name} />
      </Link>
      <div className='p-6 flex flex-col items-center bg-[#f5f6fb]'>
        <Link
          to={`/products/${product.slug}`}
          className='font-bold hover:text-primaryColor'
        >
          {product.name}
        </Link>
        {product.discount > 0 ? (
          <div className='mt-2'>
            <span className='mr-2 text-base font-bold text-primaryColor'>
              {formatPrice(product.salePrice)}
            </span>
            <span className='text-sm font-bold line-through text-textColor'>
              {formatPrice(product.price)}
            </span>
          </div>
        ) : (
          <div className='mt-2'>
            <span className='text-base font-bold text-primaryColor'>
              {formatPrice(product.salePrice)}
            </span>
          </div>
        )}
      </div>

      <div
        className={`absolute hidden xl:flex gap-1 bottom-[30%] left-[50%] translate-x-[-50%] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all`}
      >
        <div
          className='w-[40px] h-[40px] rounded-full hover:bg-primaryColor hover:text-white text-black bg-white opacity-90 hover:opacity-100 transition-all shadow-md flex items-center justify-center text-sm cursor-pointer'
          onClick={() => {
            if (!currentUser) {
              toast.info('Bạn cần đăng nhập để thêm sản phẩm này vào giỏ hàng');
              navigate('/login');
              return;
            }
            updateCart();
          }}
        >
          <i className='fa-solid fa-cart-shopping'></i>
        </div>
        <div
          className='w-[40px] h-[40px] rounded-full hover:bg-primaryColor hover:text-white text-black bg-white opacity-90 hover:opacity-100 transition-all shadow-md flex items-center justify-center text-sm cursor-pointer'
          onClick={() => setShowProductDetailModal(true)}
        >
          <i className='fa-solid fa-magnifying-glass'></i>
        </div>
      </div>

      <ProductConfirmModal
        product={product}
        showModal={showProductConfirmModal}
        handleCloseModal={() => setShowProductConfirmModal(false)}
        classContainer={`product-confirm-modal-${product.slug}`}
      />

      <ProductDetailModal
        product={product}
        showModal={showProductDetailModal}
        setShowModal={setShowProductDetailModal}
        handleCloseModal={() => setShowProductDetailModal(false)}
        classContainer={`product-detail-modal-${product.slug}`}
        setShowProductConfirmModal={setShowProductConfirmModal}
      />
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
