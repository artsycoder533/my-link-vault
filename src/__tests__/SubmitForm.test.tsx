import { test, expect, describe, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SubmitForm from "../components/SubmitForm";
import userEvent from "@testing-library/user-event";

const mockOnSubmit = vi.fn();
const formRefMock = { current: document.createElement('form')}

const setup = () => {
  const user = userEvent.setup();
  render(<SubmitForm handleSubmit={mockOnSubmit} formRef={formRefMock} />);
  return { user };
}

describe("SubmitForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should render SubmitForm with correct content", () => {
    setup();

    const tagInput = screen.getByRole("textbox");
    expect(tagInput).toBeInTheDocument();
    expect(tagInput).toHaveAccessibleName();

    const selectInput = screen.getByRole("combobox");
    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveAccessibleName();

    const submitButton = screen.getByRole("button", { name: /add link/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAccessibleName();
  });

  test("should submit form when submit button pressed", async () => {
    const { user } = setup();

    const tagInput = screen.getByRole("textbox");
    const selectInput = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", { name: /add link/i });
    await user.type(tagInput, "new tag");
    await user.selectOptions(selectInput, "website");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      // check if an event was passed in to the handleSubmit function
      expect(typeof mockOnSubmit.mock.calls[0][0]).toBe("object");
      expect(mockOnSubmit.mock.calls[0][0]).toHaveProperty("currentTarget");
    });
  });

  test('should not submit form with invalid input', async() => {
    const { user } = setup();
  
    const submitButton = screen.getByRole("button", { name: /add link/i });
    await user.click(submitButton);
  
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  })
});