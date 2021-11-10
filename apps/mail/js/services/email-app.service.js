import { storageService } from "../../../../services/async-storage.service.js";
import { utilService } from "../../../../services/utils.service.js";

const KEY = 'mail';
_createDemo();

export const mailService = {
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

function _createDemo() {
    let mails = utilService.loadFromStorage(KEY);
    if (!mails || !mails.length) {
        mails = utilService.createDemo('../json/emails.json');
        utilService.saveToStorage(KEY, mails);
    }
    return mails;
}
