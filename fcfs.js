//at:arrived time
//wt:waiting time
//dt:delivery time
//st:starting time
//et: end time
const fcfs = (ps, { report = true } = {}) => {
    const processes = JSON.parse(JSON.stringify(ps))
    const thread = processes.sort((a, b) => {
        if (a.at > b.at) return 1;
        if (a.at < b.at) return -1;
        return 0;
    })
    if (!report) return thread
    const firstProcess = thread[0]
    firstProcess.ex = {
        st: firstProcess.at,
        et: firstProcess.burst
    }
    let etime = firstProcess.burst
    let awt = 0, adt = firstProcess.burst;
    for (let index = 1; index < thread.length; index++) {
        const element = thread[index];
        const wt = etime - element.at
        awt += wt
        const st = element.at + wt
        const et = st + element.burst
        element.ex = {
            st,
            et
        }
        adt += (et - element.at);
        etime += element.burst
    }

    awt = awt / thread.length
    adt = adt / thread.length
    return {
        thread,
        awt,
        adt
    }
}

module.exports = fcfs
/*
const processes = [
    { name: 'p1', at: 0, burst: 5 },
    { name: 'p2', at: 2, burst: 7 },
    { name: 'p3', at: 3, burst: 3 },
    { name: 'p4', at: 5, burst: 9 },
]
const report = fcfs(processes)
console.log(JSON.stringify(report, null, 4))
*/
