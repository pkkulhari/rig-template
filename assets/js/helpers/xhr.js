function xhr(url) {   
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = () => {
            resolve(xhr.response);
        }
        xhr.open("GET", url);
        xhr.send();
    });
    
    return promise;
}