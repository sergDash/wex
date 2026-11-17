/*
 * Персистентность ключей state.storage в localStorage.
 * Формат значения: JSON.stringify(value)
 * Старые записи читаются: строка приводится к типу значения по умолчанию.
 */
export class VMLocalStorage {
    static getKey = (key) => 'JQVM_ls_' + key

    static getVal = (key) => {
        try {
            const raw = localStorage.getItem(this.getKey(key))
            return raw === null ? null : JSON.parse(raw)
        } catch (e) { return null }
    }

    static setVal = (key, val) => {
        try {
            const next = JSON.stringify(val === undefined ? null : val)
            const k = this.getKey(key)
            if (localStorage.getItem(k) !== next) localStorage.setItem(k, next)   // не пишем без изменений
        } catch (e) { /* квота или приватный режим */ }
    }

    static revive = (stored, def) => {
        if (typeof stored === 'string' && typeof def !== 'string' && def !== undefined && def !== null) {
            try { return JSON.parse(stored) } catch (e) { return def }   // старый формат
        }
        return stored
    }

    static reloadJqvmLocalStorage = (state, status) => {
        const st = state && state.storage
        if (!st || typeof st !== 'object') return

        Object.keys(st).forEach((name) => {
            if (status === '$mount') {
                const stored = this.getVal(name)
                if (stored === null) this.setVal(name, st[name])
                else st[name] = this.revive(stored, st[name])
            }
            else if (status === '$change') {
                this.setVal(name, st[name])
            }
        })
    }
}