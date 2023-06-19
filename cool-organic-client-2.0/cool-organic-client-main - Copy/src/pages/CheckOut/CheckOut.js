import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';

import LoadingCenter from './../../components/Loading/LoadingCenter';
import formatPrice from '../../utils/formatPrice';
import orderApi from './../../api/orderApi';

const CheckOut = () => {
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Vui lòng nhập đúng email'),
    fullName: yup.string().required('Họ và tên là bắt buộc'),
    phone: yup.string().required('Số điện thoại là bắt buộc'),
    shippingMethod: yup.string().required('Phương thức vận chuyển là bắt buộc'),
    paymentMethod: yup.string().required('Phương thức thanh toán là bắt buộc'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      fullName: '',
      phone: '',
      city: {},
      district: {},
      ward: {},
      comment: '',
      shippingMethod: '',
      paymentMethod: '',
    },
    resolver: yupResolver(schema),
  });

  const handleOrderProducts = async (data) => {
    const orderInfo = {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      city: selectedCity.label,
      district: selectedDistrict.label,
      ward: selectedWard.label,
      comment: data.comment || 'Không có ghi chú nào cho đơn hàng!',
      shippingMethod: data.shippingMethod,
      shippingFee: 40000,
      paymentMethod: data.paymentMethod,
      totalPrice: cart.totalPrice + 40000,
      cart: cart.products,
    };

    try {
      const res = await orderApi.createOrder(orderInfo);
      const order = res.data.order;

      navigate(`/checkout/thank-you/${order.id}`);
    } catch (error) {
      if (error.response.status === 500 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đặt hàng thất bại. Vui lòng thử lại sau!');
      }
    }

    reset();
  };

  useEffect(() => {
    if (!cart.isLoading && cart.products.length === 0) {
      toast.info(
        'Hiện không có sản phẩm nào trong giỏ hàng để có thể thanh toán!'
      );
      navigate('/cart');
    }
  }, [cart.isLoading, cart.products.length, navigate]);

  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await axios.get(
          'https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1'
        );

        const cities = res.data.data.data;

        const cityOptions = cities.map((city) => ({
          value: city.code,
          label: city.name,
        }));

        setCityOptions(cityOptions);
      } catch (error) {
        if (error.response.data.exitcode === 905) {
          toast.error(
            'Bạn lựa chọn quá thường xuyên. Vui lòng thử lại sau vài giây!'
          );
        }
      }
    };
    getCities();
  }, []);

  const getDistricts = async (city) => {
    try {
      const res = await axios.get(
        `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${city.value}&limit=-1`
      );

      const districts = res.data.data.data;

      const districtOptions = districts.map((district) => ({
        value: district.code,
        label: district.name_with_type,
      }));

      setDistrictOptions(districtOptions);
    } catch (error) {
      if (error.response.data.exitcode === 905) {
        toast.error(
          'Bạn lựa chọn quá thường xuyên. Vui lòng thử lại sau vài giây!'
        );
      }
    }
  };

  const getWards = async (district) => {
    try {
      const res = await axios.get(
        `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${district.value}&limit=-1`
      );

      const wards = res.data.data.data;

      const wardOptions = wards.map((ward) => ({
        value: ward.code,
        label: ward.name_with_type,
      }));

      setWardOptions(wardOptions);
    } catch (error) {
      if (error.response.data.exitcode === 905) {
        toast.error(
          'Bạn lựa chọn quá thường xuyên. Vui lòng thử lại sau vài giây!'
        );
      }
    }
  };

  return (
    <Fragment>
      <div className='container flex flex-col justify-between gap-6 lg:gap-16 lg:flex-row -mb-14'>
        <div className='w-full lg:w-[30%] order-2 lg:order-1'>
          <h2 className='mb-4 text-xl font-bold'>Thông tin nhận hàng</h2>
          <form>
            <div className='mb-3.5'>
              <input
                type='text'
                placeholder='Email'
                className='border-2 rounded-md px-3 py-2.5 w-full border-borderColor focus:border-[#2684ff]'
                {...register('email')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.email?.message}
              </span>
            </div>
            <div className='mb-3.5'>
              <input
                type='text'
                placeholder='Họ và tên'
                className='border-2 rounded-md px-3 py-2.5 w-full border-borderColor focus:border-[#2684ff]'
                {...register('fullName')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.fullName?.message}
              </span>
            </div>
            <div className='mb-3.5'>
              <input
                type='text'
                placeholder='Số điện thoại'
                className='border-2 rounded-md px-3 py-2.5 w-full border-borderColor focus:border-[#2684ff]'
                {...register('phone')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.phone?.message}
              </span>
            </div>
            <div className='mb-3.5'>
              <Select
                name='city'
                options={cityOptions}
                onChange={(value) => {
                  if (value !== selectedCity) {
                    setSelectedCity(value);
                    setSelectedDistrict('');
                    setSelectedWard('');
                    setDistrictOptions([]);
                    setWardOptions([]);
                    getDistricts(value);
                  }
                }}
                value={selectedCity}
                placeholder='Chọn Tỉnh Thành'
                maxMenuHeight={200}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {isSubmitted && !selectedCity && 'Vui lòng chọn Tỉnh thành'}
              </span>
            </div>
            <div className='mb-3.5'>
              <Select
                name='district'
                options={districtOptions}
                onChange={(value) => {
                  if (value !== selectedDistrict) {
                    setSelectedDistrict(value);
                    setSelectedWard('');
                    setWardOptions([]);
                    getWards(value);
                  }
                }}
                value={selectedDistrict}
                placeholder='Chọn Quận Huyện'
                defaultValue={selectedDistrict}
                maxMenuHeight={200}
              />

              <span className='block mt-1 ml-3 text-left text-red-500'>
                {isSubmitted && !selectedDistrict && 'Vui lòng chọn Quận huyện'}
              </span>
            </div>
            <div className='mb-3.5'>
              <Select
                name='ward'
                options={wardOptions}
                onChange={setSelectedWard}
                value={selectedWard}
                placeholder='Chọn Phường Xã'
                defaultValue={selectedWard}
                maxMenuHeight={200}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {isSubmitted && !selectedWard && 'Vui lòng chọn Phường xã'}
              </span>
            </div>
            <div className='mb-3.5'>
              <textarea
                cols='30'
                rows='5'
                placeholder='Ghi chú (tùy chọn)'
                className='border-2 rounded-md px-3 py-2.5 w-full border-borderColor focus:border-[#2684ff]'
                {...register('comment')}
              />
            </div>
          </form>
        </div>
        <div className='w-full lg:w-[30%] order-3 lg:order-2'>
          <h2 className='mb-3.5 text-xl font-bold'>Vận chuyển</h2>
          <div className='flex items-center justify-between px-3.5 py-4 border rounded-lg border-borderColor'>
            <div className='flex gap-2.5'>
              <input
                type='radio'
                className='w-[18px] h-[18px]'
                {...register('shippingMethod')}
                value='0'
              />
              <span>Giao hàng tận nơi</span>
            </div>
            <span>{formatPrice(40000)}</span>
          </div>
          <span className='block mt-1.5 mb-4 ml-3 text-left text-red-500'>
            {errors.shippingMethod?.message}
          </span>
          <h2 className='mb-3.5 text-xl font-bold'>Thanh toán</h2>
          <div className='flex items-center justify-between px-3.5 py-4 border rounded-lg border-borderColor mb-5'>
            <div className='flex gap-2.5'>
              <input
                type='radio'
                className='w-[18px] h-[18px]'
                {...register('paymentMethod')}
                value='0'
              />
              <span>Thanh toán khi giao hàng (COD)</span>
            </div>
            <span className='text-lg text-primaryColor'>
              <i className='fa-solid fa-money-bill'></i>
            </span>
          </div>
          <div className='flex items-center justify-between px-3.5 py-4 border rounded-lg border-borderColor'>
            <div className='flex gap-2.5'>
              <input
                type='radio'
                className='w-[18px] h-[18px]'
                {...register('paymentMethod')}
                value='1'
              />
              <span>Thanh toán qua thẻ ATM nội địa</span>
            </div>
            <span className='text-lg text-primaryColor'>
              <i className='fa-solid fa-money-check'></i>
            </span>
          </div>
          <span className='block mt-1.5 mb-4 ml-3 text-left text-red-500'>
            {errors.paymentMethod?.message}
          </span>
          <div className='flex flex-col items-center justify-center pb-6 lg:hidden'>
            <button
              className='uppercase block w-full md:w-[75%] font-semibold text-center px-3 py-3 mb-4 text-sm text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
              onClick={handleSubmit(handleOrderProducts)}
            >
              Đặt Hàng
            </button>
            <Link to='/cart' className='flex items-center gap-2 group'>
              <span className='group-hover:translate-x-[-4px] transition-transform duration-[250] text-primaryColor'>
                <i className='fa-sharp fa-solid fa-chevron-left'></i>
              </span>
              <span className='font-medium transition-colors duration-[250] text-primaryColor'>
                Quay về giỏ hàng
              </span>
            </Link>
          </div>
        </div>

        {cart.isLoading ? (
          <div className='flex items-center justify-center h-full w-full lg:w-[40%] order-1 lg:order-3'>
            <LoadingCenter />
          </div>
        ) : (
          <div className='bg-[#FAFAFA] border border-borderColor h-full lg:pb-8 rounded w-full lg:w-[40%] order-1 lg:order-3'>
            <h2 className='px-3 py-3.5 text-xl font-bold border-b border-borderColor'>
              Đơn hàng {`( ${cart.products.length} sản phẩm)`}
            </h2>
            <ul className='max-h-[300px] lg:max-h-[485px] overflow-y-scroll pt-6'>
              {cart.products.map((item) => {
                const product = item.product;
                return (
                  <li
                    key={product.id}
                    className='flex items-center justify-between gap-8 px-3 mb-5'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-[50px] h-[50px] border border-borderColor rounded-lg relative select-none'>
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className='rounded-lg'
                        />
                        <span className='px-1.5 min-w-[20px] h-[20px] select-none text-sm absolute rounded-full bg-primaryColor text-white font-medium top-0 right-0 translate-x-[50%] translate-y-[-50%] inline-flex items-center justify-center'>
                          {item.quantity}
                        </span>
                      </div>
                      <span className='text-base font-medium'>
                        {product.name}
                      </span>
                    </div>

                    <span className='text-base font-medium'>
                      {formatPrice(product.salePrice * item.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className='px-3 pb-3 pt-7 border-y border-borderColor'>
              <div className='flex justify-between items-center mb-1.5'>
                <span>Tạm tính</span>
                <span className='text-lg font-medium'>
                  {formatPrice(cart.totalPrice)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span>Phí vận chuyển</span>
                <span className='text-lg font-medium'>
                  {formatPrice(40000)}
                </span>
              </div>
            </div>
            <div className='flex justify-between px-3 py-3.5'>
              <span className='text-lg font-medium'>Tổng cộng</span>
              <span className='text-2xl font-bold text-primaryColor'>
                {formatPrice(cart.totalPrice + 40000)}
              </span>
            </div>
            <div className='items-center justify-between hidden px-3 lg:flex'>
              <Link to='/cart' className='flex items-center gap-2 group'>
                <span className='group-hover:translate-x-[-4px] transition-transform duration-[250] text-primaryColor'>
                  <i className='fa-sharp fa-solid fa-chevron-left'></i>
                </span>
                <span className='text-sm font-medium transition-colors duration-[250] hover:text-primaryColor'>
                  Quay về giỏ hàng
                </span>
              </Link>
              <button
                className='inline-block font-semibold min-w-[160px] text-center px-3 py-3 text-sm text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                onClick={handleSubmit(handleOrderProducts)}
              >
                <span>Đặt hàng ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckOut;
