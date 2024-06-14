import Dexie, {Table} from "dexie";

export interface Link {
    id?: number;
    url: string;
    title: string;
    tag: string;
    category: string;
}

interface CustomDexie extends Dexie {
    links: Table<Link>;
}

const createDatabase = (): CustomDexie => {
    const db = new Dexie('link-vault') as CustomDexie;
    db.version(1).stores({
        links: '++id, url, title, tag, type'
    });
    return db;
}

const db = createDatabase();

export default db;