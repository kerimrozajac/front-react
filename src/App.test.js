import { render, screen } from "./helpers/test-utils";
import App from "./App";

test("renders Welcome text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome!/i);
  expect(linkElement).toBeInTheDocument();
});
