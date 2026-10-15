export async function fetchApi(route, method = 'GET', body = undefined, headers = undefined) {
    const url = "http://localhost:5000/api" + route;
    const config = { method, body: body ? JSON.stringify(body) : undefined, headers: headers ? headers.toString() : undefined };
    if (headers instanceof Headers && headers.get('Authorization')) {
        try {
            const res = await fetch(url, config).then(res => {
                if (res.ok) return res;
                else throw new Error(url + ":", "Failed");
            }).catch(e => { throw e });
            return res;
        } catch (e) {
            await fetchApi("/user/refresh", 'POST').then(res => {
                if (res.ok) localStorage.setItem('token', res.data.accessToken);
                else throw new Error("User can't refresh");
            });
        }
    }
    return await fetch(url, config).then(res => {
        if (res.ok) return res;
        else throw new Error(url + ":", "Failed");
    }).catch(e => { throw e });
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
