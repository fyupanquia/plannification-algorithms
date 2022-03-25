const { clone, sortBy } = require("./util")

const choose = (processesByAt) => sortBy(processesByAt, 'burst').shift()

const sjf = (ps, { executionTime = null, thread = [], report = true } = {}) => {
    if (!ps.length) return thread

    let processes = clone(ps)
    processes = sortBy(processes, 'at')
    executionTime = typeof executionTime === "number" ? executionTime : processes[0].at
    let pendingProcess = choose(processes.filter(p => p.at <= executionTime))
    const deliveredTime = executionTime + pendingProcess.burst
    pendingProcess.ex = {
        st: executionTime,
        et: deliveredTime
    }
    thread.push(pendingProcess)
    processes = processes.filter(p => p.name != pendingProcess.name)
    executionTime = deliveredTime
    return sjf(processes, { executionTime, thread, report })
}

module.exports = sjf

const processes = [
    { name: 'p1', at: 0, burst: 4 },
    { name: 'p2', at: 1, burst: 3 },
    { name: 'p3', at: 1, burst: 5 },
    { name: 'p4', at: 2, burst: 3 },
    { name: 'p5', at: 3, burst: 1 },
]
const thread = sjf(processes)
console.log(JSON.stringify(thread, null, 4))
