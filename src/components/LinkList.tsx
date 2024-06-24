import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "../db";
import Export from "./Export";
import FilterForm from "./FilterForm";
import ListItem from "./ListItem";
import Dexie from "dexie";

interface LinkListProps {
  dbInstance: Dexie & { links: Dexie.Table<Link, number> };
}

const LinkList = ({dbInstance}: LinkListProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredList, setFilteredList] = useState<Link[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [links, setLinks] = useState<Link[]>([]);
  
  const tags = [...new Set(links?.flatMap((link) => link.tag))];
  const categories = ["website", "tool", "blog", "youtube", "course", "documentation", ];

  const fetchLinks = useCallback(async () => {
    try {
      const fetchedLinks = await dbInstance.links.toArray();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links:", error);
      return [];
    }
  }, [dbInstance]);  // 

  useEffect(() => {
    fetchLinks();
  }, [dbInstance, fetchLinks]);

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

  const deleteLink = async (linkId: number) => {
    try {
      await dbInstance.links.delete(linkId);
      fetchLinks();
    } catch (error) {
      console.error("error deleting link: ", error);
    }
  };

  const editLink = async (linkId: number, newTitle: string) => {
    try {
      await dbInstance.links.update(linkId, {
        title: newTitle,
      });
      fetchLinks();
    } catch (error) {
      console.error("Error updating link title: ", error);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
  };

  if (filteredList.length === 0) {
    if (selectedTag !== "" || selectedCategory !== "") {
      return (
        <div className="flex flex-1 flex-col">
          <p>Filter By:</p>
          <FilterForm
            tags={tags}
            categories={categories}
            onChange={handleChange}
            onReset={resetFilters}
          />
          <p className="my-4 text-center">No links match your filters...</p>
          <Export list={filteredList} />
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col">
          <p className="my-4 text-center">Your list is empty...</p>
          <Export list={filteredList} />
        </div>
      );
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
          <FilterForm
            tags={tags}
            categories={categories}
            onChange={handleChange}
            onReset={resetFilters}
          />
        </>
      ) : null}
      <ul className="flex flex-col my-3 h-72 overflow-y-auto  gap-y-1 mb-3 ">
        {filteredList?.map((link) => {
          return (
            <ListItem
              key={link.id}
              link={link}
              onEdit={editLink}
              onDelete={deleteLink}
            />
          );
        })}
      </ul>
      <Export list={links} />
    </div>
  );
};

export default LinkList;
