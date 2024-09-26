import { render, screen } from "@testing-library/react";
import WordList from "../components/WordList";
import { Word } from "../interfaces";

test("should have the correct audio source", () => {
    const words: Word[] = [
        {
            word: "hello",
            phonetics: [
                {
                    text: "/həˈloʊ/",
                    audio: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
                },
            ],
            meanings: [
                {
                    partOfSpeech: "interjection",
                    definitions: [
                        {
                            definition:
                                "Used as a greeting or to begin a conversation.",
                        },
                    ],
                },
            ],
        },
    ];

    render(<WordList words={words} onAddToFavorites={() => {}} />);

    const audioElem = screen.getByLabelText("phonetic-audio");
    const srcElem = audioElem.querySelector("source");

    expect(srcElem).toBeInTheDocument();
    expect(srcElem).toHaveAttribute(
        "src",
        "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"
    );
});
