import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import useSearchParams from '../../hooks/useSearchParams';

const filterList = [
  {
    title: 'Giá tiền',
    name: 'salePrice',
    content: [
      {
        title: 'Giá dưới 100.000đ',
        value: '1',
      },
      {
        title: '100.000đ - 200.000đ',
        value: '2',
      },
      {
        title: '200.000đ - 300.000đ',
        value: '3',
      },
      {
        title: '300.000đ - 500.000đ',
        value: '4',
      },
      {
        title: '500.000đ - 1.000.000đ',
        value: '5',
      },
      {
        title: 'Giá trên 1.000.000đ',
        value: '6',
      },
    ],
  },
  {
    title: 'Nhà cung cấp',
    name: 'supplier',
    content: [
      {
        title: 'BigC',
        value: 'BigC',
      },
      {
        title: 'LotteMart',
        value: 'LotteMart',
      },
      {
        title: 'US Organic',
        value: 'US Organic',
      },
      {
        title: 'TMart',
        value: 'TMart',
      },
      {
        title: 'VinMart',
        value: 'VinMart',
      },
      {
        title: 'Cool Organic Company',
        value: 'Cool Organic Company',
      },
    ],
  },
];

const FilterSideBar = ({ handleFilterChange, setCurrentPage }) => {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => {
    return {
      salePrice: searchParams.getAll('salePrice') || [],
      supplier: searchParams.getAll('supplier') || [],
    };
  });

  useEffect(() => {
    handleFilterChange(filters);
  }, [filters]);

  const handleSortChange = (sortName, value) => {
    setCurrentPage(1);
    if (filters[sortName].includes(value)) {
      setFilters({
        ...filters,
        [sortName]: filters[sortName].filter((x) => x !== value),
      });
    } else {
      setFilters({
        ...filters,
        [sortName]: [...filters[sortName], value.toString()],
      });
    }
  };

  return (
    <div>
      {filterList.map((filter, index) => (
        <Fragment key={index}>
          <div className='mb-5 '>
            <h1 className='mb-2.5 text-xl font-semibold text-center lg:text-left'>
              {filter.title}
            </h1>
            <ul className='grid grid-cols-2 gap-1 font-medium text-textColor md:grid-cols-3 lg:block'>
              {filter.content.map((filterContent, index) => (
                <li className='mb-2' key={index}>
                  <input
                    type='checkbox'
                    name={filter.name}
                    id={filterContent.title}
                    checked={filters[filter.name].includes(filterContent.value)}
                    className='cursor-pointer peer'
                    onChange={() => {
                      handleSortChange(filter.name, filterContent.value);
                    }}
                  />
                  <label
                    className='lg:pl-2.5 pl-1.5 select-none cursor-pointer hover:text-primaryColor peer-hover:text-primaryColor'
                    htmlFor={filterContent.title}
                  >
                    {filterContent.title}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {index !== filterList.length - 1 && <hr className='my-3.5' />}
        </Fragment>
      ))}
    </div>
  );
};

FilterSideBar.propTypes = {
  handleFilterChange: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default FilterSideBar;
