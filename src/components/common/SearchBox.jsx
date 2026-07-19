function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      className="form-control"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default SearchBox;
