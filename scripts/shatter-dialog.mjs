import {getAvailableVeils, shatterVeil} from "./cast-interception.mjs";

const effects = {
    bolsteringEssence: {
        label: "Bolstering Essence",
        description:
            "The spellweaver chooses one of their essence receptacles and treats it as invested with 1 additional point of essence for all purposes for as long as the veil remains shattered; this can bypass its maximum essence capacity and doesn't stack with similar effects (such as akashic catalysts). If 4 or more points of essence were burned, it is instead treated as invested with 2 additional essence. If 7 or more were burned, it is treated as 3 additional instead.",
        baseDescription:
            "The spellweaver chooses one of their essence receptacles and treats it as invested with 1 additional point of essence for all purposes for as long as the veil remains shattered; this can bypass its maximum essence capacity and doesn't stack with similar effects (such as akashic catalysts). If 4 or more points of essence were burned, it is instead treated as invested with 2 additional essence. If 7 or more were burned, it is treated as 3 additional instead.",
    },
    burningWill: {
        label: "Burning Will",
        description:
            "The spellweaver gains a +%burning% insight bonus to their Will saving throws for as long as the veil remains shattered.",
        baseDescription:
            "The spellweaver gains a +1 insight bonus to their Will saving throws for as long as the veil remains shattered. This bonus increases by an additional +1 for every 2 points of essence burned beyond the first.",
    },
    wardingShatter: {
        label: "Warding Shatter",
        description:
            "The spellweaver gains spell resistance equal to %warding% (10 + their class level + 1 per point of essence burned) for as long as the veil remains shattered. This spell resistance only applies against harmful effects.",
        baseDescription:
            "The spellweaver gains spell resistance equal to 10 + their class level + 1 per point of essence burned for as long as the veil remains shattered. This spell resistance only applies against harmful effects.",
    },
};

export async function sendShatterMessage(form, actor) {
    const essences = Number(form.slot.system.investedEssence) || 0;
    const effect = effects[form.effect];
    const formatContext = {
        actor: actor.name,
        slotLink: form.slot.link,
        essences,
        effect: effect.label,
    };
    const message =
        essences === 1
            ? game.i18n.format("card.message.one", formatContext)
            : game.i18n.format("card.message.other", formatContext);
    const content = await foundry.applications.handlebars.renderTemplate(
        "modules/akashic-spellweaver/templates/shatter-result.hbs",
        {message, effect},
    );

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({actor: actor}),
        content,
        flags: {"akashic-spellweaver": {veilId: form.slot.id, essence: essences, effect: form.effect}},
    });
}

export async function shatterDialog(actor, veils) {
    const {DialogV2} = foundry.applications.api;

    const data = {
        slots: veils.map((v) => ({
            slot: v.system.shapedTo,
            id: v.id,
            bound: v.system.bound,
            essence: v.system.investedEssence,
        })),
        effects,
    };
    const form = await DialogV2.wait({
        window: {
            title: "Shattering a Veil",
        },
        position: {
            width: 480,
        },
        render: (event, dialog) => {
            const effectSelect = dialog.element.querySelector("#shatter-effect");
            const slotsSelect = dialog.element.querySelector("#shatter-slots");

            effectSelect.addEventListener("change", () => {
                const id = effectSelect.value;
                dialog.element.querySelectorAll(`.effect-description`).forEach((el) => {
                    el.classList.toggle("hidden", el.dataset.effect !== id);
                });
                updateBurningPowerText(dialog, actor, id, slotsSelect);
            });

            slotsSelect.addEventListener("change", () => {
                const id = effectSelect.value;
                updateBurningPowerText(dialog, actor, id, slotsSelect);
            });
        },
        content: await foundry.applications.handlebars.renderTemplate(
            "modules/akashic-spellweaver/templates/shatter-dialog.hbs",
            data,
        ),
        buttons: [
            {
                action: "cancel",
                label: "Cancel",
            },
            {
                label: "Shatter",
                action: "shatter",
                default: true,
                callback: (event, button) => new foundry.applications.ux.FormDataExtended(button.form).object,
            },
        ],
    });
    if (!form || typeof form !== "object" || !form.slot || !form.effect) {
        return undefined;
    }

    const veil = veils.find((v) => v.id === form.slot);

    return {
        veil,
        effect: form.effect,
    };
}

function updateBurningPowerText(dialog, actor, id, slotsSelect) {
    const option = slotsSelect.options[slotsSelect.selectedIndex];
    const essences = parseInt(option.dataset.essences);
    const selectedEffectText = dialog.element.querySelector(`[data-description="${id}"]`);

    selectedEffectText.textContent = effects[id].description.replace(/%warding%|%burning%/, (string) => {
        if (string === "%warding%") return 10 + (actor.classes.spellweaver?.level ?? 0) + essences;
        if (string === "%burning%") return Math.ceil(essences / 2);
    });
}

export async function skipShatterRollDialog(wrapped, ...args) {
    if (!this.getFlag("akashic-spellweaver", "shatter")) return wrapped(...args);

    const veils = getAvailableVeils(this.actor);
    if (!veils.length) {
        ui.notifications.warn("No unshattered veil available.");
        return null;
    }
    const choice = await shatterDialog(this.actor, veils);
    if (!choice) return null;

    args[0] = {...(args[0] ?? {}), skipDialog: true};
    const result = await wrapped(...args);
    if (result != null && !result.err && !result.reject) {
        await shatterVeil(choice.veil);
        await sendShatterMessage({slot: choice.veil, effect: choice.effect}, this.actor);
    }
    return result;
}
