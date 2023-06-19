import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import BreadCrumb from '../../components/BreadCrumb';
import { logo } from '../../assets/images/common';

const Contact = () => {
  const schema = yup.object({
    fullName: yup.string().required('Họ và tên là bắt buộc'),
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Vui lòng nhập đúng email'),
    content: yup.string().required('Phần nội dung là bắt buộc'),
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
      content: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitFormContact = (data) => {
    reset();
  };

  return (
    <div>
      <BreadCrumb />
      <div className='container flex flex-wrap gap-8 lg:flex-nowrap'>
        <div className='w-[100%] lg:w-[30%]'>
          <div>
            <Link to='/' className='w-[195px] h-[63px] mb-6 block'>
              <img src={logo} alt='Logo' />
            </Link>
            <div className='flex items-center'>
              <div className='w-[30px] flex-shrink-0 flex items-center justify-center mr-1'>
                <i className='fas fa-map-marker-alt text-primaryColor'></i>
              </div>
              <p className='text-left'>
                Toà nhà Ladeco, 266 Đội Cấn, phường Liễu Giai, Quận Ba Đình, Hà
                Nội
              </p>
            </div>
            <div className='flex items-center mt-4'>
              <div className='w-[30px] flex-shrink-0 flex items-center justify-center mr-1'>
                <i className='fa-solid fa-mobile-screen-button text-primaryColor'></i>
              </div>
              <p>1900 1560</p>
            </div>
            <div className='flex items-center mt-4'>
              <div className='w-[30px] flex-shrink-0 flex items-center justify-center mr-1'>
                <i className='fa-solid fa-envelope text-primaryColor'></i>
              </div>
              <p>support@contact.com</p>
            </div>
          </div>
          <hr className='my-8' />
          <div>
            <h3 className='mb-3 text-lg font-bold'>Liên hệ với chúng tôi</h3>
            <form onSubmit={handleSubmit(handleSubmitFormContact)}>
              <div className='mb-4'>
                <input
                  placeholder='Họ và tên'
                  name='name'
                  type='text'
                  className='w-full px-3 py-2 border rounded-full border-borderColor focus:border-primaryColor'
                  spellCheck='false'
                  {...register('fullName')}
                />
                <span className='block mt-1 ml-3 text-left text-red-500'>
                  {errors.fullName?.message}
                </span>
              </div>

              <div className='mb-4'>
                <input
                  placeholder='Email'
                  name='email'
                  type='email'
                  className='w-full px-3 py-2 border rounded-full border-borderColor focus:border-primaryColor'
                  spellCheck='false'
                  {...register('email')}
                />
                <span className='block mt-1 ml-3 text-left text-red-500'>
                  {errors.email?.message}
                </span>
              </div>

              <div className='mb-6'>
                <textarea
                  placeholder='Nội dung'
                  name='contact-content'
                  cols='30'
                  rows='8'
                  className='w-full px-3 py-2 border rounded-2xl border-borderColor focus:border-primaryColor'
                  spellCheck='false'
                  {...register('content')}
                />
                <span className='block mt-1 ml-3 text-left text-red-500'>
                  {errors.content?.message}
                </span>
              </div>

              <button
                className='inline-block min-w-[160px] py-2 mb-2 text-base text-center text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                type='submit'
              >
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>
        <div className='w-[100%] lg:w-[70%] h-[500px]'>
          <div className='relative w-full h-full'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.904149296542!2d105.81368901533224!3d21.036520892888284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab128b45bf23%3A0xd1d32b58169417cd!2zMjY2IMSQ4buZaSBD4bqlbiwgTGnhu4V1IEdpYWksIEJhIMSQw6xuaCwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1664122967225!5m2!1svi!2s'
              allowFullScreen={true}
              title='map'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='border-0 w-full lg:max-w-[900px] h-[500px] absolute z-10'
            ></iframe>
            <div className='bg-[#F7EEE2] w-full h-full lg:max-w-[900px] opacity-50 absolute'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
