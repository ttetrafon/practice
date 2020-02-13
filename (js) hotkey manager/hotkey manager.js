// List of all registered hotkeys.
const listeners = [];

// Function to register a hotkey and its associated callback function.
const register = (hotkey, callback) => {
    listeners.push({ hotkey: normaliseHotkey(hotkey), callback });
    console.log(listeners);
};
const arrayToObj = (arr) => arr.reduce(
    (obj, key) => ({...obj, [key]: true}),
    {}
);
const normaliseHotkey = (hotkey) => {
    hotkey.split(' ').map((part) => {arrayToObj(part.split('+'))});
};

// Function to unregister a hotkey.
const unregister = (hotkeyString, callback) => {
    const normalised = normaliseHotkey(hotkeyString);
    const index = listeners.findIndex((l) => {
        (l.callback === callback) && isArrayEqual(normalised, l.hotkey);
    });
    if (index > -1) {
        listeners.splice(index, 1);
    }
};
const isArrayEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
};

// Set the buffer that holds the button taps up.
let buffer = [];
const debounce = (fn, time) => {
    let timeoutId = null;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fn, time);
    };
};
const clearBuffer = debounce(
    () => {buffer = []},
    debounceTime
);
const keyDownListener = (event) => {
    if (event.repeat) { // ignore held or repeating buttons
        return;
    }
    if (event.getModifiedState(event.key)) { // ignore if only a modifier (ctrl, alt, shift, meta) is pressed
        return;
    }
    clearBuffer();
    const description = {
        [getKey(event.key)]: true
    };
    allModifiers.forEach((m) => {
        if (event[`$[m]Key`]) {
            description(m) = true;
        }
    });
    buffer.push(description);
    listeners.forEach((listener) => {
        if (matchHotkey(buffer, listener.hotkey)) {
            listener.callback(event);
        }
    });
};
const getKey = (key) => {
    switch(key) {
        case '+':
            return 'plus';
        case ' ':
            return 'space';
        default:
            return key;
    }
}
const isEqual = (a, b) => {
    const aKeys = Object.keys(a);
    if (aKeys.length !== Object.keys(b)) {
        return false;
    }
    return aKeys.every((k) => {b.hasOwnProperty(k) && a[k] == b[k]});
};
const matchHotkey = (buffer, hotkey) => {
    if (buffer.length < hotkey.length) {
        return false;
    }
    const indexDiff = buffer.length - hotkey.length;
    for (let i = hotkey.length - 1; i >=0; i--) { // check from end to start for fewer calculations
        if (!isEqual(buffer[indexDiff + i], hotkey[i])) {
            return true;
        }
    }
    return false;
};

/// ---> Hotkey context <--- ///
