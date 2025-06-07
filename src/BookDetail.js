import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./App.css"; // Importa il tuo file CSS

import { FaPencil } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

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
    //fetch("http://localhost:3001/books")
    fetch("https://archiviolibri-backend.onrender.com/books")
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

    fetch(`https://archiviolibri-backend.onrender.com/books/${id}`, {
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
            <table className="book-detail-table">
              <tbody>
                <tr>
                  <td>Autore:</td>
                  <td>
                    <input
                      type="text"
                      name="Autore"
                      value={formData.Autore}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Titolo:</td>
                  <td>
                    <input
                      type="text"
                      name="Titolo"
                      value={formData.Titolo}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Serie:</td>
                  <td>
                    <input
                      type="text"
                      name="Serie"
                      value={formData.Serie}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Genere:</td>
                  <td>
                    <input
                      type="text"
                      name="Genere"
                      value={formData.Genere}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tipologia:</td>
                  <td>
                    <input
                      type="text"
                      name="Tipologia"
                      value={formData.Tipologia}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Posizione:</td>
                  <td>
                    <input
                      type="text"
                      name="Posizione"
                      value={formData.Posizione}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                {/*}
                <tr>
                  <td>Letto da:</td>
                  <td>
                    <input
                      type="text"
                      name="Letto"
                      value={formData.Letto}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                */}
              </tbody>
            </table>
          </form>
          <button style={{marginRight: "5px", fontSize: "12px"}} onClick={handleSave}> <FaRegSave /><strong> Salva</strong></button>
          <button style={{marginLeft: "5px", fontSize: "12px"}} onClick={handleCancel}> <strong> Annulla</strong></button>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                
              }}
            >
              <Link to="/">
                <IoMdArrowRoundBack color="black" />
              </Link>
            </button>
            <h2>{book.Titolo}</h2>
            <button
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setIsEditing(true)}
            >
              <FaPencil />
            </button>
          </div>
          <table className="book-detail-table">
            <tbody>
              <tr>
                <td>
                  <strong>Autore:</strong>
                </td>
                <td>{book.Autore}</td>
              </tr>
              <tr>
                <td>
                  <strong>Serie:</strong>
                </td>
                <td>{book.Serie}</td>
              </tr>
              <tr>
                <td>
                  <strong>Genere:</strong>
                </td>
                <td>{book.Genere}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tipologia:</strong>
                </td>
                <td>{book.Tipologia}</td>
              </tr>
              <tr>
                <td>
                  <strong>Posizione:</strong>
                </td>
                <td>{book.Posizione}</td>
              </tr>
              {/*<tr>
                <td>
                  <strong>Letto:</strong>
                </td>
                <td>{book.Letto}</td>
              </tr>
              */}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default BookDetail;
