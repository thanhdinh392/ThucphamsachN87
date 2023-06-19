const PaginationSkeleton = () => {
  return (
    <div className='flex justify-center gap-3 mt-20'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='w-[40px] h-[40px] !rounded-full border border-transparent skeleton'
          ></div>
        ))}
    </div>
  );
};

export default PaginationSkeleton;
