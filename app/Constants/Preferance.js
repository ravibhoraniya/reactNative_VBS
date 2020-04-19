import React from 'react';
import DefaultPreference from 'react-native-default-preference';


export function storeDataIntoPreferance(key, value) {
    DefaultPreference.set(key, value).then({});
}

export function getDataFromPreferance(key, callback) {
    DefaultPreference.get(key).then(function (value) { callback(value) });
}

export function clearPreferance(callback) {
    DefaultPreference.clearAll().then(function () { callback() });;
}