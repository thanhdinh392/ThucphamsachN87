import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import BreadCrumb from './../../components/BreadCrumb';
import { Loading } from '../../components/Loading';
import useSearchParams from './../../hooks/useSearchParams';
import authApi from './../../api/authApi';
import cartApi from '../../api/cartApi';
import { setCurrentUser } from '../../redux/userSlice';
import handleLocalStorage from '../../utils/handleLocalStorage';
import handleAuthToken from './../../utils/handleAuthToken';

import { facebookBtn, googleBtn } from '../../assets/images/socials';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = useSearchParams();

  const schema = yup.object({
    fullName: yup.string().required('Họ tên là bắt buộc'),
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Vui lòng nhập đúng email'),
    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải tối thiểu 8 kí tự'),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        'Mật khẩu không trùng khớp. Hãy thử lại'
      )
      .required('Nhập lại mật khẩu Không được để trống'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleRegister = async (values) => {
    setIsLoading(true);
    if (!values) return;

    try {
      const res = await authApi.register(values);
      if (!res.data.success) {
        toast.error(res.data.message);
        reset({
          password: '',
          confirmPassword: '',
        });
        return;
      }

      const { user } = res.data;
      const currentUser = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      };
      dispatch(setCurrentUser(currentUser));
      handleLocalStorage.set('accessToken', res.data.accessToken);
      handleAuthToken(res.data.accessToken);

      await cartApi.createCart();

      toast.success(res.data.message);

      if (searchParams.get('redirect')) {
        navigate(searchParams.get('redirect'));
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage =
        error.response.data?.message ||
        'Có lỗi xảy ra phía máy chủ, vui lòng thử lại!';
      toast.error(errorMessage);
      reset({
        password: '',
        confirmPassword: '',
      });
    }
    setIsLoading(false);
  };

  return (
    <Fragment>
      <BreadCrumb isLoading={isLoading} />
      <div className='container'>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className='w-full max-w-[540px] p-4 mx-auto my-10 text-center'
        >
          <div className=''>
            <h3 className='uppercase text-[26px] mb-6'>Đăng ký tài khoản</h3>
            <div className='flex justify-center gap-1 mb-7'>
              <div className='max-w-[129px] w-full hover:opacity-80 cursor-pointer'>
                <img src={facebookBtn} alt='Register with Facebook' />
              </div>
              <div className='max-w-[129px] w-full hover:opacity-80 cursor-pointer'>
                <img src={googleBtn} alt='Register with Google' />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-[18px]'>
            <div>
              <input
                type='text'
                name='fullName'
                className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Họ và tên'
                {...register('fullName')}
                autoComplete='fullName'
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.fullName?.message}
              </span>
            </div>
            <div>
              <input
                type='text'
                name='email'
                className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Email'
                {...register('email')}
                autoComplete='email'
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.email?.message}
              </span>
            </div>
            <div>
              <input
                type='password'
                className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Mật khẩu'
                {...register('password')}
                autoComplete='current-password'
              />
              <span
                className={`block text-left mt-1 ml-3 ${
                  errors.password?.message ? 'text-red-500' : 'text-textColor'
                }`}
              >
                {errors.password?.message || (
                  <span>
                    <span className='font-bold text-red-500'>*</span> Sử dụng từ
                    8 kí tự trở lên
                  </span>
                )}
              </span>
            </div>
            <div>
              <input
                type='password'
                name='confirmPassword'
                className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Nhập lại mật khẩu'
                {...register('confirmPassword')}
                autoComplete='confirmPassword'
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.confirmPassword?.message}
              </span>
            </div>
            <button
              type='submit'
              className='flex items-center justify-center w-full gap-3 py-4 text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
            >
              {isLoading && <Loading />} <span>Đăng ký</span>
            </button>
          </div>

          <div>
            <p className='mt-6 text-textColor'>
              Bạn đã có tài khoản? vui lòng đăng nhập
              <Link to='/login'>
                <span className='ml-1 underline '>tại đây</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Register;
