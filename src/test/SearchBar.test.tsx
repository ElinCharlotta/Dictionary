import { render, screen, waitFor } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import userEvent from "@testing-library/user-event";

test("It should allow letters to be inputted", async () => {
    render(
        <SearchBar
            onSearch={(searchTerm) => console.log(searchTerm)}
            error={null}
        />
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("");

    const user = userEvent.setup();
    await user.type(input, "Hello");
    await waitFor(() => expect(input.value).toBe("Hello"));
});
