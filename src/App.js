import React, { useState, useRef, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import useBookHook from "./useBookSearch";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pagenumber, setPageNumber] = useState(1);
  const { books, hasMore, loading, error } = useBookHook(query, pagenumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting ** hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }); // detect element wrt viewport
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="App">
      <input type="text" value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        if (books.length === index + 1)
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        return <div key={book}>{book}</div>;
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "error..."}</div>
    </div>
  );
}

export default App;
