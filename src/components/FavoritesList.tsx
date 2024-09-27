import { Word } from "../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { useEffect } from "react";
import "../App.css";
import Collapsible from "./Collapsible";
import "./FavoriteList.css";
import "./Collapsible.css";

interface FavoritesListProps {
    favorites: Word[];
    onRemoveFromFavorites: (word: Word) => void; // Funktion för att hantera borttagning av ord från favoriter
}

// FavoritesList-komponenten som visar en lista av favoritord

export default function FavoritesList({
    favorites,
    onRemoveFromFavorites,
}: FavoritesListProps) {
    // Kontrollera om det finns några favoriter
    if (favorites.length === 0) {
        return <div>No favorites</div>;
    }

    return (
        <ul className="favorites-word-list" aria-label="favorites-list">
            <h2 className="favorites-list-title">Favorites</h2>
            {favorites.map((word, index) => (
                <li key={word.word + index} className="word-item-favorites">
                    <button
                        className="favorites-action-button"
                        onClick={() => onRemoveFromFavorites(word)}
                        aria-label={`Remove from favorites`}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <Collapsible title={`Word: ${word.word}`}>
                        {word.phonetics &&
                            word.phonetics
                                .filter((phonetic) => phonetic.audio)
                                .map((phonetic, phoneticIndex) => (
                                    <div
                                        key={phonetic.text + phoneticIndex}
                                        className="phonetic-item-favorites"
                                    >
                                        {phonetic.text}
                                        {phonetic.audio && (
                                            <div>
                                                <audio controls>
                                                    <source
                                                        src={phonetic.audio}
                                                        type="audio/mpeg"
                                                    />
                                                    Your browser does not
                                                    support the audio element.
                                                </audio>
                                            </div>
                                        )}
                                    </div>
                                ))}

                        {word.meanings.map((meaning, meaningIndex) => (
                            <div
                                key={meaning.partOfSpeech + meaningIndex}
                                className="meaning-item-favorites"
                            >
                                <strong>Part of speech:</strong>{" "}
                                {meaning.partOfSpeech}
                                {meaning.definitions.map(
                                    (definition, defIndex) => (
                                        <div
                                            key={
                                                definition.definition + defIndex
                                            }
                                            className="definition-item-favorites"
                                        >
                                            <p>
                                                <strong>Definition:</strong>{" "}
                                                {definition.definition}
                                            </p>
                                            {definition.example && (
                                                <p>
                                                    <strong>Example:</strong>{" "}
                                                    {definition.example}
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </Collapsible>
                </li>
            ))}
        </ul>
    );
}
