import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

import productApi from './../../../api/productApi';
import categoryApi from '../../../api/categoryApi';
import Loading from './../../../components/Loading/Loading';
import Portal from '../../../components/Modal/Portal';
import Modal from '../../../components/Modal/Modal';
import { LoadingCenter } from '../../../components/Loading';
import inventoryApi from './../../../api/inventoryApi';

const UpdateProduct = () => {
  const [preQuantity, setPreQuantity] = useState(0);
  const [categoryOptionList, setCategoryOptionList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageUrlList, setImageUrlList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isLoadingUpdateProduct, setIsLoadingUpdateProduct] = useState(false);
  const [isLoadingFetchProduct, setIsLoadingFetchProduct] = useState(false);

  const navigate = useNavigate();
  const inputFileRef = useRef();
  const { slug } = useParams();

  const schema = yup.object({
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    price: yup
      .number('Giá sản phẩm phải là số')
      .typeError('Giá sản phẩm phải là số')
      .required('Giá sản phẩm là bắt buộc')
      .min(0, 'Giá sản phẩm phải lớn hơn hoặc bằng 0'),
    discount: yup
      .number()
      .typeError('Phần trăm giảm giá phải là số')
      .required('Phần trăm giảm giá là bắt buộc')
      .min(0, 'Phần trăm giảm giá phải lớn hơn hoặc bằng 0')
      .max(100, 'Phần trăm giảm giá phải nhỏ hơn hoặc bằng 100'),
    origin: yup.string().required('Xuất xứ là bắt buộc'),
    supplier: yup.string().required('Nhà cung cấp là bắt buộc'),
    quantity: yup
      .number()
      .typeError('Số lượng phải là số')
      .required('Số lượng là bắt buộc')
      .min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    weight: yup
      .number()
      .typeError('Trọng lượng phải là số')
      .required('Trọng lượng là bắt buộc')
      .min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0'),
    unit: yup.string().required('Đơn vị là bắt buộc'),
    description: yup.string().required('Mô tả là bắt buộc'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      price: '',
      discount: '',
      origin: '',
      supplier: '',
      quantity: '',
      weight: '',
      unit: '',
      description: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        const categoryOptionList = res.data.categories.map((category) => ({
          value: category.name,
          label: category.name,
        }));
        setCategoryOptionList(categoryOptionList);
      } catch (error) {
        console.log(error);
        toast.error('Có lỗi xảy ra vui lòng thử lại sau!');
        navigate(-1);
      }
    };

    getCategories();
  }, [navigate]);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoadingFetchProduct(true);
      try {
        const res = await productApi.getProductBySlug(slug);
        const product = res.data.product;
        setSelectedCategory({
          value: product.category,
          label: product.category,
        });
        setImageUrlList(product.images);
        reset({
          name: product.name,
          price: product.price,
          discount: product.discount,
          origin: product.origin,
          supplier: product.supplier,
          quantity: product.inventory[0].quantity,
          weight: product.weight,
          unit: product.unit,
          description: product.description,
        });
        setPreQuantity(product.inventory[0].quantity);
      } catch (error) {
        console.log(error);
        toast.error('Có lỗi xảy ra vui lòng thử lại sau!');
        navigate(-1);
      }
      setIsLoadingFetchProduct(false);
    };
    getProduct();
  }, [slug]);

  const handleChangeFile = (e) => {
    const files = e.target.files;
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      urls.push(url);
    }
    setFileList((prev) => [...prev, ...files]);
    setImageUrlList((prev) => [...prev, ...urls]);
  };

  const handleRemovePreviewImage = (imageIndex) => {
    const newFileList = fileList.filter((file, index) => index !== imageIndex);
    const newImageUrlList = imageUrlList.filter(
      (imageUrl, index) => index !== imageIndex
    );
    setFileList(newFileList);
    setImageUrlList(newImageUrlList);
  };

  const handleZoomPreviewImage = (imageIndex) => {
    setCurrentImageUrl(
      imageUrlList[imageIndex].url || imageUrlList[imageIndex]
    );
    setShowModal(true);
  };

  const handleUpdateProduct = async (values) => {
    setIsLoadingUpdateProduct(true);
    if (!selectedCategory.value || imageUrlList.length === 0) {
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('images', fileList[i]);
    }
    try {
      const data = {
        ...values,
        category: selectedCategory.value,
      };
      data.images = imageUrlList.filter((imageUrl) => {
        if (typeof imageUrl !== 'string') {
          return true;
        }
      });
      const res = await productApi.updateProduct(slug, data);
      if (fileList.length > 0) {
        formData.append('productId', res.data.product._id);
        await productApi.uploadImages(formData);
      }
      if (preQuantity !== values.quantity) {
        await inventoryApi.updateQuantity(
          res.data.product._id,
          values.quantity
        );
      }
      toast.success('Cập nhật sản phẩm thành công!');
      navigate('/admin/products');
    } catch (error) {
      console.log(error);
      toast.error('Cập nhật sản phẩm không thành công, Vui lòng thử lại sau!');
    }
    setIsLoadingUpdateProduct(false);
  };

  return (
    <div className='pb-10'>
      <h2 className='pt-8 pb-5 text-2xl font-semibold'>
        Cập Nhật Thông Tin Sản Phẩm
      </h2>
      {isLoadingFetchProduct ? (
        <div className='flex items-center ml-5 h-[516px]'>
          <LoadingCenter />
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <div className='mb-2 w-[500px]'>
            <label htmlFor='name' className='block mb-2 font-semibold ml-0.5'>
              Tên sản phẩm
            </label>
            <input
              className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[500px]'
              type='text'
              name='name'
              id='name'
              placeholder='Tên sản phẩm'
              {...register('name')}
            />
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {errors.name?.message}
            </span>
          </div>
          <div className='flex gap-2 mb-2'>
            <div className='w-[246px]'>
              <label
                htmlFor='price'
                className='block mb-2 font-semibold ml-0.5'
              >
                Giá sản phẩm
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='price'
                id='price'
                placeholder='Giá sản phẩm(đơn vị VNĐ)'
                {...register('price')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.price?.message}
              </span>
            </div>
            <div className='w-[246px]'>
              <label
                htmlFor='discount'
                className='block mb-2 font-semibold ml-0.5'
              >
                Giảm giá (đơn vị %)
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='discount'
                id='discount'
                placeholder='Giảm giá (đơn vị %)'
                {...register('discount')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.discount?.message}
              </span>
            </div>
          </div>
          <div className='flex gap-2 mb-2'>
            <div className='w-[246px]'>
              <label
                htmlFor='category'
                className='block mb-2 font-semibold ml-0.5'
              >
                Danh mục
              </label>
              <Select
                name='category'
                id='category'
                isSearchable={false}
                maxMenuHeight={200}
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
                    padding: '12px 12px',
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
                options={categoryOptionList}
                onChange={setSelectedCategory}
                value={selectedCategory}
                placeholder='Chọn danh mục'
                defaultValue={selectedCategory}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {isSubmitted && !selectedCategory && 'Vui lòng chọn danh mục'}
              </span>
            </div>
            <div className='w-[246px]'>
              <label
                htmlFor='origin'
                className='block mb-2 font-semibold ml-0.5'
              >
                Xuất xứ
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='origin'
                id='origin'
                placeholder='Xuất xứ'
                {...register('origin')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.origin?.message}
              </span>
            </div>
          </div>

          <div className='flex gap-2 mb-2'>
            <div className='w-[246px]'>
              <label
                htmlFor='weight'
                className='block mb-2 font-semibold ml-0.5'
              >
                Trọng lượng (đơn vị gam)
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='weight'
                id='weight'
                placeholder='Trọng lượng (đơn vị gam)'
                {...register('weight')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.weight?.message}
              </span>
            </div>
            <div className='w-[246px]'>
              <label htmlFor='unit' className='block mb-2 font-semibold ml-0.5'>
                Đơn vị (hộp, bao,...)
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='unit'
                id='unit'
                placeholder='Đơn vị (hộp, bao,...)'
                {...register('unit')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.unit?.message}
              </span>
            </div>
          </div>
          <div className='flex gap-2 mb-2'>
            <div className='mb-2 w-[246px]'>
              <label
                htmlFor='supplier'
                className='block mb-2 font-semibold ml-0.5'
              >
                Nhà cung cấp
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='supplier'
                id='supplier'
                placeholder='Nhà cung cấp'
                {...register('supplier')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.supplier?.message}
              </span>
            </div>
            <div className='mb-2 w-[246px]'>
              <label
                htmlFor='quantity'
                className='block mb-2 font-semibold ml-0.5'
              >
                Số lượng sản phẩm
              </label>
              <input
                className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[246px]'
                type='text'
                name='quantity'
                id='quantity'
                placeholder='Số lượng sản phẩm'
                {...register('quantity')}
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.quantity?.message}
              </span>
            </div>
          </div>
          <div className='mb-5 w-[500px]'>
            <input
              type='file'
              placeholder='Chọn hình ảnh'
              multiple
              ref={inputFileRef}
              onChange={handleChangeFile}
              hidden
            />
            <label className='block mb-2 font-semibold ml-0.5'>Hình ảnh</label>
            <div className='flex flex-wrap gap-1.5'>
              {imageUrlList.map((itemUrl, index) => (
                <div
                  key={index}
                  className='w-[120px] h-[120px] border-2 border-[#ccc] hover:border-primaryColor transition-colors] relative flex items-end justify-center group'
                >
                  <img src={itemUrl.url || itemUrl} alt='' />
                  <div className='absolute z-10 flex gap-2 mb-3'>
                    <span
                      className='cursor-pointer w-[30px] h-[30px] bg-[#fff] rounded-full flex items-center justify-center invisible group-hover:visible hover:opacity-80 transition-opacity'
                      onClick={() => handleZoomPreviewImage(index)}
                    >
                      <i className='fa-solid fa-magnifying-glass'></i>
                    </span>
                    <span
                      className='cursor-pointer w-[30px] h-[30px] bg-[#fff] rounded-full flex items-center justify-center invisible group-hover:visible hover:opacity-80 transition-opacity'
                      onClick={() => handleRemovePreviewImage(index)}
                    >
                      <i className='fa-solid fa-trash-can'></i>
                    </span>
                  </div>
                  <div className='absolute w-full h-full bg-[#000] opacity-0 group-hover:opacity-40 transition-opacity'></div>
                </div>
              ))}
              <div
                className='flex items-center justify-center w-[120px] h-[120px] border-2 border-[#ccc] bg-[#ccc] hover:opacity-80 transition-all cursor-pointer hover:border-primaryColor'
                onClick={() => {
                  inputFileRef.current.click();
                }}
              >
                <div className='flex flex-col items-center justify-center text-center'>
                  <i className='text-2xl fa-solid fa-cloud-arrow-up'></i>
                  <span>Upload</span>
                </div>
              </div>
            </div>
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {isSubmitted &&
                imageUrlList.length === 0 &&
                'Vui lòng chọn hình ảnh cho sản phẩm'}
            </span>
            <button
              className='px-3 py-3 mt-2 text-white transition-opacity rounded-md bg-secondaryColor hover:opacity-80'
              type='button'
              onClick={() => {
                inputFileRef.current.click();
              }}
            >
              Chọn hình ảnh
            </button>
          </div>
          <div className='mb-3 w-[500px]'>
            <label
              className='block mb-2 font-semibold ml-0.5'
              htmlFor='description'
            >
              Mô tả
            </label>
            <textarea
              name='description'
              id='description'
              cols='30'
              rows='10'
              placeholder='Mô tả về sản phẩm'
              className='px-3 py-3 border-2 rounded-lg border-borderColor hover:border-primaryColor focus:border-primaryColor min-w-[500px]'
              {...register('description')}
            ></textarea>
            <span className='block mt-1 ml-3 text-left text-red-500'>
              {errors.description?.message}
            </span>
          </div>
          <button
            type='submit'
            className='flex items-center justify-center px-2 py-3 border rounded-lg border-borderColor bg-primaryColor min-w-[160px] text-white font-semibold hover:opacity-80 transition-opacity'
          >
            {isLoadingUpdateProduct && (
              <Loading className='h-[20px] w-[20px] mr-2' />
            )}
            <span>Cập Nhật Sản Phẩm</span>
          </button>
        </form>
      )}

      {showModal && (
        <Portal showModal={showModal} classContainer={'modal-preview-image'}>
          <Modal
            showModal={showModal}
            handleCloseModal={() => setShowModal(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModal(false)}
              className='mb-3'
            ></Modal.Header>
            <Modal.Body className='mb-5'>
              <img
                src={currentImageUrl}
                alt=''
                className='w-[500px] h-[500px]'
              />
            </Modal.Body>
          </Modal>
        </Portal>
      )}
    </div>
  );
};

export default UpdateProduct;
