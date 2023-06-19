import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ChangePerPage from '../components/ChangePerPage';
import { LoadingCenter } from '../../../components/Loading';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import Portal from '../../../components/Modal/Portal';
import formatPrice from '../../../utils/formatPrice';
import productApi from '../../../api/productApi';
import inventoryApi from './../../../api/inventoryApi';

const Product = () => {
  const [products, setProducts] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState({
    value: 10,
    label: '10',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getProducts({
          params: {
            page: currentPage,
            limit: limit.value,
          },
        });
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    getProducts();
  }, [currentPage, limit]);

  const handleDeleteProduct = async () => {
    try {
      await productApi.deleteProduct(currentProduct.slug);
      await inventoryApi.deleteProduct(currentProduct.id);
      const newProducts = products.filter(
        (product) => product.slug !== currentProduct.slug
      );

      setProducts(newProducts);
      toast.success('Xóa sản phẩm thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Xóa sản phẩm thất bại, Vui lòng thử lại sau!');
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className='flex items-center justify-between pt-8 mb-3.5'>
        <h2 className='text-2xl font-semibold'>Sản Phẩm</h2>
        <Link
          className='py-3.5 px-5 inline-block border rounded-lg text-white font-bold bg-primaryColor border-[#ccc] hover:opacity-80 transition-opacity'
          to={`${window.location.pathname}/add`}
        >
          <span>
            <i className='mr-2 fa-solid fa-plus'></i>
          </span>
          Thêm sản phẩm
        </Link>
      </div>
      {isLoading && products === null && (
        <div className='flex items-center justify-center h-[516px]'>
          <LoadingCenter />
        </div>
      )}

      {!isLoading && products === null && (
        <div className='flex items-center justify-center h-[516px]'>
          <p className='text-xl font-bold'>
            Có lỗi xảy ra phía Máy Chủ, Vui lòng thử lại sau!
          </p>
        </div>
      )}

      {!isLoading && products && (
        <Fragment>
          {products.length === 0 ? (
            <div className='flex items-center justify-center h-[516px]'>
              <p className='text-xl font-bold'>Hiện không có sản phẩm nào</p>
            </div>
          ) : (
            <Fragment>
              <ChangePerPage
                textDisplay='Sản phẩm mỗi trang: '
                limit={limit}
                setLimit={setLimit}
              />
              <table className='w-full border border-collapse table-auto border-borderColor'>
                <thead>
                  <tr>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      STT
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Tên Sản Phẩm
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Giá Gốc
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Giá Khuyến Mãi
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Danh Mục
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Hình Ảnh
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Nhà Cung Cấp
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {(currentPage - 1) * limit.value + index + 1}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {product.name}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {formatPrice(product.price)}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {formatPrice(product.salePrice)}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {product.category}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {product?.images?.length > 0 ? (
                          <img
                            src={product?.images[0].url}
                            alt={product.name}
                            className='w-[100px] h-[100px] inline-block'
                          />
                        ) : (
                          <span className='w-full h-[100px] flex items-center justify-center'>
                            Hiện chưa có hình ảnh
                          </span>
                        )}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        {product.supplier}
                      </td>
                      <td className='px-1 font-semibold text-center border-b border-[#ccc]'>
                        <Link
                          className='ml-2.5 py-2 inline-block px-5 border rounded-lg text-thirdColor border-[#ccc] hover:text-white hover:bg-thirdColor transition-colors'
                          to={`${window.location.pathname}/update/${product.slug}`}
                        >
                          Sửa
                        </Link>
                        <button
                          className='ml-2.5 text-red-500 py-2 px-5 border rounded-lg  border-[#ccc] hover:bg-red-500 hover:text-white transition-colors'
                          onClick={() => {
                            setShowModal(true);
                            setCurrentProduct(product);
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

      {showModal && (
        <Portal showModal={showModal} classContainer={'modal-delete-product'}>
          <Modal
            showModal={showModal}
            handleCloseModal={() => setShowModal(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModal(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Bạn có chắc chắn muốn xóa sản phẩm này không?
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='text-lg leading-5'>
                Bạn có chắc chắn muốn xóa sản phẩm này không? Sau khi xóa, bạn
                sẽ không thể khôi phục lại thông tin sản phẩm này.
              </p>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-red-500 rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleDeleteProduct}
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

export default Product;
