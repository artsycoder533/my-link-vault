import db from "../db";
import { useLiveQuery } from "dexie-react-hooks";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "../db";
import Export from "./Export";
import FilterForm from "./FilterForm";
import ListItem from "./ListItem";

const LinkList = () => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredList, setFilteredList] = useState<Link[]>([]);
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
        <FilterForm tags={tags} categories={categories} onChange={handleChange} onReset={resetFilters}/>
        </>
        
      ) : null}
      <ul className="flex flex-col my-3 h-72 overflow-y-auto  gap-y-1 mb-3 ">
        {filteredList?.map((link) => {
          return (
            <ListItem key={link.id} link={link} onEdit={editLink} onDelete={deleteLink} />
          );
        })}
      </ul>
      <Export filteredList={filteredList} />
    </div>
  );
};

export default LinkList;

