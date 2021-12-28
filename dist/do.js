export async function main(ns) {
    const command = ns.args.join(' ');
    const file = '/temp/exec.js';
    await ns.write(file, [
        `
    export async function main(ns) {
        ${command}
    }
    `,
    ], 'w');
    ns.run(file, 1);
}
