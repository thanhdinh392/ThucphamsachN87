import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';

import ChangePerPage from '../components/ChangePerPage';
import { LoadingCenter } from '../../../components/Loading';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import Portal from '../../../components/Modal/Portal';
import inventoryApi from './../../../api/inventoryApi';
import productApi from './../../../api/productApi';

const Inventory = () => {
  const [products, setProducts] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [errorQuantity, setErrorQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState({
    value: 10,
    label: '10',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false);
  const [showModalUpdateQuantity, setShowModalUpdateQuantity] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await inventoryApi.getProductsInventory({
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
      await inventoryApi.deleteProduct(currentProduct.id);
      await productApi.deleteProduct(currentProduct.slug);
      const newProducts = products.filter(
        (item) => item.productId.id !== currentProduct.id
      );
      setProducts(newProducts);
      toast.success('Xóa sản phẩm thành công');
    } catch (error) {
      console.log(error);
      toast.error('Xóa sản phẩm thất bại');
    }
    setShowModalDeleteProduct(false);
  };

  const handleUpdateQuantity = async () => {
    const quantityOfProduct = Number(quantity);
    if (Number.isNaN(quantityOfProduct)) {
      setErrorQuantity('Số lượng phải là số');
      return;
    }
    if (quantityOfProduct <= 0) {
      setErrorQuantity('Số lượng phải lớn hơn 0');
      return;
    }

    try {
      await inventoryApi.updateQuantity(currentProduct.id, quantityOfProduct);
      const newProducts = products.map((item) => {
        if (item.productId.id === currentProduct.id) {
          return {
            ...item,
            quantity: quantityOfProduct,
          };
        }
        return item;
      });
      setProducts(newProducts);
      toast.success('Cập nhật số lượng thành công');
    } catch (error) {
      console.log(error);
      toast.error('Cập nhật số lượng thất bại');
    }

    setShowModalUpdateQuantity(false);
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-3.5 pt-8'>
        <h2 className='text-2xl font-semibold'>Kho Hàng</h2>
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
              <p className='text-xl font-bold'>
                Hiện không có sản phẩm nào trong kho hàng
              </p>
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
                      Danh Mục
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Hình Ảnh
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Nhà Cung Cấp
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Số lượng trong kho
                    </th>
                    <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    const product = item.productId;
                    return (
                      <tr key={product.id}>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          {(currentPage - 1) * limit.value + index + 1}
                        </td>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          {product.name}
                        </td>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          {product.category}
                        </td>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
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
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          {product.supplier}
                        </td>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          {item.quantity}
                        </td>
                        <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                          <button
                            className='ml-2.5 py-2 inline-block px-5 border rounded-lg text-thirdColor border-[#ccc] hover:text-white hover:bg-thirdColor transition-colors'
                            onClick={() => {
                              setShowModalUpdateQuantity(true);
                              setCurrentProduct(product);
                              setQuantity(item.quantity);
                              setErrorQuantity('');
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className='ml-2.5 text-red-500 py-2 px-5 border rounded-lg  border-[#ccc] hover:bg-red-500 hover:text-white transition-colors'
                            onClick={() => {
                              setShowModalDeleteProduct(true);
                              setCurrentProduct(product);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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

      {showModalUpdateQuantity && (
        <Portal
          showModal={showModalUpdateQuantity}
          classContainer={'modal-update-quantity'}
        >
          <Modal
            showModal={showModalUpdateQuantity}
            handleCloseModal={() => setShowModalUpdateQuantity(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalUpdateQuantity(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Cập nhật số lượng sản phẩm
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='mb-3 text-lg leading-5'>
                Cập nhật số lượng sản phẩm{' '}
                <span className='font-semibold'>{currentProduct.name}</span>
              </p>
              <div>
                <label className='block text-base font-bold text-textColor'>
                  Số lượng
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    name='quantity'
                    className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onFocus={() => setErrorQuantity('')}
                  />
                  <span className='block mt-1 ml-3 text-left text-red-500'>
                    {errorQuantity || ''}
                  </span>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalUpdateQuantity(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-thirdColor rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleUpdateQuantity}
                >
                  Cập nhật
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}
      {showModalDeleteProduct && (
        <Portal
          showModal={showModalDeleteProduct}
          classContainer={'modal-delete-product-inventory'}
        >
          <Modal
            showModal={showModalDeleteProduct}
            handleCloseModal={() => setShowModalDeleteProduct(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalDeleteProduct(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng không?
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='text-lg leading-5'>
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng không? Sau
                khi xóa, tất cả thông tin về sản phẩm này cũng sẽ bị xóa và bạn
                sẽ không thể khôi phục lại thông tin sản phẩm này.
              </p>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalDeleteProduct(false)}
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

export default Inventory;
