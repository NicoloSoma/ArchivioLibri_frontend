import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import "./App.css"; // Importa il tuo file CSS

import { FaPencil } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

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

  const [alertMessage, setAlertMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    //fetch("http://localhost:3001/books")
    fetch("https://script.google.com/macros/s/AKfycbyQ2dzokO7BYqQiB5pmgzGhRJe98lakN7qbyAAPgBrjwyc9fz2Oz5HVJ_dqzFVo-jmtFA/exec")
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

    fetch("https://script.google.com/macros/s/AKfycbyQ2dzokO7BYqQiB5pmgzGhRJe98lakN7qbyAAPgBrjwyc9fz2Oz5HVJ_dqzFVo-jmtFA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "update-book",
        id: id,
        book: formData
    }),
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
      {alertMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isDeleting ? (
              <p>Eliminazione in corso...</p>
            ) : (
              <>
                <p>Sei sicuro di voler cancellare questo libro?</p>
                
                <div className="compact-view">
                  {Object.entries(book).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "flex-start", marginBottom: "5px" }}>
                      <span style={{ fontWeight: "bold" }}>{key}: </span>
                      <span style={{ marginLeft: "1ch" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <button
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      marginRight: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      setIsDeleting(true);
                      fetch(
                        "https://script.google.com/macros/s/AKfycbyQ2dzokO7BYqQiB5pmgzGhRJe98lakN7qbyAAPgBrjwyc9fz2Oz5HVJ_dqzFVo-jmtFA/exec",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            action: "delete-book",
                            id: id
                          })
                        }
                      )
                        .then(() => {
                          setIsDeleting(false);
                          setAlertMessage(false);
                          navigate("/");
                        })
                        .catch((error) => {
                          console.error(
                            "Errore nella cancellazione del libro:",
                            error
                          );
                        });
                    }}
                  >
                    Conferma
                  </button>
                  <button
                    style={{
                      backgroundColor: "#bdc3c7",
                      color: "#333",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => setAlertMessage(false)}
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
          <button
            style={{ marginRight: "5px", fontSize: "12px" }}
            onClick={handleSave}
          >
            {" "}
            <FaRegSave />
            <strong> Salva</strong>
          </button>
          <button
            style={{ marginLeft: "5px", fontSize: "12px" }}
            onClick={handleCancel}
          >
            {" "}
            <strong> Annulla</strong>
          </button>
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
                <IoMdArrowRoundBack color="black" size={20} />
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
              <FaPencil size={20} />
            </button>
            <button
              onClick={() => setAlertMessage(true)}
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdDeleteOutline size={20} />
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
