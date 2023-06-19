import Select from 'react-select';

const options = [
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
];

const ChangePerPage = ({ textDisplay, limit, setLimit }) => {
  return (
    <div className='flex items-center justify-end w-full mb-5'>
      <span className='mr-2.5 font-medium text-lg'>{textDisplay}</span>
      <Select
        isSearchable={false}
        maxMenuHeight={200}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: '50px',
            borderRadius: '0.5rem',
            outline: 'none',
            boxShadow: 'none',
            fontSize: '1rem',
            border: state.isFocused ? '2px solid #91ad41' : '2px solid #ebebeb',

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
            border: '2px solid #ebebeb',
            borderRadius: '0.2rem',
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
        options={options}
        onChange={setLimit}
        defaultValue={limit}
        value={limit}
      />
    </div>
  );
};

export default ChangePerPage;
