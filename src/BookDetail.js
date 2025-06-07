import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./App.css"; // Importa il tuo file CSS

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Usa useNavigate per la navigazione

  const [isEditing, setIsEditing] = useState(false);
  const [refresh, setRefresh] = useState(false); // Stato per il refresh
  const [formData, setFormData] = useState({
    Autore: "",
    Titolo: "",
    Serie: "",
    Genere: "",
    Tipologia: "",
    Posizione: "",
    Letto: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then((response) => response.json())
      .then((data) => {
        const selectedBook = data[parseInt(id, 10)];
        setBook(selectedBook);
        setFormData({
          Autore: selectedBook.Autore,
          Titolo: selectedBook.Titolo,
          Serie: selectedBook.Serie,
          Genere: selectedBook.Genere,
          Tipologia: selectedBook.Tipologia,
          Posizione: selectedBook.Posizione,
          Letto: selectedBook.Letto,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel caricamento del libro:", error);
        setLoading(false);
      });
  }, [id, refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    //console.log('Sto mandando PUT per id:', id);
    //console.log('Sto salvando il libro:', formData);

    setLoading(true); // Imposta loading a true per mostrare il caricamento

    fetch(`http://localhost:3001/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsEditing(false); // Disabilita la modalità di modifica
        setRefresh(!refresh); // Inverte il valore di refresh per forzare il ricaricamento
        navigate(`/book/${id}`); // Usa navigate per tornare alla pagina del libro
      })
      .catch((error) => {
        console.error("Errore nel salvataggio delle modifiche:", error);
        setLoading(false); // Imposta loading a true per mostrare il caricamento
      });
  };

  const handleCancel = () => {
    setIsEditing(false); // Disabilita la modalità di modifica senza salvare
    setFormData({
      Autore: book?.Autore || "",
      Titolo: book?.Titolo || "",
      Serie: book?.Serie || "",
      Genere: book?.Genere || "",
      Tipologia: book?.Tipologia || "",
      Posizione: book?.Posizione || "",
      Letto: book?.Letto || "",
      // Aggiungi altri campi se necessario
    });
  };

  if (loading) return <p>Caricamento dati libro...</p>;
  if (!book) return <p>Libro non trovato</p>;

  return (
    <div className="book-detail">
      {isEditing ? (
        <>
          <form>
            <label>
              Autore:
              <input
                type="text"
                name="Autore"
                value={formData.Autore}
                onChange={handleChange}
              />
            </label>
            <label>
              Titolo:
              <input
                type="text"
                name="Titolo"
                value={formData.Titolo}
                onChange={handleChange}
              />
            </label>
            <label>
              Serie:
              <input
                type="text"
                name="Serie"
                value={formData.Serie}
                onChange={handleChange}
              />
            </label>
            <label>
              Genere:
              <input
                type="text"
                name="Genere"
                value={formData.Genere}
                onChange={handleChange}
              />
            </label>
            <label>
              Tipologia:
              <input
                type="text"
                name="Tipologia"
                value={formData.Tipologia}
                onChange={handleChange}
              />
            </label>
            <label>
              Posizione:
              <input
                type="text"
                name="Posizione"
                value={formData.Posizione}
                onChange={handleChange}
              />
            </label>
            <label>
              Letto da:
              <input
                type="text"
                name="Letto"
                value={formData.Letto}
                onChange={handleChange}
              />
            </label>
          </form>
          <button onClick={handleSave}>Salva</button>
          <button onClick={handleCancel}>Annulla</button>
        </>
      ) : (
        <>
          <h2>{book.Titolo}</h2>
          <ul>
            <li>
              <strong>Autore:</strong> {book.Autore}
            </li>
            <li>
              <strong>Serie:</strong> {book.Serie}
            </li>
            <li>
              <strong>Genere:</strong> {book.Genere}
            </li>
            <li>
              <strong>Tipologia:</strong> {book.Tipologia}
            </li>
            <li>
              <strong>Posizione:</strong> {book.Posizione}
            </li>
            <li>
              <strong>Letto:</strong> {book.Letto}
            </li>
          </ul>
          <button onClick={() => setIsEditing(true)}>Modifica</button>
          <Link to="/">← Torna all'archivio</Link>
        </>
      )}
    </div>
  );
}

export default BookDetail;
