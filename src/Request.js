/**
 * Created by zhengzhaowei on 2018/3/5.
 */

import 'es6-promise';
import 'whatwg-fetch';
import queryString from 'query-string';

export default module.exports = class Request {

    contentType = {
        form: 'application/x-www-form-urlencoded',
        json: 'application/json'
    };

    state = {
        crossDomain: false,
        mode: 'no-cors', //default No Cross domain
        baseUrl: '',
        contentType: 'json',
        responseType: 'json',
        status: 200
    };

    action = {
        success: (data) => {

        },
        error: (res) => {

        },
        complete: (res) => {

        },
        catch: (e) => {

        }
    };

    set = (state) => {
        Object.assign(this.state, state);
    };

    post = (url, data, headers = {}, type = this.state.contentType) => {
        return this.fetch(this.state.baseUrl + url, data, 'POST', headers, type);
    };

    get = (url, data, headers = {}, type = this.state.contentType) => {
        return this.fetch(this.state.baseUrl + url, data, 'GET', headers, type);
    };

    put = (url, data, headers = {}, type = this.state.contentType) => {
        return this.fetch(this.state.baseUrl + url, data, 'PUT', headers, type);
    };

    delete = (url, data, headers = {}, type = this.state.contentType) => {
        return this.fetch(this.state.baseUrl + url, data, 'DELETE', headers, type);
    };

    crossDomain = (bool) => {
        this.state.crossDomain = bool;
    };

    getMode = () => {
        if(this.state.crossDomain) {
            return 'cors';
        } else {
            return this.state.mode;
        }
    };

    getBody = (data, type) => {
        let body = '';
        switch(type) {
            case 'form':
                body = queryString.stringify(data);
                break;
            case 'json':
                body = JSON.stringify(data);
                break;
        }
        return body;
    };

    fetch = (url, data, method, headers = {}, type = 'json') => {

        let body = this.getBody(data, type);
        let promise = fetch(url, {
            mode: this.getMode(),
            method: method,
            'Cache-Control': 'no-cache',
            headers: Object.assign({
                'Content-Type': this.contentType[type]
            }, headers),
            body: body
        });
        promise.then((res) => {
            this.state.status = res.status;
            if (res.ok) {
                let clone1 = res.clone(), clone2 = res.clone();
                this.action.complete(clone1);
                try {
                    if(this.state.responseType == 'json') {
                        clone2.json().then((json) => {
                            this.action.success(json);
                        });
                    }
                } catch (e) {
                    this.action.catch(e);
                }
            } else {
                this.action.error(res);
            }
        }).catch((e) => {
            this.action.catch(e);
        });
        return promise;
    };

}