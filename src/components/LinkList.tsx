import db from "../db";
import { useLiveQuery } from "dexie-react-hooks";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "../db";
// import { TbEdit, TbTrash } from "react-icons/tb";
// import { BiSave } from "react-icons/bi";
import Export from "./Export";
import FilterForm from "./FilterForm";
import LinkItem from "./LinkItem";

const LinkList = () => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredList, setFilteredList] = useState<Link[]>([]);
  // const [allowEdit, setAllowEdit] = useState<boolean>(false);
  // const [newTitle, setNewTitle] = useState<string>("");
  // const [activeId, setActiveId] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const links = useLiveQuery(async () => db.links.toArray());
  const tags = [...new Set(links?.flatMap((link) => link.tag))];
  const categories = [...new Set(links?.flatMap((link) => link.category))];

  useEffect(() => {
    let filteredLinks = links;
    if (selectedTag) {
      filteredLinks = filteredLinks?.filter((link) => link.tag === selectedTag);
    }
    if (selectedCategory) {
      filteredLinks = filteredLinks?.filter(
        (link) => link.category === selectedCategory
      );
    }
    setFilteredList(filteredLinks || []);
  }, [links, selectedTag, selectedCategory]);

  const handleChange = (e: FormEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    if (name === "tags") {
      setSelectedTag(value);
    } else if (name === "category") {
      setSelectedCategory(value);
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      await db.links.delete(linkId);
    } catch (error) {
      console.error("error deleting link: ", error);
    }
  };

  const editLink = async (linkId: string, newTitle: string) => {
    console.log('here!!')
    try {
      await db.links.update(linkId, {
        title: newTitle,
      });
      // setAllowEdit(false);
    } catch (error) {
      console.error("Error updating link title: ", error);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
  };

  if(filteredList.length === 0){
    if(selectedTag !== '' || selectedCategory !== ''){
      return <div className="flex flex-1 flex-col">
        <p>Filter By:</p>
        {/* <form className="flex justify-between">
          <select
            name="tags"
            id="tags"
            onChange={handleChange}
            className="p-1 border text-black w-full"
          >
            <option value="" disabled selected hidden>Select Tag</option>
            {tags?.map((tag) => (
              <option key={tag} value={tag} onClick={() => setSelectedTag(tag)}>
                {tag}
              </option>
            ))}
          </select>

          <select
            name="category"
            id="category"
            onChange={handleChange}
            className="p-1 border text-black w-full"
          >
            <option value="" disabled selected hidden>Select Category</option>
            {categories?.map((category) => (
              <option
                key={category}
                value={category}
                onClick={() => setSelectedTag(category)}
              >
                {category}
              </option>
            ))}
          </select>
          <button onClick={resetFilters} className="p-2 bg-secondary w-full">
            Remove Filters
          </button>
        </form> */}
        <FilterForm tags={tags} categories={categories} onChange={handleChange} onReset={resetFilters}/>
        <p className="my-4 text-center">No links match your filters...</p>
        <Export filteredList={filteredList} />
        </div>
    } else {
      return <div className="flex flex-1 flex-col">
        <p className="my-4 text-center">Your list is empty...</p>
        <Export filteredList={filteredList} />
        </div>
    }
  }

  return (
    <div className="mt-4 flex flex-col flex-1">
      <div className="flex gap-3">
        
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters -" : "Show Filters +"}
        </button>
      </div>

      {showFilters ? (
        <>
        <p>Filter By:</p>
        {/* <form className="flex justify-between">
          <select
            name="tags"
            id="tags"
            onChange={handleChange}
            className="p-1 border text-black w-full"
          >
            <option value="" disabled selected hidden>Select Tag</option>
            {tags?.map((tag) => (
              <option key={tag} value={tag} onClick={() => setSelectedTag(tag)}>
                {tag}
              </option>
            ))}
          </select>

          <select
            name="category"
            id="category"
            onChange={handleChange}
            className="p-1 border text-black w-full"
          >
            <option value="" disabled selected hidden>Select Category</option>
            {categories?.map((category) => (
              <option
                key={category}
                value={category}
                onClick={() => setSelectedTag(category)}
              >
                {category}
              </option>
            ))}
          </select>
          <button onClick={resetFilters} className="p-2 bg-secondary w-full">
            Remove Filters
          </button>
        </form> */}
        <FilterForm tags={tags} categories={categories} onChange={handleChange} onReset={resetFilters}/>
        </>
        
      ) : null}
      <ul className="flex flex-col my-3 h-72 overflow-y-auto  gap-y-1 mb-3 ">
        {filteredList?.map((link) => {
          return (
            <LinkItem key={link.id} link={link} onEdit={editLink} onDelete={deleteLink} />
            // <li
            //   key={link.id}
            //   className="flex p-1 px-2 items-center bg-zinc-700 rounded-md hover:bg-zinc-700/50 shadow-md"
            // >
            //   {allowEdit && activeId === link.id ? (
            //     <>
            //       <input
            //         type="text"
            //         name="newTitle"
            //         id="newTitle"
            //         className="text-ellipsis flex-1 border p-1 text-black"
            //         value={newTitle}
            //         onChange={(e) => setNewTitle(e.target.value)}
            //       />
            //       <button
            //         onClick={() => editLink(link?.id as string, newTitle)}
            //         className="hover:outline outline-offset-4 text-xl ml-2"
            //       >
            //         <BiSave className="" />
            //       </button>
            //       <button
            //         onClick={() => deleteLink(link?.id as string)}
            //         className="text-xl text-red-500 ml-2 hover:outline outline-offset-4"
            //       >
            //         <TbTrash />
            //       </button>
            //     </>
            //   ) : (
            //     <>
            //       <a
            //         href={link.url}
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         referrerPolicy="no-referrer"
            //         className="flex-1 whitespace-nowrap text-ellipsis py-1 overflow-hidden"
            //       >
            //         {link.title}
            //       </a>
            //       <button
            //         onClick={() => {
            //           setAllowEdit(true);
            //           setNewTitle(link.title);
            //           setActiveId(link?.id as string);
            //         }}
            //         className="ml-2 hover:outline outline-offset-4"
            //       >
            //         <TbEdit className="text-xl" />
            //       </button>
            //       <button
            //         onClick={() => deleteLink(link?.id as string)}
            //         className="text-xl text-red-500 ml-2 hover:outline outline-offset-4"
            //       >
            //         <TbTrash />
            //       </button>
            //     </>
            //   )}
            // </li>
          );
        })}
      </ul>
      <Export filteredList={filteredList} />
    </div>
  );
};

export default LinkList;

