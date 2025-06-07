import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./App.css"; // Importa il tuo file CSS

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then((response) => response.json())
      .then((data) => {
        // Aggiungo un ID univoco per link (index va bene per ora)
        const booksWithId = data.map((book, index) => ({
          ...book,
          id: index,
        }));
        setBooks(booksWithId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel caricamento dei libri:", error);
        setLoading(false);
      });
  }, []);

  // 1️⃣ Filtra i libri in base alla query di ricerca
  const normalizedText = (text) => {
    return text
      .normalize("NFD") // decomposizione Unicode
      .replace(/[\u0300-\u036f]/g, ""); // rimuove i segni diacritici (accenti, tilde, etc.)
  };
  
  const filteredBooks = books.filter(book => {
    const query = normalizedText(searchQuery).toLowerCase(); // Normalizza la query
    return (
      normalizedText(book.Autore)?.toLowerCase().includes(query) ||
      normalizedText(book.Titolo)?.toLowerCase().includes(query) ||
      normalizedText(book.Serie)?.toLowerCase().includes(query)
    );
  });

  // 2️⃣ Calcola quali libri mostrare in questa pagina
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  // 3️⃣ Numero totale di pagine
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  return (
    <div className="table-container">
      {loading ? (
        <p>Caricamento libri in corso...</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Cerca per autore, titolo o serie"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset a pagina 1 dopo una ricerca
            }}
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
          />
          <table>
            <thead>
              <tr>
                <th>Autore</th>
                <th>Titolo</th>
                <th>Serie</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr
                  key={book.id}
                  onClick={() => navigate(`/book/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{book.Autore}</td>
                  <td>{book.Titolo}</td>
                  <td>{book.Serie}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Pagina precedente
            </button>

            <span style={{ margin: "0 1rem" }}>
              Pagina {currentPage} di {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Pagina successiva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
