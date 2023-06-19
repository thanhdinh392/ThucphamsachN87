import Banner from './Banner';
import ProductListIntroduce from './ProductListIntroduce';
import AboutUs from './AboutUs';
import CategoryProductList from './CategoryProductList';
import TopSellingProduct from './TopSellingProduct';
import TopBrand from './TopBrand';

import './Home.scss';

const Home = () => {
  return (
    <div>
      <Banner />
      <ProductListIntroduce />
      <AboutUs />
      <CategoryProductList />
      <TopSellingProduct />
      <TopBrand />
    </div>
  );
};

export default Home;
