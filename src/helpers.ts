import { NS } from '../types/index';

const doc = eval('document');

/** @param {NS} ns */
export async function deployFiles(ns: NS, servers: string[], files: string[]) {
	for (const server in servers) {
		await ns.scp(files, 'home', server);
	}
}

/** @param {NS} ns */
export function getServers(ns: NS) {
	const servers = ['home'];
	for (const server of servers)
		ns.scan(server)
			.filter((x) => !servers.includes(x))
			.forEach((x) => servers.push(x));
	return servers;
}

/** @param {NS} ns */
export function getRootedServers(ns: NS) {
	for (const server of getServers(ns).filter((x) => !ns.hasRootAccess(x) && !ns.getPurchasedServers().includes(x) && x != 'home')) {
		for (const tool of [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject, ns.nuke]) {
			try {
				tool(server);
			} catch (e) {}
		}
	}
	return getServers(ns).filter((x) => ns.hasRootAccess(x));
}

export function sendTerminalCommand(command: string) {
	const input = doc.getElementById('terminal-input');
	input.value = command;
	const handler = Object.keys(input)[1];
	input[handler].onChange({ target: input });
	input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
