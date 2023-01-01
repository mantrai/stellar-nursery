'use strict';

export default (data) => {
    const find = (value) => {
        let result = data.filter((obj) => { return (obj.min<=value && obj.max>=value); });
        result = result.map((obj) => { return obj.payload; });
        return !result.length ? false : result.shift();
    }

    return { find }
}
