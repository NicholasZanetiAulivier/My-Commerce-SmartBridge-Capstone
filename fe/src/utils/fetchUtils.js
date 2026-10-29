import ENV from '../config/env';

export async function fetchApi(route, method = 'GET', body = undefined, headers = undefined) {
    const url = ENV.BASE_BE_URL + route;
    const config = { method, body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined };
    if (body && !(body instanceof FormData)) {
        if (!headers)
            headers = new Headers();
        headers.set('Content-Type', 'application/json');
    }

    if (headers instanceof Headers) {
        config['headers'] = headers;
    }
    if (headers instanceof Headers && headers.get('Authorization')) {
        try {
            const res = await fetch(url, config).then(res => {
                if (res.status !== 401) return res;
                else throw new Error(url + ":", "Failed");
            }).catch(e => { throw e });
            return res;
        } catch (e) {
            console.log(e);
            await fetch(ENV.BASE_BE_URL + "/user/refresh", { method: 'POST' }).then(res => {
                if (res.ok) {
                    localStorage.setItem('token', res.data.accessToken);
                }
                else throw new Error("User can't refresh");
            }).catch(e => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('type');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.setItem('logout', true);
            });
        }
        headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
        config.headers = headers.toString();
    }
    return await fetch(url, config).then(res => {
        if (res.ok) return res;
        else throw new Error(url + ":", "Failed");
    }).catch(e => { throw e });
}

export function imgString(id) {
    return ENV.BASE_BE_URL + "/product/" + id + '/image';
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
