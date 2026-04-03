import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./context/SearchContext"; // percorso corretto

import "./App.css"; // Importa il tuo file CSS

import { IoAddCircleOutline, IoCloseSharp } from "react-icons/io5";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { searchQuery, setSearchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
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

  const filteredBooks = books.filter((book) => {
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
        <>
          <div style={{ marginBottom: "2rem" }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Centra orizzontalmente
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Cerca per autore, titolo o serie"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset a pagina 1 dopo una ricerca
              }}
              style={{
                padding: "0.5rem",
                width: "90%", // Larghezza al 90% della pagina
                maxWidth: "600px", // Limita la larghezza massima
              }}
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              style={{
                marginLeft: "0.5rem",
                padding: "0.2rem",
                cursor: "pointer",
              }}
            >
              <IoCloseSharp size={20} color="red" />
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => setCurrentPage(() => 1)}
              disabled={currentPage === 1}
            >
              &lt;&lt;
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
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
              &gt;
            </button>

            <button
              onClick={() => setCurrentPage(() => totalPages)}
              disabled={currentPage === totalPages}
            >
              &gt;&gt;
            </button>
          </div>

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

          <div style={{ marginBottom: "2rem" }}></div>

          <div className="floating-add-button">
            <IoAddCircleOutline size={40} onClick={() => {navigate("add-new")}}/>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
