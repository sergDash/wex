export function isNone(value) {
    return value == null || (typeof value === 'number' && Number.isNaN(value))
}
export function isString(value) {
    return typeof value === 'string'
}
export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object
}
export function diffArray(a, b) {
    return a.filter(v => !b.includes(v))
}
export function inArray(item, arr) {
    return Array.isArray(arr) && arr.includes(item)
}
export function isFunction(value, isStrict) {
    if (typeof value !== 'function') {
        return false
    }
    return isStrict ? !isConstructor(value, 2) : true
}
export function isConstructor(value, strict = 0) {
    if (typeof value !== 'function') {
        return false
    }

    try {
        Reflect.construct(String, [], value)
    }
    catch {
        return false
    }

    if (strict === 0) {
        return true
    }

    const source = Function.prototype.toString.call(value)
    const prototype = value.prototype

    const isNative = /\{\s*\[native code\]\s*\}/.test(source)
    const isNativeClass = /^class\s/.test(source)

    const level4 = isNative || isNativeClass

    if (strict >= 4) {
        return level4
    }

    if (strict === 3) {
        return level4
    }

    const keys = prototype
        ? Reflect.ownKeys(prototype).filter(key => key !== 'constructor')
        : []

    const level2 = level4 || keys.length > 0

    if (strict === 2) {
        return level2
    }

    if (strict === 1) {
        return level2 || /\bthis\s*[.[]/.test(source)
    }

    return true
}
export function uniqueArray(arr, prop) {
    const exists = []

    return arr.filter((item) => {
        const value = prop ? item[prop] : item

        if (exists.includes(value)) {
            return false
        }

        exists.push(value)
        return true
    })
}
export function each(obj, fn, withDescriptors = false) {
    if (withDescriptors) {
        const descriptors = Object.getOwnPropertyDescriptors(obj)

        Reflect.ownKeys(descriptors).forEach((key) => {
            const descriptor = descriptors[key]
            const { get, set, enumerable, configurable, writable } = descriptor
            if (enumerable || get || set || (configurable && writable)) {
                fn(descriptor, key, obj)
            }
        })
        return
    }

    if (Array.isArray(obj)) {
        obj.forEach((value, key) => fn(value, key, obj))
        return
    }

    Object.keys(obj).forEach((key) => {
        fn(obj[key], key, obj)
    })
}
export function isEqual(val1, val2) {
    const equal = (obj1, obj2) => {
        const keys1 = Object.getOwnPropertyNames(obj1)
        const keys2 = Object.getOwnPropertyNames(obj2)
        const keys = unionArray(keys1, keys2)

        for (let i = 0, len = keys.length; i < len; i ++) {
            const key = keys[i]

            if (!inArray(key, keys1)) {
                return false
            }
            if (!inArray(key, keys2)) {
                return false
            }

            const value1 = obj1[key]
            const value2 = obj2[key]
            if (!isEqual(value1, value2)) {
                return false
            }
        }

        return true
    }

    if (isObject(val1) && isObject(val2)) {
        return equal(val1, val2)
    }
    else if (Array.isArray(val1) && Array.isArray(val2)) {
        return equal(val1, val2)
    }
    else {
        return val1 === val2
    }
}