import { storageService } from "../../../../services/async-storage.service";

const KEY = 'mail';

export const bookService = {
    query,
    remove,
    save,
    getById,
};

function query() {
    return storageService.query(KEY);
}

function remove(itemId) {
    return storageService.remove(KEY, itemId);
}

function save(item) {
    if (item.id) return storageService.put(KEY, item);
    else return storageService.post(KEY, item);
}

function getById(itemId) {
    return storageService.get(KEY, itemId);
}

