import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const SearchOverlayContext = createContext();

export function SearchOverlayProvider({ children }) {

  const [showOverlay, setShowOverlay] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {

    function handleClick(event) {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowOverlay(false);
      }

    }

    document.addEventListener("click", handleClick);

    return () =>
      document.removeEventListener("click", handleClick);

  }, []);

  return (
    <SearchOverlayContext.Provider
      value={{
        showOverlay,
        setShowOverlay,
        searchRef,
      }}
    >
      {children}
    </SearchOverlayContext.Provider>
  );
}

export function useSearchOverlay() {
  return useContext(SearchOverlayContext);
}