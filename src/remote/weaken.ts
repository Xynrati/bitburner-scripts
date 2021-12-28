import { NS } from "/../types/index";

export async function main(ns:NS) {
    await ns.weaken(ns.args[0] as string);
}