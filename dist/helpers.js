const doc = eval('document');
/** @param {NS} ns */
export async function deployFiles(ns, servers, files) {
    for (const server in servers) {
        await ns.scp(files, 'home', server);
    }
}
/** @param {NS} ns */
export function getServers(ns) {
    const servers = ['home'];
    for (const server of servers)
        ns.scan(server)
            .filter((x) => !servers.includes(x))
            .forEach((x) => servers.push(x));
    return servers;
}
/** @param {NS} ns */
export function getRootedServers(ns) {
    for (const server of getServers(ns).filter((x) => !ns.hasRootAccess(x) && !ns.getPurchasedServers().includes(x) && x != 'home')) {
        for (const tool of [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject, ns.nuke]) {
            try {
                tool(server);
            }
            catch (e) { }
        }
    }
    return getServers(ns).filter((x) => ns.hasRootAccess(x));
}
export function getBestTarget(ns, hackingMultiplier = 0.65) {
    const servers = getServers(ns).filter((x) => ns.getHackingLevel() * hackingMultiplier > ns.getServerRequiredHackingLevel(x));
    const data = [];
    for (const target of servers) {
        if (target == 'n00dles')
            continue;
        const server = ns.getServer(target);
        const difficulty = server.minDifficulty;
        const ht_mul = 2.5 * server.requiredHackingSkill * difficulty + 500;
        const raw = server.moneyMax * server.serverGrowth;
        data.push([target, raw / ht_mul / 1e7]);
    }
    data.sort((a, b) => b[1] - a[1]);
    data.forEach((x) => ns.tprint(`${x[0]} is ${x[1]}`));
    return data[0][0];
}
export function sendTerminalCommand(command) {
    const input = doc.getElementById('terminal-input');
    input.value = command;
    const handler = Object.keys(input)[1];
    input[handler].onChange({ target: input });
    input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
