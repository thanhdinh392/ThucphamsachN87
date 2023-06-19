import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import userApi from '../../api/userApi';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const schema = yup.object({
    password: yup
      .string()
      .required('Mật khẩu cũ là bắt buộc')
      .min(8, 'Mật khẩu cũ phải tối thiểu 8 kí tự'),
    newPassword: yup
      .string()
      .required('Mật khẩu mới là bắt buộc')
      .min(8, 'Mật khẩu mới phải tối thiểu 8 kí tự'),
    confirmNewPassword: yup
      .string()
      .oneOf(
        [yup.ref('newPassword'), null],
        'Mật khẩu không trùng khớp. Hãy thử lại'
      )
      .required('Xác nhận lại mật khẩu không được để trống'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleChangPassword = async (data) => {
    try {
      const res = await userApi.changePassword(data);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.success(
          res.data.message || 'Đổi mật khẩu thất bại! Vui lòng thử lại'
        );
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }

    reset();
  };

  return (
    <div>
      <h3 className='mb-5 text-xl font-medium uppercase'>Đổi mật khẩu</h3>
      <span className='block mb-10'>
        Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 8 kí tự
      </span>
      <form onSubmit={handleSubmit(handleChangPassword)}>
        <div className='mb-5'>
          <label className='block mb-2.5'>Mật khẩu cũ *</label>
          <input
            type='password'
            className='px-6 py-3 rounded-full w-full md:w-[408px] border-borderColor border focus:outline-none focus:border-primaryColor'
            {...register('password')}
            autoComplete='password'
          />
          <span className='block mt-1 ml-3 text-left text-red-500'>
            {errors.password?.message}
          </span>
        </div>
        <div className='mb-5'>
          <label className='block mb-2.5'>Mật khẩu mới *</label>
          <input
            type='password'
            className='px-6 py-3 rounded-full w-full md:w-[408px] border-borderColor border focus:outline-none focus:border-primaryColor'
            {...register('newPassword')}
            autoComplete='newPassword'
          />
          <span className='block mt-1 ml-3 text-left text-red-500'>
            {errors.newPassword?.message}
          </span>
        </div>
        <div className='mb-8'>
          <label className='block mb-2.5'>Xác nhận lại mật khẩu *</label>
          <input
            type='password'
            className='px-6 py-3 rounded-full w-full md:w-[408px] border-borderColor border focus:outline-none focus:border-primaryColor'
            {...register('confirmNewPassword')}
            autoComplete='confirmNewPassword'
          />
          <span className='block mt-1 ml-3 text-left text-red-500'>
            {errors.confirmNewPassword?.message}
          </span>
        </div>
        <button
          type='submit'
          className='inline-block px-4 py-3 text-base text-center text-white border rounded-full gradient-primary hover:bg-primaryColor hover:bg-none border-borderColor'
        >
          Đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
