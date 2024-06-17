import "fake-indexeddb/auto";

import Dexie, { Table } from 'dexie';
import { Link } from '../db';

interface CustomDexie extends Dexie {
    links: Table<Link, number>;
}

const createMockDatabase = (): CustomDexie => {
    const db = new Dexie('TestDb') as CustomDexie;
    db.version(1).stores({
        links: '++id, url, title, tag, category'
    });
    return db;
}

const mockDb = createMockDatabase();

export default mockDb;