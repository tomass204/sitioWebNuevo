import { type FC, type KeyboardEvent } from "react";

interface Props {
  placeHolder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export const SearchBar: FC<Props> = ({ placeHolder, value, onChange, onSearch }) => {
  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeHolder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};
