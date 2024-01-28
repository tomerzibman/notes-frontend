const FilterButton = ({ showAll, setShowAll }) => {
  return (
    <div>
      <button
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        {showAll ? 'important' : 'all'}
      </button>
    </div>
  );
};

export default FilterButton;
