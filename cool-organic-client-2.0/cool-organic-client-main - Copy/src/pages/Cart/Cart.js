import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import cartApi from '../../api/cartApi';

import BreadCrumb from '../../components/BreadCrumb';
import LoadingCenter from '../../components/Loading/LoadingCenter';

import { removeProductFromCart, setQuantity } from '../../redux/cartSlice';
import formatPrice from './../../utils/formatPrice';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleChangeInputQuantity = async (value, product, item) => {
    if (value === '') {
      dispatch(
        setQuantity({
          id: product.id,
          quantity: 0,
        })
      );
    }

    const quantity = parseInt(value);
    const invalidQuantity = Number.isNaN(quantity) || quantity < 1;
    if (invalidQuantity) {
      return;
    }
    try {
      if (quantity > product.inventory[0].quantity) {
        if (product.inventory[0].quantity === 0) {
          toast.info('Sản phẩm đã hết hàng. Vui lòng quay lại sau!');
          return;
        } else {
          toast.info(
            `Chỉ còn ${product.inventory[0].quantity} sản phẩm còn lại cho sản phẩm này`
          );
        }

        if (item.quantity === product.inventory[0].quantity) {
          return;
        }

        await cartApi.updateQuantity(product.id, product.inventory[0].quantity);
        dispatch(
          setQuantity({
            id: product.id,
            quantity: product.inventory[0].quantity,
          })
        );
        return;
      }

      await cartApi.updateQuantity(product.id, quantity);
      dispatch(
        setQuantity({
          id: product.id,
          quantity,
        })
      );
    } catch (error) {
      toast.error(
        'Cập nhật số lượng sản phẩm không thành công, Vui lòng thử lại!'
      );
    }
  };

  const handleDeleteProductFromCart = async (productId) => {
    try {
      await cartApi.deleteProductInCart(productId);
      dispatch(removeProductFromCart(productId));
    } catch (error) {
      toast.error(
        'Xóa sản phẩm khỏi giỏ hàng không thành công, Vui lòng thử lại!'
      );
    }
  };

  const handleBlurInputQuantity = async (e, product) => {
    if (e.target.value === '') {
      try {
        await cartApi.updateQuantity(product.id, 1);
        dispatch(
          setQuantity({
            id: product.id,
            quantity: 1,
          })
        );
      } catch (error) {
        toast.error('Đã có lỗi xảy ra, Vui lòng thử lại!');
      }
    }
  };
  return (
    <Fragment>
      <BreadCrumb />
      {cart.isLoading ? (
        <div className='flex items-center justify-center h-60'>
          <LoadingCenter />
        </div>
      ) : (
        <div className='md:container'>
          <h2 className='pb-5 text-2xl font-medium text-center md:text-left md:pb-8 lg:pb-10 lg:text-3xl'>
            Giỏ hàng của bạn ({cart.products.length} sản phẩm)
          </h2>
          {cart.products.length === 0 && (
            <div>
              <h3 className='my-8 text-base'>
                Hiện không có sản phẩm nào trong giỏ hàng. Quay lại cửa hàng để
                tiếp tục mua sắm.
              </h3>
              <Link
                to='/products'
                className='inline-block px-3 py-3 text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
              >
                <span>Tiếp tục mua sắm</span>
              </Link>
            </div>
          )}

          {cart.products.length > 0 && (
            <Fragment>
              <div className='mb-5'>
                {cart.products.map((item) => {
                  const { product } = item;
                  return (
                    <div
                      key={product.id}
                      className='pl-1.5 pr-3 md:px-5 md:py-3 lg:px-6 lg:y-4 mb-1 md:mb-2.5 border-b md:border md:rounded-2xl border-borderColor flex gap-3 justify-between'
                    >
                      <div className='flex-1 md:flex-initial md:w-[50%] lg:w-[70%] flex items-center gap-4 md:gap-8'>
                        <Link
                          className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] hover:opacity-80 flex-shrink-0'
                          to={`/products/${product.slug}`}
                        >
                          <img src={product.images[0].url} alt={product.name} />
                        </Link>
                        <div>
                          <Link
                            className='text-base font-semibold leading-5 md:leading-normal hover:text-primaryColor'
                            to={`/products/${product.slug}`}
                          >
                            {product.name}
                          </Link>
                          <h3 className='text-base font-bold md:text-lg text-primaryColor'>
                            {formatPrice(product.salePrice)}
                          </h3>
                        </div>
                      </div>
                      <div className='md:w-[50%] lg:w-[30%] flex flex-col md:flex-row items-center justify-center md:justify-start md:flex-1'>
                        <div className='flex gap-1 md:gap-2 mb-1.5 md:mb-0'>
                          <button
                            className='w-[28px] h-[28px] md:w-[30px] md:h-[30px] text-base border border-borderColor hover:border-[#ccc]'
                            onClick={(e) =>
                              handleChangeInputQuantity(
                                item.quantity - 1,
                                product,
                                item
                              )
                            }
                          >
                            <span className='text-sm'>
                              <i className='fa-solid fa-minus'></i>
                            </span>
                          </button>
                          <input
                            type='text'
                            value={item.quantity === 0 ? '' : item.quantity}
                            onChange={(e) =>
                              handleChangeInputQuantity(
                                e.target.value,
                                product,
                                item
                              )
                            }
                            onBlur={(e) => handleBlurInputQuantity(e, product)}
                            className='h-[28px] w-[50px] md:h-[30px] text-base border border-borderColor hover:border-[#ccc] text-center focus:border-[#ccc]'
                          />
                          <button
                            className='w-[28px] h-[28px] md:w-[30px] md:h-[30px] text-base border border-borderColor hover:border-[#ccc]'
                            onClick={(e) =>
                              handleChangeInputQuantity(
                                item.quantity + 1,
                                product,
                                item
                              )
                            }
                          >
                            <span className='text-sm'>
                              <i className='fa-solid fa-plus'></i>
                            </span>
                          </button>
                        </div>
                        <div className='flex flex-col items-end md:flex-1'>
                          <p className='hidden mb-1 text-base md:block'>
                            Tổng tiền:
                          </p>
                          <h3 className='hidden mb-1 text-base font-bold md:block text-primaryColor'>
                            {formatPrice(product.salePrice * item.quantity)}
                          </h3>
                          <div
                            className='text-[#898989] text-sm cursor-pointer hover:opacity-80 p-1.5'
                            onClick={async () => {
                              await handleDeleteProductFromCart(product.id);
                            }}
                          >
                            <span>
                              <i className='fa-solid fa-trash'></i>
                            </span>
                            <span className='ml-2'>Xóa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='flex flex-col items-end mr-2.5 md:mr-0'>
                <div className='mt-3 mb-8'>
                  <span className='text-[#707070] text-base mr-6'>
                    Thành tiền:
                  </span>
                  <span className='text-[1.375rem] font-bold text-primaryColor'>
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>
                <div className='flex gap-4'>
                  <Link
                    to='/products'
                    className='inline-block min-w-[167px] text-center px-3 py-3 text-sm rounded-full bg-[#ebebeb] hover:bg-primaryColor hover:text-white'
                  >
                    <span>Tiếp tục mua sắm</span>
                  </Link>
                  <Link
                    to='/checkout'
                    className='inline-block min-w-[167px] text-center px-3 py-3 text-sm text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                  >
                    <span>Đặt hàng ngay</span>
                  </Link>
                </div>
              </div>
              <hr className='my-20' />
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
