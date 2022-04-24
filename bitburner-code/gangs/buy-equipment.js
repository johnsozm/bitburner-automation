import { GANGS } from "/CONFIG.js"

/**
 * Buys equipment for all gang members based on current cash reserves.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!GANGS) {
        ns.tprint("Gangs must be unlocked to use this call.");
        return;
    }

    var equipment = ns.gang.getEquipmentNames().map(function(equipmentName) {
        return {
            name: equipmentName,
            cost: ns.gang.getEquipmentCost(equipmentName)
        };
    });
    equipment.sort((a, b) => a.cost - b.cost);


    while (true) {
        const members = ns.gang.getMemberNames().map(function(memberName) {
            return {
                name: memberName,
                equipment: ns.gang.getMemberInformation(memberName).upgrades
            };
        });
        
        equipment.forEach((equip) => {
            var need = [];
            members.forEach((member) => {
                if (!member.equipment.includes(equip.name)) {
                    need.push(member.name);
                }
            });

            const totalCost = need.length * equip.cost;
            if (totalCost * 2 < ns.getPlayer().money) {
                need.forEach((memberName) => {
                    ns.gang.purchaseEquipment(memberName, equip.name);
                });
            }
        });

        await ns.sleep(10000);
    }
}