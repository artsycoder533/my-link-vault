import { test, expect, describe, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterForm from "../components/FilterForm";

describe("FilterForm", () => {
  test("should render FilterForm with correct content", () => {
    const mockOnChange = vi.fn();
    const mockOnReset = vi.fn();
    const tags = ['react', 'work', 'travel'];
    const categories = ['tool', 'website', 'blog/article', 'youtube'];
  
    render(<FilterForm tags={tags} categories={categories} onChange={mockOnChange} onReset={mockOnReset}/>);
  
    // Check if select elements and labels are in the document
    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);
    const removeFilterButton = screen.getByRole('button', { name: /remove filters/i });
  
    expect(selectTag).toBeInTheDocument();
    expect(selectCategory).toBeInTheDocument();
    expect(removeFilterButton).toBeInTheDocument();
  
    // Check if default options are present
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
  
    // Check if the select elements have the correct default value
    expect(selectTag).toHaveValue('');
    expect(selectCategory).toHaveValue('');
  });

  test('should call reset function when button pressed', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnReset = vi.fn();
    const tags = ['react', 'work', 'travel'];
    const categories = ['tool', 'website', 'blog/article', 'youtube'];
 
    render(<FilterForm tags={tags} categories={categories} onChange={mockOnChange} onReset={mockOnReset}/>);
    const removeFilterButton = screen.getByRole('button', {name: /remove filters/i});
    await user.click(removeFilterButton);
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('should call onChange when tag selected', async() => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnReset = vi.fn();
    const tags = ['react', 'work', 'travel'];
    const categories = ['tool', 'website', 'blog/article', 'youtube'];
 
    render(<FilterForm tags={tags} categories={categories} onChange={mockOnChange} onReset={mockOnReset}/>);
    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);
    await user.selectOptions(selectTag, 'work');
    await user.selectOptions(selectCategory, 'tool');
    await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });
});
