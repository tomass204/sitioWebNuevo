import { type FC } from "react";

interface Props {
  searches: string[];
  onLabelClicked: (term: string) => void;
  onRemoveSearch: (term: string) => void;
}

export const PreviousSearches: FC<Props> = ({ searches, onLabelClicked, onRemoveSearch }) => {
  return (
    <div className="previous-searches">
      {searches.length > 0 && (
        <>
          <h4>Búsquedas anteriores:</h4>
          <div className="searches-list">
            {searches.map((search, index) => (
              <div key={index} className="search-item">
                <button
                  onClick={() => onLabelClicked(search)}
                  className="search-label"
                >
                  {search}
                </button>
                <button
                  onClick={() => onRemoveSearch(search)}
                  className="remove-search"
                  title="Eliminar búsqueda"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
