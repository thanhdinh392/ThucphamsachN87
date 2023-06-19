import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Select from 'react-select';

import Loading from './../../../components/Loading/Loading';
import userApi from './../../../api/userApi';
import cartApi from './../../../api/cartApi';

const AddUser = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    {
      value: 'admin',
      label: 'Người quản trị',
    },
    {
      value: 'user',
      label: 'Người dùng',
    },
  ];

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
      .required('Vui lòng xác nhận mật khẩu')
      .oneOf([yup.ref('password'), null], 'Mật khẩu không trùng khớp'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    control,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleCreateUser = async (values) => {
    if (!values || !selectedRole) return;
    setIsLoading(true);
    const userInfo = {
      ...values,
      role: selectedRole.value,
    };

    try {
      const res = await userApi.createUser(userInfo);
      await cartApi.createCart(res.data.user._id);
      toast.success('Tạo người dùng thành công!');
    } catch (error) {
      toast.error(
        error.response.data.message ||
          'Có lỗi xảy ra phía Server, Vui lòng thử lại sau!'
      );
    }

    setIsLoading(false);
    reset();
    setSelectedRole('Chọn quyền hạn của người dùng');
  };
  return (
    <div>
      <h2 className='pt-8 pb-5 text-2xl font-semibold'>Tạo người dùng mới</h2>
      <form
        onSubmit={handleSubmit(handleCreateUser)}
        className='w-full max-w-[450px] text-center mt-10'
      >
        <div className='flex flex-col gap-[18px]'>
          <div>
            <input
              type='text'
              name='fullName'
              className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
              placeholder='Họ tên'
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
              className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
              placeholder='Email'
              {...register('email')}
              autoComplete='username'
            />
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {errors.email?.message}
            </span>
          </div>
          <div>
            <input
              type='password'
              name='password'
              className='bg-white block w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
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
                  <span className='font-bold text-red-500'>*</span> Sử dụng từ 8
                  kí tự trở lên
                </span>
              )}
            </span>
          </div>
          <div>
            <input
              type='password'
              name='confirmPassword'
              className='bg-white block w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
              placeholder='Nhập lại mật khẩu'
              {...register('confirmPassword')}
              autoComplete='confirmPassword'
            />
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {errors.confirmPassword?.message}
            </span>
          </div>
          <div>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isSearchable={false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: '50px',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      boxShadow: 'none',
                      fontSize: '1rem',
                      border: state.isFocused
                        ? '2px solid #91ad41'
                        : '2px solid #ebebeb',

                      ':hover': {
                        borderColor: '#91ad41',
                      },
                      ':active': {
                        borderColor: '#91ad41',
                      },
                      ':focus': {
                        borderColor: '#91ad41',
                      },
                    }),
                    option: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '12px 0px',
                      borderRadius: '0.75rem',
                      border: '2px solid #ebebeb',
                      fontSize: '1rem',
                      backgroundColor: state.isSelected ? '#91ad41' : '#fff',
                      color: state.isSelected ? '#fff' : '#000',
                      ':active': {
                        backgroundColor: '#91ad41',
                        color: '#fff',
                      },
                    }),
                    input: (baseStyles) => ({
                      ...baseStyles,
                      padding: '4px 0px',
                      pointerEvents: 'none',
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      padding: '4px 0px',
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      padding: '0px',
                      height: '100%',
                      backgroundColor: '#fff',
                      boxShadow: 'none',
                      border: 'none',
                    }),
                  }}
                  options={roleOptions}
                  onChange={setSelectedRole}
                  value={selectedRole}
                  placeholder='Chọn quyền hạn của người dùng'
                  defaultValue={selectedRole}
                />
              )}
            />
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {isSubmitted &&
                !selectedRole &&
                'Vui lòng chọn quyền hạn của người dùng'}
            </span>
          </div>
        </div>
        <button
          type='submit'
          className='flex items-center justify-center gap-3 px-10 py-4 mt-5 text-lg font-semibold text-white transition-opacity bg-primaryColor rounded-xl hover:opacity-80'
        >
          {isLoading && <Loading />} <span>Tạo người dùng</span>
        </button>
      </form>
    </div>
  );
};

export default AddUser;
