import { test, expect, describe, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterForm from "../components/FilterForm";

const tags = ['react', 'work', 'travel'];
const categories = ['tool', 'website', 'blog/article', 'youtube'];
const mockOnChange = vi.fn();
const mockOnReset = vi.fn();

const setup = () => {
  const user = userEvent.setup();
  render(<FilterForm tags={tags} categories={categories} onChange={mockOnChange} onReset={mockOnReset} />);
  return { user };
};

describe("FilterForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should render FilterForm with correct content", () => {
    setup();

    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);
    const removeFilterButton = screen.getByRole('button', { name: /remove filters/i });

    expect(selectTag).toBeInTheDocument();
    expect(selectCategory).toBeInTheDocument();
    expect(removeFilterButton).toBeInTheDocument();

    const defaultTagOption = selectTag.querySelector('option[value=""]');
    const defaultCategoryOption = selectCategory.querySelector('option[value=""]');

    expect(defaultTagOption).toBeInTheDocument();
    expect(defaultTagOption).toHaveAttribute('value', '');
    expect(defaultTagOption).toHaveAttribute('disabled');
    expect(defaultTagOption).toHaveAttribute('hidden');

    expect(defaultCategoryOption).toBeInTheDocument();
    expect(defaultCategoryOption).toHaveAttribute('value', '');
    expect(defaultCategoryOption).toHaveAttribute('disabled');
    expect(defaultCategoryOption).toHaveAttribute('hidden');

    expect(selectTag).toHaveValue('');
    expect(selectCategory).toHaveValue('');
  });

  test('should call reset function when button pressed', async () => {
    const { user } = setup();
    const removeFilterButton = screen.getByRole('button', { name: /remove filters/i });

    await user.click(removeFilterButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('should call onChange when tag or category selected', async () => {
    const { user } = setup();
    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);

    await user.selectOptions(selectTag, 'work');
    await user.selectOptions(selectCategory, 'tool');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });
});
