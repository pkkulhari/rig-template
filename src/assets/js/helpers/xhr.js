export const xhr = function (url, method = 'GET', data = '') {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = () => {
            resolve(xhr.response);
        }
        xhr.open(method, url);
        xhr.send(data);
    });

    return promise;
}

export const msg = 'Hello World';