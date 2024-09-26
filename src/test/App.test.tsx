import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import App from "../App";

// kolla att tema fungerar, kolla några klasser. light dark
const server = setupServer(
    http.get("https://api.dictionaryapi.dev/api/v2/entries/en/hello", () => {
        return HttpResponse.json([
            {
                word: "hello",
                phonetic: "həˈləʊ",
                phonetics: [
                    {
                        text: "həˈləʊ",
                        audio: "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
                    },
                    {
                        text: "hɛˈləʊ",
                    },
                ],
                meanings: [
                    {
                        partOfSpeech: "exclamation",
                        definitions: [
                            {
                                definition:
                                    "used as a greeting or to begin a phone conversation.",
                                example: "hello there, Katie!",
                            },
                        ],
                    },
                ],
            },
        ]);
    })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("should render Dictionary header, searchbar and searchButton on load", () => {
    render(<App />);
    expect(screen.getByText("Dictionary")).toBeInTheDocument();
    expect(
        screen.getByRole("textbox", { name: /search-input/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

describe("Search bar handling", () => {
    test("should render WordList component with word details after a successful search", async () => {
        render(<App />);

        const user = userEvent.setup();
        const input = screen.getByRole("textbox", { name: /search-input/i });
        await user.type(input, "hello");
        const searchButton = screen.getByRole("button", { name: /search/i });
        await user.click(searchButton);

        expect(screen.getByText("Word: hello")).toBeInTheDocument();
        expect(
            screen.getByText(
                "used as a greeting or to begin a phone conversation."
            )
        ).toBeInTheDocument();
        expect(screen.getByText("həˈləʊ")).toBeInTheDocument();
        expect(screen.getByText("hello there, Katie!")).toBeInTheDocument();
    });

    test("should let user use enter key to search", async () => {
        render(<App />);

        const user = userEvent.setup();
        const input = screen.getByRole("textbox", { name: /search-input/i });
        await user.type(input, "hello");
        await user.keyboard("{Enter}");

        expect(screen.getByText("Word: hello")).toBeInTheDocument();
    });

    test("should display /Please enter a search word/ if user have not enterd a search word", async () => {
        render(<App />);

        const user = userEvent.setup();
        const searchButton = screen.getByRole("button", { name: /search/i });
        await user.click(searchButton);
        expect(
            screen.getByText("Please enter a search word")
        ).toBeInTheDocument();
    });

    test("should display error message if user has entered a word that does not exist", async () => {
        render(<App />);

        const user = userEvent.setup();
        const input = screen.getByRole("textbox", { name: /search-input/i });
        await user.type(input, "Näsa");
        const searchButton = screen.getByRole("button", { name: /search/i });
        await user.click(searchButton);

        // Kontrollera att felmeddelandet visas
        expect(
            await screen.findByText("No Definitions Found")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Sorry pal, we couldn't find definitions for the word you were looking for."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "You can try the search again at later time or head to the web instead."
            )
        ).toBeInTheDocument();
    });
});

describe("handle favorites", () => {
    test("should add word to favoritesList", async () => {
        render(<App />);

        const user = userEvent.setup();
        const input = screen.getByRole("textbox");
        await user.type(input, "hello");
        const searchButton = screen.getByRole("button", { name: /search/i });
        await user.click(searchButton);

        // Lägg till ordet i favoriter
        const favoriteButton = screen.getByRole("button", {
            name: /add to favorites/i,
        });
        await user.click(favoriteButton);

        // Verifiera att ordet har lagts till i favoriter
        const favoritesList = await screen.findByRole("list", {
            name: /favorites-list/i,
        });
        expect(favoritesList).toBeInTheDocument(); // Kontrollera att listan finns

        expect(favoritesList).toHaveTextContent("hello"); // Kontrollera att ordet finns i favoriter
    });

    test("should remove word from favorites", async () => {
        render(<App />);

        const favoritesList = await screen.findByRole("list", {
            name: /favorites-list/i,
        });

        const user = userEvent.setup();
        const toggleCollapsibleButton = screen.getByRole("button", {
            name: /word: hello/i,
        });
        await user.click(toggleCollapsibleButton);

        // Ta bort ordet från favoriter
        const removeFavoriteButton = screen.getByRole("button", {
            name: /Remove from Favorites/i,
        });
        expect(removeFavoriteButton).toBeInTheDocument();
        await user.click(removeFavoriteButton);

        // Vänta och kontrollera att ordet har tagits bort
        await waitFor(() => {
            expect(
                within(favoritesList).queryByText("Word: hello")
            ).not.toBeInTheDocument();
        });
    });

    describe("toggle word favorites", () => {
        test("should toggle the visibility of favorite word details when the collapsible button is clicked", async () => {
            render(<App />);
            const user = userEvent.setup();

            const input = screen.getByRole("textbox");
            await user.type(input, "hello");
            const searchButton = screen.getByRole("button", {
                name: /search/i,
            });
            await user.click(searchButton);

            const favoriteButton = screen.getByRole("button", {
                name: /add to favorites/i,
            });
            await user.click(favoriteButton);

            const favoritesList = await screen.findByRole("list", {
                name: /favorites-list/i,
            });
            expect(favoritesList).toHaveTextContent("hello");

            // toggla för att visa detaljer om ordet i favoriter
            const toggleCollapsibleButton = screen.getByRole("button", {
                name: /word: hello/i,
            });
            await user.click(toggleCollapsibleButton);

            expect(
                await screen.findByRole("button", {
                    name: /Remove from Favorites/i,
                })
            ).toBeInTheDocument();
            expect(
                await screen.findByText(
                    "used as a greeting or to begin a phone conversation.",
                    { selector: ".definition-item-favorites p" }
                )
            ).toBeInTheDocument();

            // toggla för att dölja detaljer om ordet i favoriter
            await user.click(toggleCollapsibleButton);

            await waitFor(() =>
                expect(
                    within(favoritesList).queryByText(
                        "used as a greeting or to begin a phone conversation.",
                        { selector: ".definition-item-favorites p" } 
                    )
                ).not.toBeInTheDocument()
            );
        });
    });
});
