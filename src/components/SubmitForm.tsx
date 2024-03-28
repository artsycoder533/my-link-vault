import { FormEvent } from "react";

interface SubmitFormProps {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
}

const SubmitForm = ({handleSubmit, formRef}: SubmitFormProps) => {
  return (
    <div className="">
    <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col">
      <div className="flex items-center gap-x-2">
        <div className="flex flex-col w-full">
          <label htmlFor="tag">Tag:</label>
          <input
            type="text"
            name="tag"
            id="tag"
            className="border p-2 text-black w-full"
            placeholder="Add a descriptive tag"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="type">Select Category:</label>
          <select
            name="category"
            id="category"
            className="border py-[10px] text-black w-full"
          >
            <option value="" disabled selected hidden>Select Category</option>
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
        className="px-4 py-2 shrink-0 ml-auto my-2 bg-secondary"
      >
        Add Link
      </button>
    </form>
  </div>
  )
}

export default SubmitForm