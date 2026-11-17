// Псевдосервер для демо: эмулирует загрузку с прогрессом. Имена, содержащие "fail", падают на первой попытке.
(function () {
    let n = 0
    const tried = {}
    window.fakeUpload = function (file, ctx) {
        return new Promise((resolve, reject) => {
            const total = Math.max(900, Math.min(3500, file.size / 400))
            const t0 = Date.now()
            let dead = false
            ctx.onAbort(() => { dead = true; clearInterval(iv); reject(Object.assign(new Error('aborted'), { aborted: true })) })
            const iv = setInterval(() => {
                if (dead) return
                const p = Math.min(1, (Date.now() - t0) / total)
                const failing = /fail/i.test(file.name) && !tried[file.name]
                if (failing && p > 0.55) { clearInterval(iv); tried[file.name] = true; return reject(new Error('Server error 500')) }
                ctx.progress(p * 100)
                if (p >= 1) { clearInterval(iv); n++; resolve({ id: 'tmp_' + n, url: URL.createObjectURL(file) }) }
            }, 60)
        })
    }
})()