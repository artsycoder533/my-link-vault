import React from "react";
import { Link } from "../db";
import db from "../db";

interface ExportProps {
  filteredList: Link[];
}

const Export = ({ filteredList }: ExportProps) => {
  const exportDataToCSV = () => {
    if (filteredList.length === 0) return;

    //convert data to json
    const jsonData = JSON.stringify(filteredList, null, 2);

    //create blob
    const blob = new Blob([jsonData], { type: "application/json" });

    //create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);

    //trigger download
    a.click();

    //cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const jsonData = await readFile(file);
      const data = JSON.parse(jsonData);

      // Check for duplicates and add new links to the database
      await Promise.all(
        data.map(async (link: Link) => {
          const existingLink = await db.links
            .where("url")
            .equals(link.url)
            .first();
          if (!existingLink) {
            await db.links.add(link);
          }
        })
      );

      alert("Data uploaded successfully.");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("An error occurred while uploading data.");
    }
  };

  const readFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  return (
    <div className="flex flex-col gap-y-1 mt-auto mb-4">
      <details>
        <summary>Already exported your links?</summary>
        <form className="my-2">
          <label htmlFor="data">Upload your json file here:</label>
          <input
            type="file"
            name="data"
            id="data"
            accept=".json"
            onChange={handleFileChange}
            className="border p-2"
          />
        </form>
      </details>
      <details>
        <summary>Need to backup your links?</summary>
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm">This will save your data to a json file.</p>
          <button
            onClick={exportDataToCSV}
            className="px-4 py-2 bg-secondary my-2 shrink-0"
          >
            Export Links
          </button>
        </div>
      </details>
    </div>
  );
};

export default Export;
