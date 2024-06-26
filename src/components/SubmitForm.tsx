import { FormEvent } from "react";

interface SubmitFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formRef: React.RefObject<HTMLFormElement>;
}

const SubmitForm = ({ handleSubmit, formRef }: SubmitFormProps) => {
  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <div className="flex flex-col w-full">
            <label htmlFor="tag">Add Tag:</label>
            <input
              type="text"
              name="tag"
              id="tag"
              className="border p-2 text-black w-full text-sm"
              placeholder="Add a descriptive tag"
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="category">Select Category:</label>
            <select
              name="category"
              id="category"
              className="border py-[8.25px] text-black w-full text-sm"
            >
              <option value="" disabled hidden>
                Select Category
              </option>
              <option value="website">Website</option>
              <option value="tool">Tool</option>
              <option value="blog">Blog/Article</option>
              <option value="youtube">YouTube Video</option>
              <option value="course">Course</option>
              <option value="documentation">Documentation</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-1 shrink-0 ml-auto my-2 bg-secondary"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default SubmitForm;
