import React, { useEffect, useState } from 'react';
import formatPrice from './../../utils/formatPrice';
import { Link } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import productApi from '../../api/productApi';
import categoryApi from './../../api/categoryApi';
import userApi from './../../api/userApi';
import inventoryApi from '../../api/inventoryApi';
import { LoadingCenter } from '../../components/Loading';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashBoard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataChart, setDataChart] = useState({});

  const getOrders = async () => {
    try {
      const res = await orderApi.getOrders();
      setTotalOrders(res.data.orders.length);

      const isNotDelivered = res.data.orders.filter(
        (order) => order.shippingStatus === 'Chưa giao hàng'
      ).length;
      const totalIsShipping = res.data.orders.filter(
        (order) => order.shippingStatus === 'Đang vận chuyển'
      ).length;
      const totalIsDelivered = res.data.orders.filter(
        (order) => order.shippingStatus === 'Giao hàng thành công'
      ).length;

      setDataChart({
        labels: ['Chưa giao hàng', 'Đang vận chuyển', 'Giao hàng thành công'],
        datasets: [
          {
            data: [isNotDelivered, totalIsShipping, totalIsDelivered],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const res = await productApi.getProducts({
        params: {
          page: 1,
          limit: 10,
        },
      });
      setTotalProducts(res.data.pagination.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const res = await categoryApi.getCategories({
        params: {
          page: 1,
          limit: 10,
        },
      });
      setTotalCategories(res.data.pagination.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await userApi.getUsers({
        params: {
          page: 1,
          limit: 10,
        },
      });

      setTotalUsers(res.data.pagination.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllQuantityOfProductInInventory = async () => {
    try {
      const res = await inventoryApi.getAllQuantityOfProductInInventory();
      setTotalQuantity(res.data.totalQuantity);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalRevenue = async () => {
    try {
      const res = await orderApi.getTotalRevenue();
      setTotalRevenue(res.data.totalRevenue);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopSellingProducts = async () => {
    try {
      const res = await productApi.getTopSellingProducts({
        params: {
          page: 1,
          limit: 8,
        },
      });
      setTopSellingProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        Promise.all([
          getOrders(),
          getProducts(),
          getCategories(),
          getUsers(),
          getAllQuantityOfProductInInventory(),
          getTotalRevenue(),
          getTopSellingProducts(),
        ])
          .then(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className='pt-8 mb-3.5'>
      <h2 className='mb-3 text-2xl font-semibold'>Trang Điều Khiển</h2>
      {isLoading ? (
        <div className='flex items-center justify-center h-[516px]'>
          <LoadingCenter />
        </div>
      ) : (
        <div>
          <div className='grid grid-cols-2 gap-3 mb-10 lg:grid-cols-3'>
            <div className='flex items-center justify-between p-3 rounded-md bg-amber-300'>
              <div>
                <div className='mb-2 text-2xl font-bold'>
                  {formatPrice(totalRevenue)}
                </div>
                <div className='text-lg font-medium'>Tổng doanh thu</div>
              </div>
              <div>
                <i className='fa-solid fa-money-bill text-2xl w-[20px] icon-sidebar relative'></i>
              </div>
            </div>
            <Link
              to='/admin/orders'
              className='flex items-center justify-between p-3 rounded-md bg-lime-600'
            >
              <div>
                <div className='mb-2 text-2xl font-bold'>{totalOrders}</div>
                <div className='text-lg font-medium'>Tổng đơn hàng</div>
              </div>
              <div>
                <i className='fa-solid fa-cart-shopping text-2xl w-[20px] icon-sidebar relative'></i>
              </div>
            </Link>
            <Link
              to='/admin/products'
              className='flex items-center justify-between p-3 bg-teal-400 rounded-md'
            >
              <div>
                <div className='mb-2 text-2xl font-bold'>{totalProducts}</div>
                <div className='text-lg font-medium'>Tổng sản phẩm</div>
              </div>
              <div>
                <i className='fa-solid fa-box text-2xl w-[20px] icon-sidebar relative'></i>
              </div>
            </Link>
            <Link
              to='/admin/categories'
              className='flex items-center justify-between p-3 rounded-md bg-rose-600'
            >
              <div>
                <div className='mb-2 text-2xl font-bold'>{totalCategories}</div>
                <div className='text-lg font-medium'>Tổng danh mục</div>
              </div>
              <div>
                <i className='fa-solid fa-grip-vertical text-2xl w-[20px] icon-sidebar relative'></i>
              </div>
            </Link>
            <Link
              to='/admin/users'
              className='flex items-center justify-between p-3 rounded-md bg-cyan-500'
            >
              <div>
                <div className='mb-2 text-2xl font-bold'>{totalUsers}</div>
                <div className='text-lg font-medium'>Tổng người dùng</div>
              </div>
              <div>
                <i className='fa-solid fa-user text-2xl w-[20px] icon-sidebar relative'></i>
              </div>
            </Link>
            <Link
              to='/admin/inventory'
              className='flex items-center justify-between p-3 rounded-md bg-violet-500'
            >
              <div>
                <div className='mb-2 text-2xl font-bold'>{totalQuantity}</div>
                <div className='text-lg font-medium'>Tổng sản phẩm tồn kho</div>
              </div>
              <div>
                <i className='relative mr-3 text-2xl fa-solid fa-warehouse icon-sidebar'></i>
              </div>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-x-6'>
            <div>
              <h3 className='mb-3 text-2xl font-semibold'>
                Top sản phẩm bán chạy
              </h3>
              <div className='flex flex-col gap-2'>
                {topSellingProducts.length > 0 &&
                  topSellingProducts.map((product) => {
                    if (product.sold > 0) {
                      return (
                        <div
                          key={product.id}
                          className='flex items-center justify-between p-3 bg-white rounded-md'
                        >
                          <div className='flex items-center gap-x-3'>
                            <div className='w-16 h-16 overflow-hidden rounded'>
                              <img src={product.images[0].url} alt='' />
                            </div>
                            <div>
                              <div className='mb-1 font-medium text-primaryColor'>
                                {product.sold} đã bán
                              </div>
                              <div className='text-lg font-semibold'>
                                {product.name}
                              </div>
                            </div>
                          </div>
                          <div className='text-lg font-bold text-primaryColor'>
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
            <div>
              <h3 className='mb-3 text-2xl font-semibold'>
                Trạng thái đơn hàng
              </h3>
              <div className='mx-auto w-[45%]'>
                <Pie data={dataChart} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
