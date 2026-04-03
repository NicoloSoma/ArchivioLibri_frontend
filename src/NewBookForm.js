import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css"; // Importa il tuo file CSS

import { FaRegSave } from "react-icons/fa";

function NewBookForm() {
  const [formData, setFormData] = useState({
    Autore: "",
    Titolo: "",
    Serie: "",
    Genere: "",
    Tipologia: "",
    Posizione: "",
    Letto: "",
  });
  const navigate = useNavigate(); // Usa useNavigate per la navigazione

  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsCreating(true); // Imposta lo stato di creazione a true
    fetch("https://script.google.com/macros/s/AKfycbyQ2dzokO7BYqQiB5pmgzGhRJe98lakN7qbyAAPgBrjwyc9fz2Oz5HVJ_dqzFVo-jmtFA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "add-book",
        book: formData
      }),
    })
      .then((response) => {
        if (response.ok) {
          setIsCreating(false); // Imposta lo stato di creazione a false
          navigate("/"); // Redirect to home on success
        } else {
          return response.json().then((error) => {
            console.error("Error:", error);
            alert("Errore durante il salvataggio del libro.");
          });
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Errore di rete durante il salvataggio del libro.");
      });
  };

  const handleCancel = () => {
    setFormData({
      Autore: "",
      Titolo: "",
      Serie: "",
      Genere: "",
      Tipologia: "",
      Posizione: "",
      Letto: "",
    });
    navigate("/");
  };

  return (
    <div className="book-detail">
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

        {isCreating && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Creazione in corso...</h2>
              <p>Attendere prego...</p>
            </div>
          </div>
        )}

        <button
          style={{ marginRight: "5px", fontSize: "12px" }}
          onClick={handleSave}
        >
          {" "}
          <FaRegSave />
          <strong> Aggiungi</strong>
        </button>
        <button
          style={{ marginLeft: "5px", fontSize: "12px" }}
          onClick={handleCancel}
        >
          {" "}
          <strong> Annulla</strong>
        </button>
      </>
    </div>
  );
}

export default NewBookForm;
