import {sendShatterMessage, shatterDialog} from "./shatter-dialog.mjs";

const MODULE_ID = "akashic-spellweaver";

export function setupCastInterception() {
    libWrapper.register(
        MODULE_ID,
        "pf1.documents.item.ItemSpellPF.prototype.use",
        async function (wrapped, ...args) {
            if (this.spellbook?.class === "spellweaver" && !this.system.atWill && !this.system.preparation?.value) {
                ui.notifications.warn(`${this.name} is not prepared.`);
                return null;
            }
            if (this.spellbook?.class === "spellweaver" && this.system.level === 0) {
                args[0] = {...(args[0] ?? {}), cost: 0};
                return wrapped(...args);
            }
            if (!_isSpellweavingCast(this)) {
                return wrapped(...args);
            }

            const actor = this.actor;
            if (!actor) return wrapped(...args);
            const veils = getAvailableVeils(actor);

            if (!veils.length) {
                ui.notifications.warn("No unshattered veil available.");
                return null;
            }

            // Resolve the shatter dialog BEFORE entering the action flow
            const shatterResult = await shatterDialog(actor, veils);
            if (!shatterResult) return null; // Player cancelled — cast never happens

            const options = args[0] || {};
            const modifiedOptions = foundry.utils.mergeObject(options, {
                cost: 0,
            });
            args[0] = modifiedOptions;

            const result = await wrapped(...args);
            const succeeded = result != null && !result.err && !result.reject;
            if (succeeded) {
                await shatterVeil(shatterResult.veil);
                await sendShatterMessage({slot: shatterResult.veil, effect: shatterResult.effect}, actor);
            }
            return result;
        },
        "MIXED",
    );
}

function _isSpellweavingCast(item) {
    if (!item.useSpellPoints()) return false;

    const book = item.spellbook;
    if (!book || item.system.level === 0) return false;

    return book.class === "spellweaver";
}

export function getAvailableVeils(actor) {
    return actor.items.filter(
        (i) => i.type === "akashic-magic.veil" && i.system.shaped && !i.getFlag(MODULE_ID, "shattered"),
    );
}

export async function shatterVeil(veil) {
    await veil.setFlag(MODULE_ID, "shattered", true);
}
