/** @param {NS} ns **/
export async function main(ns) {
    const start = performance.now();
    const input = JSON.parse(ns.args[0]);
    const k = input[0];
    const data = input[1];
    ns.print(k);
    ns.print(data);
    const rangeProfits = [];
    for (let i = 0; i < data.length; i++) {
        if (i == data.length)
            continue; //done
        if (i > 0 && data[i] > data[i - 1])
            continue; //found a 'starting' number smaller than the previous
        let peak = data[i + 1];
        for (let j = i + 1; j < data.length; j++) {
            ns.print(`${i} 1 ${j}`);
            while (j < data.length && data[j + 1] >= data[j])
                j++;
            ns.print(`${i} 2 ${j}`);
            if (data[j] >= peak && data[j] - data[i] > 0) {
                peak = data[j];
                // found a new range
                rangeProfits.push([i, j, data[j] - data[i], j - i]);
                ns.print(`Found range: ${i} to ${j} for ${data[j] - data[i]}`);
            }
        }
    }
    const final = [];
    for (let i = 0; i < rangeProfits.length; i++) {
        let addit = true;
        let overlaps = 0;
        const costTracker = [];
        for (let j in rangeProfits) {
            if (Number(j) == i)
                continue;
            //ns.print(`checking ${rangeProfits[i]} against ${rangeProfits[j]}`)
            if (rangeProfits[i][0] <= rangeProfits[j][0] && rangeProfits[i][1] >= rangeProfits[j][1]) {
                overlaps++;
                costTracker.push(rangeProfits[j]);
                if (rangeProfits[j][2] > rangeProfits[i][2]) {
                    //parent worth less than a single child, full discard
                    addit = false;
                    break;
                }
            }
        }
        let cost = 0;
        if (overlaps > 0) {
            //find cost
            ns.print(`Overlap with ${rangeProfits[i]} overlaps with ${costTracker}`);
            cost = rangeProfits[i][2] - costTracker.reduce((sum, x) => sum + x[2], 0);
        }
        ns.print(`${rangeProfits[i][2] + cost} < 0`);
        if (rangeProfits[i][2] + cost < 0)
            addit = false; // useless parent, doesn't provide profit at all
        if (addit) {
            rangeProfits[i].push(overlaps);
            rangeProfits[i].push(cost);
            final.push(rangeProfits[i]);
        }
    }
    ns.print('-------FINAL--------');
    final.sort((a, b) => b[2] - a[2]).forEach((x) => ns.print(x));
    ns.print('-------SPLAT--------');
    let i = 1000;
    const finalSums = [
        final
            .filter((x) => x[5] == 0)
            .sort((a, b) => b[2] - a[2])
            .slice(0, k)
            .reduce((sum, x) => sum + x[2], 0),
    ];
    while (final.filter((x) => x[5] == 0).length > k && i > 0) {
        i--; //safe escape
        const potentials = final.filter((x) => x[5] != 0);
        if (potentials.length == 0)
            continue;
        const topParent = potentials.sort((a, b) => b[5] - a[5])[0];
        for (let j = 0; j < final.length; j++) {
            // Remove children
            if (topParent[0] <= final[j][0] && topParent[1] >= final[j][1] && final[j][5] == 0) {
                final.splice(j, 1);
                j--;
            }
        }
        for (let j = 0; j < final.length; j++) {
            //Update parent to 0 cost
            if (topParent[0] == final[j][0] && topParent[1] == final[j][1]) {
                final[j][5] = 0;
            }
        }
        const newSum = final
            .filter((x) => x[5] == 0)
            .sort((a, b) => b[2] - a[2])
            .slice(0, k)
            .reduce((sum, x) => sum + x[2], 0);
        if (!finalSums.includes(newSum)) {
            ns.print('adding new sum ' + newSum);
            finalSums.push(newSum);
        }
    }
    final.sort((a, b) => b[2] - a[2]).forEach((x) => ns.print(x));
    ns.print(finalSums);
    const end = performance.now();
    const time = end - start;
    ns.tprint(`Solution is ${finalSums.sort((a, b) => b - a)[0]} (took ${ns.nFormat(time, '0.00a')}ms)`);
}
