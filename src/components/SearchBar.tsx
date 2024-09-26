import { useState } from "react";
import "./SearchBar.css"; 
import "../App.css";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  error: { title: string; message: string; resolution: string } | null;  // props för API-fel
}

export default function SearchBar({ onSearch, error }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState(""); // För inmatningsfel

  // Uppdatera sökterm vid inmatning
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setInputErrorMessage(""); // Rensa inmatningsfel vid förändring
  };

  // Hantera formulärinskickning
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Förhindra att sidan laddas om
    if (searchTerm) {
      onSearch(searchTerm); // Skicka sökordet till App-komponenten
    } else {
      setInputErrorMessage("Please enter a search word"); // Visa felmeddelande om användare inte skriver ett sökord
    }
  };

  return (
    <>
      <section className="search-bar">
        {/* Formulär för att hantera sökningen */}
        <form onSubmit={handleSubmit}>
          <input 
            className="search-input"
            aria-label="search-input"
            type="text"
            value={searchTerm}
            onChange={handleChange} // Uppdatera sökterm vid inmatning
            placeholder="Enter a word"
          />
          <button type="submit" className="search-button">Search</button> 
        </form>
      </section>
      
      {/* Visar felmeddelanden relaterade till inmatning */}
      {inputErrorMessage && <p className="error-message">{inputErrorMessage}</p>}
      
      {/* Visar API-relaterade felmeddelanden */}
      {error && (
        <section className="error-container">
          <h2 className="error-title">{error.title}</h2>
          <p className="error-message">{error.message}</p>
          <p className="error-resolution">{error.resolution}</p>
        </section>
      )}
    </>
  );
}
