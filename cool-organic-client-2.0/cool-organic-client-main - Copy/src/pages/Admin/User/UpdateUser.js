import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

import Loading from './../../../components/Loading/Loading';
import { LoadingCenter } from '../../../components/Loading';
import userApi from './../../../api/userApi';

const UpdateUser = () => {
  const [user, setUser] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true);
      try {
        const res = await userApi.getUserById(id);
        const user = res.data.user;
        setUser(user);
        setSelectedRole({
          value: user.role,
          label: user.role === 'admin' ? 'Người quản trị' : 'Người dùng',
        });
      } catch (error) {
        toast.error('Lấy thông tin người dùng thất bại, Vui lòng thử lại sau!');
        navigate('/admin/users');
      }
      setIsLoadingUser(false);
    };

    getUser();
  }, [id, navigate]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoadingUpdateUser(true);
    const role = selectedRole.value;

    try {
      await userApi.updateRole(id, role);
      toast.success('Cập nhật thông tin người dùng thành công!');
    } catch (error) {
      toast.error(
        error.response.data.message ||
          'Có lỗi xảy ra phía Server, Vui lòng thử lại sau!'
      );
    }

    setIsLoadingUpdateUser(false);
    navigate('/admin/users');
  };

  return (
    <div>
      <h2 className='pt-8 pb-5 text-2xl font-semibold capitalize'>
        Thay đổi thông tin người dùng
      </h2>

      <form
        onSubmit={handleUpdateUser}
        className='w-full max-w-[450px] text-center mt-10'
      >
        {isLoadingUser ? (
          <div className='flex items-center justify-center h-52'>
            <LoadingCenter />
          </div>
        ) : (
          <Fragment>
            <div className='flex flex-col gap-[18px]'>
              <div>
                <input
                  type='text'
                  name='fullName'
                  className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl'
                  placeholder='Họ tên'
                  autoComplete='fullName'
                  disabled
                  value={user.fullName || ''}
                />
              </div>
              <div>
                <input
                  type='text'
                  name='email'
                  className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl'
                  placeholder='Email'
                  autoComplete='username'
                  disabled
                  value={user.email || ''}
                />
              </div>
              <div>
                <Select
                  name='role'
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
              </div>
            </div>
            <button
              type='submit'
              className='flex items-center justify-center gap-3 px-10 py-4 mt-5 text-lg font-semibold text-white transition-opacity bg-primaryColor rounded-xl hover:opacity-80'
            >
              {isLoadingUpdateUser && <Loading />}
              <span>Chỉnh sửa thông tin người dùng</span>
            </button>
          </Fragment>
        )}
      </form>
    </div>
  );
};

export default UpdateUser;
