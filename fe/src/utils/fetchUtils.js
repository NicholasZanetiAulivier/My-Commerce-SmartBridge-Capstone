export async function fetchApi(route, method = 'GET', body = undefined, headers = undefined) {
    return await fetch("http://localhost:5000/api" + route, { method, body: body ? JSON.stringify(body) : undefined, headers: headers ? headers.toString() : undefined });
}

export function createTokenHeader() {
    const token = localStorage.getItem('token');
    let header = new Headers();
    if (token) {
        header.set("Authorization", "Bearer " + token);
        return header;
    }
    return null;
}

export async function saveToken(token) {
    localStorage.setItem('token', token);
}
