import { NS } from '../types/index.js';
import { getRootedServers } from 'helpers.js';

export async function main(ns: NS) {
	const victim = (ns.args[0] as string) || 'joesguns';
	const scripts = ['/Remote/weaken.js', '/Remote/grow.js'];
	const scriptRam = 1.75;
	const servers = getRootedServers(ns);
	ns.tprint('Throw caution to the wind');

	for (const server of servers) {
		if (server != 'home') ns.killall(server);
		await ns.scp(scripts, 'home', server);
	}

	while (true) {
		let action = 'grow';
		if (ns.getServerMinSecurityLevel(victim) < ns.getServerSecurityLevel(victim)) action = 'weaken';
		for (const server of servers) {
			const freeThreads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / scriptRam);
			if (freeThreads > 0) ns.exec(`/Remote/${action}.js`, server, freeThreads, victim);
		}
		await ns.sleep(1);
	}
}