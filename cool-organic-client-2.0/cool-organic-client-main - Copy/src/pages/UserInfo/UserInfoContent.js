import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import userApi from '../../api/userApi';
import formatDate from '../../utils/formatDate';
import { setCurrentUser } from '../../redux/userSlice';

const UserInfoContent = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const inputFullNameRef = useRef();
  const [showFullNameInput, setShowFullNameInput] = useState(false);

  const inputPhoneRef = useRef();
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const inputAddressRef = useRef();
  const [showAddressInput, setShowAddressInput] = useState(false);

  const handleChangeFullName = async (fullName) => {
    try {
      const res = await userApi.updateUser({ fullName });
      const user = res.data.user;
      const newUserInfo = {
        ...currentUser,
        fullName: user.fullName,
      };
      dispatch(setCurrentUser(newUserInfo));

      toast.success('Cập nhật Họ tên thành công');
    } catch (error) {
      toast.error('Cập nhật Họ tên thất bại, Vui lòng thử lại sau!');
    }
  };

  const handleChangePhone = async (phone) => {
    try {
      const res = await userApi.updateUser({ phone });
      const user = res.data.user;
      const newUserInfo = {
        ...currentUser,
        phone: user.phone,
      };
      dispatch(setCurrentUser(newUserInfo));

      toast.success('Cập nhật Số điện thoại thành công');
    } catch (error) {
      toast.error('Cập nhật Số điện thoại thất bại, Vui lòng thử lại sau!');
    }
  };

  const handleChangeAddress = async (address) => {
    try {
      const res = await userApi.updateUser({ address });
      const user = res.data.user;
      const newUserInfo = {
        ...currentUser,
        address: user.address,
      };
      dispatch(setCurrentUser(newUserInfo));

      toast.success('Cập nhật Địa chỉ thành công');
    } catch (error) {
      toast.error('Cập nhật Địa chỉ thất bại, Vui lòng thử lại sau!');
    }
  };

  return (
    <div>
      <h3 className='mb-5 text-xl font-medium uppercase'>
        Thông tin tài khoản
      </h3>
      <div className='mb-4'>
        <span className='font-bold'>Họ tên: </span>
        <span>{currentUser.fullName}</span>
        <button
          className={`ml-3 text-sm hover:opacity-[0.65] transition-opacity ${
            showFullNameInput && 'hidden'
          }`}
          onClick={() => setShowFullNameInput(true)}
        >
          <i className='fas fa-pen'></i>
        </button>
        <form
          className={`ml-3 ${showFullNameInput ? 'inline-block' : 'hidden'}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (inputFullNameRef.current.value.trim() === '') {
              toast.info('Vui lòng nhập họ tên!');
              return;
            }
            handleChangeFullName(inputFullNameRef.current.value);
            inputFullNameRef.current.value = '';
            setShowFullNameInput(false);
          }}
        >
          <input
            type='text'
            className='w-[250px] px-3.5 py-2 rounded-full border-2 border-primaryColor'
            ref={inputFullNameRef}
          />
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-3'
            type='submit'
          >
            <i className='fas fa-check'></i>
          </button>
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-2.5'
            type='button'
            onClick={() => {
              inputFullNameRef.current.value = '';
              setShowFullNameInput(false);
            }}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        </form>
      </div>
      <div className='mb-4'>
        <span className='font-bold'>Email: </span>
        <span>{currentUser.email}</span>
      </div>
      <div className='mb-4'>
        <span className='font-bold'>Số điện thoại: </span>
        <span>{currentUser.phone}</span>
        <button
          className={`ml-3 text-sm hover:opacity-[0.65] transition-opacity ${
            showPhoneInput && 'hidden'
          }`}
          onClick={() => setShowPhoneInput(true)}
        >
          <i className='fas fa-pen'></i>
        </button>
        <form
          className={`ml-3 ${showPhoneInput ? 'inline-block' : 'hidden'}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (inputPhoneRef.current.value.trim() === '') {
              toast.info('Vui lòng nhập họ tên!');
              return;
            }
            handleChangePhone(inputPhoneRef.current.value);
            inputPhoneRef.current.value = '';
            setShowPhoneInput(false);
          }}
        >
          <input
            type='text'
            className='w-[250px] px-3.5 py-2 rounded-full border-2 border-primaryColor'
            ref={inputPhoneRef}
          />
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-3'
            type='submit'
          >
            <i className='fas fa-check'></i>
          </button>
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-2.5'
            type='button'
            onClick={() => {
              inputPhoneRef.current.value = '';
              setShowPhoneInput(false);
            }}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        </form>
      </div>
      <div className='mb-4'>
        <span className='font-bold'>Địa chỉ: </span>
        <span>{currentUser.address}</span>
        <button
          className={`ml-3 text-sm hover:opacity-[0.65] transition-opacity ${
            showAddressInput && 'hidden'
          }`}
          onClick={() => setShowAddressInput(true)}
        >
          <i className='fas fa-pen'></i>
        </button>
        <form
          className={`ml-3 ${showAddressInput ? 'inline-block' : 'hidden'}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (inputAddressRef.current.value.trim() === '') {
              toast.info('Vui lòng nhập họ tên!');
              return;
            }
            handleChangeAddress(inputAddressRef.current.value);
            inputAddressRef.current.value = '';
            setShowAddressInput(false);
          }}
        >
          <input
            type='text'
            className='w-[250px] px-3.5 py-2 rounded-full border-2 border-primaryColor'
            ref={inputAddressRef}
          />
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-3'
            type='submit'
          >
            <i className='fas fa-check'></i>
          </button>
          <button
            className='text-xl p-1 hover:opacity-[0.65] transition-opacity ml-2.5'
            type='button'
            onClick={() => {
              inputAddressRef.current.value = '';
              setShowAddressInput(false);
            }}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        </form>
      </div>
      <div>
        <span className='font-bold'>Ngày tạo tài khoản: </span>
        <span>{formatDate(currentUser.createdAt)}</span>
      </div>
    </div>
  );
};

export default UserInfoContent;
