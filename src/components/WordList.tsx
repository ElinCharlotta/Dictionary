import { Word } from "../interfaces";
import "./WordList.css";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
interface WordListProps {
  words: Word[];
  onAddToFavorites: (word: Word) => void;
}

export default function WordList({ words, onAddToFavorites }: WordListProps) {
  return (
    <ul className="word-list">
      {words.map((wordData, index) => (
        <li key={wordData.word + index} className="word-item">
                    <button className="action-button" 
                    aria-label="Add to favorites" 
                    onClick={() => onAddToFavorites(wordData)}>    
                      <FontAwesomeIcon icon={faPlus} /> 
                    </button>

          <h3>Word: {wordData.word}</h3> 

          {wordData.phonetics
            .filter(phonetic => phonetic.audio)
            .map((phonetic, index) => (
              <div key={phonetic.text + index} className="phonetic-item">
                {phonetic.text}
                  <div>
                    <audio 
                    controls 
                    className="phonetic-audio"
                    aria-label="phonetic-audio">
                      <source src={phonetic.audio}  />
                      Your browser does not support the audio element.
                    </audio>

                
                  </div>
                
              </div>
            ))
          }
          <strong>Meaning:</strong>
          {wordData.meanings.map((meaning, index) => (
            <div key={meaning.partOfSpeech + index} className="meaning-item">
              <strong>{meaning.partOfSpeech}:</strong>
              {meaning.definitions.map((definition, defIndex) => (
                <div key={definition.definition + defIndex} className="definition-item">
                  <p>{definition.definition}</p>
                  {definition.example && (
                    <section>
                      <strong>Example: </strong><p>{definition.example}</p>
                    </section>
                  )}
                </div>
              ))}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );


}