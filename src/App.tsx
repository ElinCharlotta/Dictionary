import { useEffect, useState } from "react";
import { Word } from "./interfaces";
import WordList from "./components/WordList";
import SearchBar from "./components/SearchBar";
import FavoritesList from "./components/FavoritesList";
import ToggleTheme from "./components/ToggleTheme";

import "./App.css";

export default function App() {
    const [words, setWords] = useState<Word[]>([]);
    const [error, setError] = useState<{
        title: string;
        message: string;
        resolution: string;
    } | null>(null);
    const [favorites, setFavorites] = useState<Word[]>([]);
    const [theme, setTheme] = useState<"dark" | "light">(
        () => (sessionStorage.getItem("theme") as "dark" | "light") || "light"
    );

    const fetchWords = async (searchTerm: string) => {
        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
            );
            const data = await response.json();
            console.log("API Response:", data);

            if (data.title && data.message && data.resolution) {
                // Om svaret är ett felmeddelande, uppdatera error-state
                setWords([]);
                setError({
                    title: data.title,
                    message: data.message,
                    resolution: data.resolution,
                });
            } else {
                // Om svaret är en array med ord, uppdatera words-state
                setWords(data);
                setError(null);
            }
        } catch {
            // Om ett fel uppstod, uppdatera error-state
            setWords([]);
            setError({
                title: "Unexpected Error",
                message: "Unexpected error",
                resolution: "Try again",
            });
        }
    };
    console.log("Favorites:", favorites);

    const handleAddToFavorites = (word: Word) => {
        console.log("Removing from favorites:", word);

        // Kontrollera om ordet redan finns i favoriter
        const wordExists = favorites.find(
            (favorite) => favorite.word === word.word
        );
        if (!wordExists) {
            // Lägg till ordet om det inte finns i favoriter
            const updatedFavorites = [...favorites, word];
            setFavorites(updatedFavorites);
            sessionStorage.setItem(
                "favorites",
                JSON.stringify(updatedFavorites)
            );
        }
    };

    const handleRemoveFromFavorites = (word: Word) => {
        console.log("Removing from favorites:", word);
        const updatedFavorites = favorites.filter(
            (favorite) => favorite.word !== word.word
        );
        setFavorites(updatedFavorites);
        console.log("Updated favorites:", updatedFavorites);
        sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    useEffect(() => {
        const storedFavorites = sessionStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        sessionStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <>
            <ToggleTheme onToggle={toggleTheme} />

            <h1>Dictionary</h1>
            <SearchBar onSearch={fetchWords} error={error} />
            <FavoritesList
                favorites={favorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
            />
            <WordList words={words} onAddToFavorites={handleAddToFavorites} />
        </>
    );
}
