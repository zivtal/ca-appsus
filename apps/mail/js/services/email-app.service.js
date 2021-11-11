import { storageService } from "../../../../services/async-storage.service.js";
import { utilService } from "../../../../services/utils.service.js";

const KEY = 'mail';
_createDemo();

export const mailService = {
    query,
    remove,
    save,
    getById,
    getDraft,
    getEmptyMail,
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

function getDraft(replyId) {
    return storageService.draft(KEY, replyId);
}

function getEmptyMail(reply = null, to = null, from = null, subject = null, folder = "draft") {
    return {
        id: null,
        reply,
        folder,
        subject,
        body: null,
        isRead: true,
        isStarred: false,
        sentAt: 0,
        from,
        to,
    };
}

function _createDemo() {
    let mails = utilService.loadFromStorage(KEY);
    if (!mails || !mails.length) {
        mails = utilService.createDemo('../json/emails.json');
        utilService.saveToStorage(KEY, mails);
    }
    return mails;
}
