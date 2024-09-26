interface Word {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];  

  }

interface Phonetic {
    text: string;
    audio?: string; 
  }
  
  interface Definition {
    definition: string;
    example?: string;
  }
  
  interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }


export type {Word}  