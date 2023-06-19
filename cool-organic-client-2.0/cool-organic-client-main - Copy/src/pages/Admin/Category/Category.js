import { useState, useEffect, Fragment, useRef } from 'react';
import { toast } from 'react-toastify';

import ChangePerPage from '../components/ChangePerPage';
import { LoadingCenter } from '../../../components/Loading';
import Portal from '../../../components/Modal/Portal';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import categoryApi from '../../../api/categoryApi';

const Category = () => {
  const [categories, setCategories] = useState(null);
  const [categoriesQuantity, setCategoriesQuantity] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState({
    value: 10,
    label: '10',
  });
  const [totalPages, setTotalPages] = useState(1);

  const [showModalAddCategory, setShowModalAddCategory] = useState(false);
  const [showModalUpdateCategory, setShowModalUpdateCategory] = useState(false);
  const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);

  const [categoryNameError, setCategoryNameError] = useState('');
  const inputAddCategoryRef = useRef(null);
  const inputUpdateCategoryRef = useRef(null);

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      try {
        const res = await categoryApi.getCategories({
          params: {
            page: currentPage,
            limit: limit.value,
          },
        });
        const result = [];
        for (const category of res.data.categories) {
          const res = await categoryApi.getQuantityProductsOfCategory(
            category.categorySlug
          );
          const quantity = res.data.quantity;
          result.push(quantity);
        }

        setCategories(res.data.categories);
        setCategoriesQuantity(result);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    getCategories();
  }, [currentPage, limit]);

  const handleAddCategory = async () => {
    const categoryName = inputAddCategoryRef.current.value;
    if (categoryName === '') {
      setCategoryNameError('Vui lòng nhập tên danh mục!');
      return;
    }

    try {
      const res = await categoryApi.createCategory(categoryName);
      const newCategories = [res.data.category, ...categories];
      const newCategoriesQuantity = [0, ...categoriesQuantity];
      setCategories(newCategories);
      setCategoriesQuantity(newCategoriesQuantity);
      toast.success('Thêm danh mục thành công!');
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message ||
          'Thêm danh mục thất bại, Vui lòng thử lại sau!'
      );
    }

    setShowModalAddCategory(false);
  };

  const handleUpdateCategory = async () => {
    const categoryName = inputUpdateCategoryRef.current.value;
    if (categoryName === '') {
      setCategoryNameError('Vui lòng nhập tên danh mục!');
      return;
    }

    try {
      const res = await categoryApi.updateCategory(
        currentCategory.categorySlug,
        categoryName
      );
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].categorySlug === currentCategory.categorySlug) {
          const newCategories = [...categories];
          newCategories[i] = res.data.category;
          setCategories(newCategories);
          toast.success('Cập nhật danh mục thành công!');
          break;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message ||
          'Cập nhật danh mục thất bại, Vui lòng thử lại sau!'
      );
    }

    setShowModalUpdateCategory(false);
  };

  const handleDeleteCategory = async () => {
    try {
      await categoryApi.deleteCategory(currentCategory.categorySlug);
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].categorySlug === currentCategory.categorySlug) {
          const newCategories = [...categories];
          const newCategoriesQuantity = [...categoriesQuantity];
          newCategories.splice(i, 1);
          newCategoriesQuantity.splice(i, 1);
          setCategories(newCategories);
          setCategoriesQuantity(newCategoriesQuantity);
          toast.success('Xóa danh mục thành công!');
          break;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Xóa danh mục thất bại, Vui lòng thử lại sau!');
    }

    setShowModalDeleteCategory(false);
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-3.5 pt-8'>
        <h2 className='text-2xl font-semibold'>Danh Mục</h2>
        <button
          className='py-3.5 px-5 inline-block border rounded-lg text-white font-bold bg-primaryColor border-[#ccc] hover:opacity-80 transition-opacity'
          onClick={() => {
            setCategoryNameError('');
            setShowModalAddCategory(true);
          }}
        >
          <span>
            <i className='mr-2 fa-solid fa-plus'></i>
          </span>
          Thêm danh mục
        </button>
      </div>
      {isLoading && categories === null && (
        <div className='flex items-center justify-center h-[516px]'>
          <LoadingCenter />
        </div>
      )}
      {!isLoading && categories === null && (
        <div className='flex items-center justify-center h-[516px]'>
          <p className='text-xl font-bold'>
            Có lỗi xảy ra phía Máy Chủ, Vui lòng thử lại sau!
          </p>
        </div>
      )}
      {!isLoading && categories && (
        <Fragment>
          {categories.length === 0 ? (
            <div className='flex items-center justify-center h-[516px]'>
              <p className='text-xl font-bold'>Hiện không có danh mục nào</p>
            </div>
          ) : (
            <Fragment>
              <ChangePerPage
                textDisplay='Danh mục mỗi trang: '
                limit={limit}
                setLimit={setLimit}
              />
              <table className='w-full border border-collapse table-auto border-borderColor'>
                <thead>
                  <tr>
                    <th className='px-1 py-3.5 font-bold text-center border-b border-[#ccc]'>
                      STT
                    </th>
                    <th className='px-1 py-3.5 font-bold text-center border-b border-[#ccc]'>
                      Tên Danh Mục
                    </th>
                    <th className='px-1 py-3.5 font-bold text-center border-b border-[#ccc]'>
                      Sản Phẩm Thuộc Danh Mục
                    </th>
                    <th className='px-1 py-3.5 font-bold text-center border-b border-[#ccc]'>
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id}>
                      <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                        {(currentPage - 1) * limit.value + index + 1}
                      </td>
                      <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                        {category.name}
                      </td>
                      <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                        {categoriesQuantity[index]} sản phẩm
                      </td>
                      <td className='px-1 py-2 font-semibold text-center border-b border-[#ccc]'>
                        <button
                          className='ml-2.5 py-2 inline-block px-5 border rounded-lg text-thirdColor border-[#ccc] hover:text-white hover:bg-thirdColor transition-colors'
                          onClick={() => {
                            setCategoryNameError('');
                            setCurrentCategory(category);
                            setShowModalUpdateCategory(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className='ml-2.5 text-red-500 py-2 px-5 border rounded-lg  border-[#ccc] hover:bg-red-500 hover:text-white transition-colors'
                          onClick={() => {
                            setCurrentCategory(category);
                            setShowModalDeleteCategory(true);
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page.selected + 1)}
                className='my-8'
              />
            </Fragment>
          )}
        </Fragment>
      )}
      {showModalAddCategory && (
        <Portal
          showModal={showModalAddCategory}
          classContainer={'modal-add-category'}
        >
          <Modal
            showModal={showModalAddCategory}
            handleCloseModal={() => setShowModalAddCategory(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-6 pb-5 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalAddCategory(false)}
              className='pt-5 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Thêm Danh Mục
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <div>
                <input
                  type='text'
                  name='category'
                  className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
                  placeholder='Tên danh mục'
                  ref={inputAddCategoryRef}
                  onFocus={() => setCategoryNameError('')}
                />
                <span className='block mt-1 ml-3 text-left text-red-500'>
                  {categoryNameError || ''}
                </span>
              </div>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalAddCategory(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-primaryColor rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleAddCategory}
                >
                  Thêm
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}

      {showModalUpdateCategory && (
        <Portal
          showModal={showModalUpdateCategory}
          classContainer={'modal-update-category'}
        >
          <Modal
            showModal={showModalUpdateCategory}
            handleCloseModal={() => setShowModalUpdateCategory(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalUpdateCategory(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Cập Nhật Danh Mục
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='mb-3 text-lg leading-5'>
                Cập nhật tên cho danh mục{' '}
                <span className='font-semibold'>{currentCategory.name}</span>
              </p>
              <div className='mb-3 text-base leading-5'>
                <span className='font-semibold text-red-500'>* Lưu ý: </span>
                Khi cập nhật tên cho danh mục, tất cả sản phẩm thuộc danh mục
                này sẽ được cập nhật với tên danh mục mới.
              </div>
              <div>
                <input
                  type='text'
                  name='category'
                  className='bg-white block+ w-full py-2.5 px-6 text-black border-2 border-borderColor outline-none min-h-[50px] rounded-xl focus:border-primaryColor hover:border-primaryColor'
                  placeholder='Tên danh mục'
                  ref={inputUpdateCategoryRef}
                  defaultValue={currentCategory?.name}
                  onFocus={() => setCategoryNameError('')}
                />
                <span className='block mt-1 ml-3 text-left text-red-500'>
                  {categoryNameError || ''}
                </span>
              </div>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalUpdateCategory(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-thirdColor rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleUpdateCategory}
                >
                  Cập nhật
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}

      {showModalDeleteCategory && (
        <Portal
          showModal={showModalDeleteCategory}
          classContainer={'modal-delete-category'}
        >
          <Modal
            showModal={showModalDeleteCategory}
            handleCloseModal={() => setShowModalDeleteCategory(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalDeleteCategory(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Bạn có chắc chắn muốn xóa danh mục này không?
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='text-lg leading-5'>
                Bạn có chắc chắn muốn xóa danh mục này không? Sau khi xóa, tất
                cả sản phẩm thuộc danh mục cũng sẽ bị xóa, bạn hãy chắc chắn
                rằng danh mục này không còn sản phẩm nào.
              </p>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalDeleteCategory(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-red-500 rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleDeleteCategory}
                >
                  Xóa
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}
    </div>
  );
};

export default Category;
