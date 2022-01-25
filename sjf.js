const fcfs = require('./fcfs');
const { clone } = require("./util")

const sort = (ps) => {
    let processes = clone(ps)
    processes.sort((a, b) => {
        if (a.burst > b.burst) return 1;
        if (a.burst < b.burst) return -1;
        return 0;
    })
    const groupByBurst = {}
    const groupWithMoreThan1Item = []
    for (let index = 0; index < processes.length; index++) {
        const element = processes[index];
        const key = `t${element.burst}`
        if (Array.isArray(groupByBurst[key])) {
            groupByBurst[key].push(element)
            if (!groupWithMoreThan1Item.includes(key)) {
                groupWithMoreThan1Item.push(key);
            }
        }
        else groupByBurst[key] = [element]
    }
    for (let index = 0; index < groupWithMoreThan1Item.length; index++) {
        const key = groupWithMoreThan1Item[index]
        const group = groupByBurst[key];
        groupByBurst[key] = fcfs(group, { report: false })
    }

    let thread = []
    Object.keys(groupByBurst).map(key => {
        thread = [...thread, ...groupByBurst[key]]
    })
    return thread
}
const sjf = (ps, { executionTime = null, thread = [], report = true } = {}) => {
    if (!ps.length) return thread

    let processes = clone(ps)
    processes = fcfs(processes, { report: true }).thread
    executionTime = typeof executionTime === "number" ? executionTime : processes[0].at
    let pendingProcesses = processes.filter(p => p.at <= executionTime && !thread.find(tp => tp === p.name))
    let pendingProcess = sort(pendingProcesses)[0]
    thread.push(pendingProcess)
    executionTime += pendingProcess.burst
    const availableProcesses = processes.filter(p => p.name !== pendingProcess.name)
    return sjf(availableProcesses, { executionTime, thread, report })
}

module.exports = sjf
/*
const processes = [
    {name:'p1',at:0,burst:5},
    {name:'p2',at:3,burst:7},
    {name:'p2.2',at:2,burst:7},
    {name:'p3',at:3,burst:3},
    {name:'p4',at:5,burst:9},
]
*/
const processes = [
    { name: 'p1', burst: 5, at: 0 },
    { name: 'p2', burst: 7, at: 2 },
    { name: 'p3', burst: 3, at: 3 },
    { name: 'p4', burst: 9, at: 5 }
]
const thread = sjf(processes)
console.log(JSON.stringify(thread, null, 4))
