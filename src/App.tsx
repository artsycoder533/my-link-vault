import { FormEvent, useRef } from "react";
import LinkList from "./components/LinkList";
import db from "./db";
import Footer from "./components/Footer";
import SubmitForm from "./components/SubmitForm";


type Link = {
  url: string;
  title: string;
  tag: string;
  category: string;
};

function App() {
  const formRef = useRef<HTMLFormElement>(null);

  const getUrlAndTitle = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return {url: tab.url, title: tab.title}
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = await getUrlAndTitle();
    // const url = "http://www.example.com";
    const linkData = {
      url: data.url,
      // url: url,
      // title: "Title",
      title: data.title,
      tag: formData.get("tag"),
      category: formData.get("category"),
    } as Link;
    
    try {
      const existingLink = await db.links.where('url').equals(linkData.url).toArray();

      if(existingLink.length > 0){
        alert('Link already exists in your vault!');
        return;
      }

      await db.links.add({
        url: linkData.url,
        title: linkData.title,
        tag: linkData.tag,
        category: linkData.category,
      });
      formRef.current?.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-4 pb-0 bg-primary text-white h-[600px] w-[400px] overflow-y-auto">
      <h1 className="text-xl text-center mb-2">Link Vault</h1>
      {/* <div className="">
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
      </div> */}
      <SubmitForm handleSubmit={handleSubmit} formRef={formRef}/>
      <LinkList />
      <Footer />
    </div>
  );
}

export default App;
