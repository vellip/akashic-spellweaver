const PATHS = {
    arcanoweaver: {
        label: "Path of the Arcanoweaver",
        implemented: true,
        abilities: {
            int: "Intelligence – prepared (magus/wizard list)",
            cha: "Charisma – spontaneous (bard/sorcerer list)",
        },
    },
    championWeaver: {label: "Path of the Champion Weaver"},
    faithweaver: {label: "Path of the Faithweaver"},
    geoweaver: {label: "Path of the Geoweaver"},
    guileweaver: {label: "Path of the Guileweaver"},
    magicweaver: {label: "Path of the Magicweaver"},
    mightweaver: {label: "Path of the Mightweaver"},
    mindweaver: {label: "Path of the Mindweaver"},
    spiritweaver: {label: "Path of the Spiritweaver"},
};

const STUDIES = {
    vicar: {label: "Vicar's Study", implemented: true},
    arsenalist: {label: "Arsenalist's Study"},
    convergent: {label: "Convergent's Study"},
    disruptor: {label: "Disruptor's Study"},
    enshaden: {label: "Enshaden's Study"},
    esotericist: {label: "Esotericist's Study"},
    formshaper: {label: "Formshaper's Study"},
    hexen: {label: "Hexen's Study"},
    impassioned: {label: "Impassioned's Study"},
    interfacer: {label: "Interfacer's Study"},
    lightbringer: {label: "Lightbringer's Study"},
    ordainer: {label: "Ordainer's Study"},
    raveler: {label: "Raveler's Study"},
    soulshaper: {label: "Soulshaper's Study"},
    spokenVoice: {label: "Spoken Voice's Study"},
    stormcaster: {label: "Stormcaster's Study"},
    transcendental: {label: "Transcendental Shaper's Study"},
};

const ABILITY_FEATURES = {
    int: [
        {
            name: "School Understanding",
            uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.ZsLwVW4LRQ5fVWRj",
            level: 1,
        },
    ],
    cha: [
        {
            name: "Bloodline Development",
            uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.F1PJ83EDZKYvA7jZ",
            level: 1,
        },
    ],
};
const DISCORD = {
    fortuitous: {
        implemented: true,
        label: "Fortuitous Discord (+2 HP per level)",
        name: "Fortuitous Discord",
        uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.mocmu7cnavlL7SoD",
    },
    insightful: {
        implemented: true,
        label: "Insightful Discord (+2 skill points per level)",
        name: "Insightful Discord",
        uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.d1mj992CBRmmxj4I",
    },
    resilient: {
        implemented: true,
        label: "Resilient Discord (good Fortitude)",
        name: "Resilient Discord",
        uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.5z9YjtP1GzE5MgSG",
    },
};
const STUDY_ABILITY = {vicar: "int"};

function renderOptions(entries, selected) {
    return Object.entries(entries)
        .map(([key, entry]) => {
            const label = typeof entry === "string" ? entry : entry.label;
            const disabled = typeof entry === "object" && !entry.implemented;

            return `<option value="${key}"${key === selected ? " selected" : ""}${disabled ? " disabled" : ""}>
                ${label}${disabled ? " (not included)" : ""}
            </option>`;
        })
        .join("");
}

function buildChoicesHTML(app, choices, discordant) {
    const id = `${app.id}-spellweaver`;
    const abilities = PATHS[choices.path]?.abilities;

    return `
    <div class="segment spellweaver-choices">
        <h2>Spellweaver</h2>

        <div class="form-group">
            <label for="${id}-path">Path of Practice</label>
            <select id="${id}-path" name="spellweaver.path">
                ${renderOptions(PATHS, choices.path)}
            </select>
        </div>

        ${
            abilities
                ? `
        <div class="form-group">
            <label for="${id}-ability">Path Primary Ability</label>
            <select id="${id}-ability" name="spellweaver.ability">
                ${renderOptions(abilities, choices.ability)}
            </select>
        </div>`
                : ""
        }

        <div class="form-group">
            <label for="${id}-study">Study in Shape</label>
            <select id="${id}-study" name="spellweaver.study">
                ${renderOptions(STUDIES, choices.study)}
            </select>
        </div>
        
        ${
            discordant
                ? `
                <div class="form-group">
                    <label for="${id}-discord">Discordant Benefit</label>
                    <select id="${id}-discord" name="spellweaver.discord">${renderOptions(DISCORD, choices.discord)}</select>
                </div>`
                : `<p class="hint">Path and study share their primary ability score: aligned.</p>`
        }

        <p class="hint">This choice is permanent and determines your spellcasting and veil list.</p>
    </div>`;
}

Hooks.on("renderLevelUpForm", (app, html) => {
    const item = app.item;
    if (item?.type !== "class" || !app.isNewClass) return;
    if (!item.getFlag("akashic-spellweaver", "isSpellweaver")) return;

    const choices = {path: "arcanoweaver", study: "vicar", ability: "int", ...app.config.spellweaver};
    if (!PATHS[choices.path]?.implemented) choices.path = "arcanoweaver";
    if (!STUDIES[choices.study]?.implemented) choices.study = "vicar";
    const abilities = Object.keys(PATHS[choices.path].abilities ?? {});
    if (abilities.length && !abilities.includes(choices.ability)) choices.ability = abilities[0];

    const discordant = choices.ability !== STUDY_ABILITY[choices.study];
    if (discordant && !DISCORD[choices.discord]) choices.discord = "fortuitous";
    if (!discordant) choices.discord = null;

    if (!foundry.utils.objectsEqual(item.getFlag("akashic-spellweaver", "choices") ?? {}, choices)) {
        app._swBaseAssoc ??= foundry.utils.deepClone(item._source.system.links?.classAssociations ?? []);
        const extra = [...(ABILITY_FEATURES[choices.ability] ?? [])];
        if (discordant) extra.push({...DISCORD[choices.discord], level: 1});

        item.updateSource({
            "system.casting.type": choices.ability === "cha" ? "spontaneous" : "prepared",
            "system.casting.ability": choices.ability,
            "system.links.classAssociations": [
                ...app._swBaseAssoc,
                ...extra.map(({name, uuid, level}) => ({name, uuid, level})),
            ],
            "flags.akashic-spellweaver.choices": choices,
        });
    }

    const form = html.is("form") ? html : html.find("form");
    form.find("> section")
        .first()
        .prepend(buildChoicesHTML(app, choices, discordant));
});

Hooks.once("init", () => {
    Handlebars.registerHelper("translate", function (key, options) {
        const {count} = options.hash;
        return game.i18n.format(`${key}.${count === 1 ? "one" : "other"}`, {count});
    });
});
