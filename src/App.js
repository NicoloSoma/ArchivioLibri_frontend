/*import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 30; // 50 per pagina (puoi variare)

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const displayedBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel caricamento dei libri:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Archivio Libri</h1>
      </header>
      {loading ? (
        <p>Caricamento libri in corso...</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Cerca un libro..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // resetta a pagina 1 dopo la ricerca
            }}
            className="search-input"
          />
          <table>
            <thead>
              <tr>
                <th>Autore</th>
                <th>Titolo</th>
                <th>Serie</th>
                <th>Genere</th>
                <th>Tipologia</th>
                <th>Posizione</th>
                <th>Letto</th>
              </tr>
            </thead>
            <tbody>
              {displayedBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.Autore}</td>
                  <td>{book.Titolo}</td>
                  <td>{book.Serie}</td>
                  <td>{book.Genere}</td>
                  <td>{book.Tipologia}</td>
                  <td>{book.Posizione}</td>
                  <td>{book.Letto}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &laquo; Prev
            </button>
            <span>
              {" "}
              Pagina {currentPage} di {totalPages}{" "}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;*/

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import BookDetail from "./BookDetail";
import './App.css';
import NewBookForm from "./NewBookForm";

function App() {
  return (
    <Router basename="/ArchivioLibri_frontend">
      <div className="App">
        <header className="App-header">
          <h1>Archivio Libri</h1>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/add-new" element={<NewBookForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
