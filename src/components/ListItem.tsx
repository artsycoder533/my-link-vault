import { ChangeEvent, useState } from "react";
import { BiSave } from "react-icons/bi";
import { TbTrash, TbEdit } from "react-icons/tb";
import { Link } from "../db";

interface ListItemProps {
  link: Link;
  onEdit: (linkId: string, newTitle: string) => Promise<void>;
  onDelete: (linkId: string) => Promise<void>;
}

const ListItem = ({ link, onEdit, onDelete }: ListItemProps) => {
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");

  const handleEdit = async (linkId: string, newTitle: string) => {
    try {
      await onEdit(linkId, newTitle);
      setAllowEdit(false);
    } catch (error) {
      console.error("Error updating link title: ", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  return (
    <li
      key={link.id}
      className="flex p-1 px-2 items-center bg-zinc-700 rounded-md hover:bg-zinc-700/50 shadow-md"
    >
      {allowEdit ? (
        <>
        <label htmlFor="newTitle" className="sr-only">Edit title:</label>
          <input
            type="text"
            name="newTitle"
            id="newTitle"
            data-testid="edit-input"
            className="text-ellipsis flex-1 border p-1 text-black"
            value={newTitle}
            onChange={handleChange}
          />
          <button
            onClick={() => handleEdit(link.id as string, newTitle)}
            className="hover:outline outline-offset-4 text-xl ml-2"
            data-testid="save-button"
            aria-label="save link"
          >
            <BiSave className="" />
          </button>
        </>
      ) : (
        <>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="flex-1 whitespace-nowrap text-ellipsis py-1 overflow-hidden"
          >
            {link.title}
          </a>
          <button
            onClick={() => setAllowEdit(true)}
            className="ml-2 hover:outline outline-offset-4"
            data-testid="edit-button"
            aria-label="edit link title"
          >
            <TbEdit className="text-xl" />
          </button>
          <button
            onClick={() => onDelete(link.id as string)}
            className="text-xl text-red-500 ml-2 hover:outline outline-offset-4"
            data-testid="delete-button"
            aria-label="delete link"
          >
            <TbTrash />
          </button>
        </>
      )}
    </li>
  );
};

export default ListItem;
