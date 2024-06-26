import { ChangeEvent } from "react";

interface FilterFormProps {
  tags: string[];
  categories: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

const FilterForm = ({ tags, categories, onChange, onReset }:FilterFormProps) => {
  return (
    <form className="flex justify-between">
      <label htmlFor="tags" className="sr-only">Select Tag:</label>
      <select
        name="tags"
        id="tags"
        onChange={onChange}
        defaultValue={""}
        className="p-1 border text-black w-fit"
      >
        <option value="" disabled hidden>
          Select Tag
        </option>
        {tags?.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <label htmlFor="category" className="sr-only">Select Category:</label>
      <select
        name="category"
        id="category"
        onChange={onChange}
        defaultValue={""}
        className="p-1 border text-black w-full"
      >
        <option value="" disabled  hidden>
          Select Category
        </option>
        {categories?.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={onReset} className="p-2 bg-secondary w-full">
        Remove Filters
      </button>
    </form>
  );
};

export default FilterForm;
