export const utilService = {
    saveToStorage,
    loadFromStorage,
    deepCopy,
    createDemo,
};

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function createDemo(fileUrl) {
    var request = new XMLHttpRequest();
    request.open('GET', jsonFile, false);
    request.send(null);
    return JSON.parse(request.responseText);
}
