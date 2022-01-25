const fcfs = require('./fcfs')
const sjf = require('./sjf')
const { sortBy, arrAdd, rmvArr, findArr } = require('./util')

const groupByAt = (processes) => {
    const groups = {}
    for (let index = 0; index < processes.length; index++) {
        const process = processes[index];
        const key = `t${process.at}`
        const group = groups[key];
        if(Array.isArray(group)) group.push(process)
        else groups[key] = [process];
    }
    return groups
}


const getTimeFromKey = (key) => parseInt(key.split("t")[1])
const setProcessesSameAT = (ps, at=0) => {
    const processes = JSON.parse(JSON.stringify(ps))
    return processes.map(p=>{
        p.at=at
        return p
    })
}

const plannification = (atGroups, {thread=[], queue=[], step=0}={}) => {
    if(!Object.keys(atGroups)[step]) {

        const satqueue = setProcessesSameAT(queue)
        console.log("lastqueue: ", satqueue)
        return thread.concat(sjf(satqueue))
    }
    
    const key   = Object.keys(atGroups)[step]
    let group   = atGroups[ key ];
    const time  = getTimeFromKey(key)

    if (step>0) {

        const lastProcess = thread[ thread.length-1 ]
        const diffTime = time -  getTimeFromKey( Object.keys(atGroups)[step-1] )
        lastProcess.rburst = (lastProcess.rburst || lastProcess.burst) - diffTime
        if (lastProcess.rburst>0) {
            queue.unshift({...lastProcess, burst: lastProcess.rburst})
        }
        
    }

    queue = queue.concat(group)
    
    let selected
    if (queue.length==1) {
        selected = queue[0]
        arrAdd(thread, selected)
    } else if (queue.length>1) {
        const satqueue = setProcessesSameAT(queue)
        const ps = sjf(satqueue)
        selected = ps[0];
        const original = findArr(queue, 'name', selected.name)
        arrAdd(thread, {...selected, at: original.at})
    }
    queue = rmvArr(queue, selected)
    step++
    return plannification(atGroups,{ thread, queue, step} );
}

const srtf = (processes) => {
    const sProcesses = sortBy(processes,'at')
    const atGroups = groupByAt(sProcesses)
    console.log("atGroups: ", atGroups)
    const thread = plannification(atGroups)
    return thread;
}
/*
const processes = [
    {name:'p2',burst:1,at:1},
    {name:'p1',burst:8,at:0},
    {name:'p1.1',burst:7,at:0},
    {name:'p5',burst:1,at:6},
    {name:'p4',burst:5,at:2},
    {name:'p3',burst:7,at:1},
]
*/
const processes = [
    {name:'p1',burst:8,at:0},
    {name:'p2',burst:1,at:1},
    {name:'p3',burst:7,at:1},
    {name:'p4',burst:5,at:2},
    {name:'p5',burst:1,at:6},
]

const report = srtf(processes)
console.log("report: ",report)
