export function fieldRegex(str, range, min, max, type, callback) {
    let message = '';
    let result = true;
    let regex = null;
    if (range) {
        regex = /^(\d+)(\.\d+)?$/;
        result = regex.test(str);
        message = "noNumber";
        if (result) {
            if (str < min) {
                message = "small";
                result = false;
            } else if (str > max) {
                message = "large";
                result = false;
            }
        }
    }
    else {
        if (str.length < min) {
            if (str.length === 0) {
                message = "isRequired";
                result = false;
            } else {
                message = "short";
                result = false;
            }
        } else if (str.length > max) {
            message = "long";
            result = false;
        }
    }
    if (!result) {
        callback(message);
        return result;
    }
    if (type) {
        switch (type) {
            case "wholeNumber":
                regex = /^\d+$/;
                result = regex.test(str);
                message = "noWholeNumber";
                break;
            case "phone":
                regex = /^[+]?(\d+)(-\d+)*$/;
                result = regex.test(str);
                message = "noPhone";
                break;
            case "password":
                regex = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/;
                result = regex.test(str);
                message = "noPassword";
                break;
        }
    }
    if (!result) {
        callback(message);
    }
    return result;
}
