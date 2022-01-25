module.exports.clone = (obj) => JSON.parse(JSON.stringify(obj))
module.exports.sortBy = (processes, field) => processes.sort(function (a, b) {
    if (a[field] > b[field]) return 1;
    if (a[field] < b[field]) return -1;
    return 0;
})


module.exports.arrAdd = (queue, process) => {
    //const find = queue.find(sp => sp.name === process.name)
    const last = queue[queue.length - 1]
    if (last && last.name === process.name) return
    //if(find) return 
    queue.push(process)
}
module.exports.rmvArr = (queue, process) => {
    const newqueue = []
    for (let index = 0; index < queue.length; index++) {
        const startedProcess = queue[index];
        if (startedProcess.name != process.name)
            newqueue.push(startedProcess)
    }
    return newqueue;
}
module.exports.findArr = (arr, field, value) => arr.find(obj => obj[field] === value)