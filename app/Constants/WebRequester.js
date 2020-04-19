import {
    ToastAndroid
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";

export function webRequest(url, params, callback) {

    console.log('===================')
    console.log("URL:- ", url)
    console.log("PARAMETER:- ", params)
    console.log('===================')

    NetInfo.fetch().then(isConnected => {
        if (isConnected) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log("RESPONSE:- ", json)
                    if (json.status == '0') {
                        let msg = '';
                        msg = json.message
                        callback(new Error(msg), json)
                    } else {
                        callback(null, json)
                    }
                })
                .catch((err) => {
                    console.log("ERROR WEB:- ", err)
                    callback(err, null)
                })
        } else {
            ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
            callback(null, null)
        }
    })


}


export function webRequestWithToken(url, params, token, callback) {

    console.log('===================')
    console.log("URL:- ", url)
    console.log("PARAMETER:- ", params)
    console.log("TOKEN:- ", token)
    console.log('===================')

    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
            fetch(url, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': token,
                    'Accept': 'application/json'
                },
                body: params
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log("RESPONSE:- ", json)
                    if (json.status == '0') {
                        let msg = json.error
                        callback(new Error(msg), json)
                    }
                    else {
                        callback(null, json)
                    }
                })
                .catch((err) => {
                    console.log("ERROR WEB:- ", err)
                    callback(err, null)
                })
        } else {
            ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
            callback(null, null)
        }
    });


}

export function multipartRequest(url, params, token, callback) {

    console.log('===================')
    console.log("URL:- ", url)
    console.log("PARAMETER:- ", params)
    console.log("TOKEN:- ", token)
    console.log('===================')

    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                    'token': token
                },
                body: params
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log("RESPONSE:- ", json)
                    if (json.status == '0') {
                        let msg = json.error
                        callback(new Error(msg), json)
                    }
                    else {
                        callback(null, json)
                    }
                })
                .catch((err) => {
                    console.log("ERROR WEB:- ", err)
                    callback(err, null)
                })
        } else {
            ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
            callback(null, null)
        }
    });


}