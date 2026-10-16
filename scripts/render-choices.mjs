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

const ARCHETYPES = {
    lordOfMagic: {
        label: "Lord of Magic",
    },
    lordOfVeils: {
        label: "Lord of Veils",
        implemented: true,
        classChanges: {
            "system.bab": "low",
            "system.hd": 6,
            "system.skillsPerLevel": 2,
            "system.savingThrows.ref.value": "low",
            "system.armorProf": ["lgt"],
            "system.weaponProf": ["simple"],
        },
        removeAssociations: [
            "Compendium.akashic-spellweaver.spellweaver-class.Item.FAzVNoQBLtzqLz9v",
            "Compendium.akashic-spellweaver.spellweaver-class.Item.OgsvHQTbZfWt4kfe",
            "Compendium.akashic-spellweaver.spellweaver-class.Item.bYcHj9R8HRiV1Rbv",
            "Compendium.akashic-spellweaver.spellweaver-class.Item.UOJ1BiEBRjh0xGtK",
            "Compendium.akashic-spellweaver.spellweaver-class.Item.erNRLPkHvRezduKj",
        ],
        addAssociations: [
            {
                name: "Pinnacle Chakra Binding",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.QJqNKUvND7tKbjB0",
                level: 18,
            },
            {
                name: "High Chakra Binding",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.LPBEeHShIE1VZUPN",
                level: 14,
            },
            {
                name: "Middle Chakra Binding",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.s2y4h5blzihKibjR",
                level: 8,
            },
            {
                name: "Expanded Essence",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.eWI7apmnSjMKNDiK",
                level: 2,
            },
            {
                name: "Low Chakra Binding",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.QXoyoZEbFaM8QKpN",
                level: 2,
            },
            {
                name: "Lord of Veils Veilweaving",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.mPrxD53rAHYbvf5i",
                level: 1,
            },
            {
                name: "Limited Shatters",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.GRi3t7jZKebGO04w",
                level: 1,
            },
            {
                name: "Diminished Attributes",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.IQd1jGJaI2p0Iz7c",
                level: 1,
            },
            {
                name: "Scholarly Training",
                uuid: "Compendium.akashic-spellweaver.spellweaver-class.Item.LYKL68OLfMP6bpyQ",
                level: 1,
            },
        ],
    },
    naturespeakersStudy: {label: "Naturespeaker's Study"},
    obsessionistsStudy: {label: "Obsessionist's Study"},
    none: {label: "None", implemented: true},
    soulcallersStudy: {label: "Soulcaller's Study"},
    staticSoulsStudy: {label: "Static Soul's Study"},
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
        
        <div class="form-group">
            <label for="${id}-archetype">Archetype</label>
            <select id="${id}-archetype" name="spellweaver.archetype">
                ${renderOptions(ARCHETYPES, choices.archetype)}
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

function isSpellweaverWizard(app) {
    const item = app.item;
    return item?.type === "class" && app.isNewClass && item.getFlag("akashic-spellweaver", "isSpellweaver");
}

function resolveChoices(app) {
    const choices = {
        path: "arcanoweaver",
        study: "vicar",
        ability: "int",
        archetype: "none",
        ...app.config.spellweaver,
    };
    if (!PATHS[choices.path]?.implemented) choices.path = "arcanoweaver";
    if (!STUDIES[choices.study]?.implemented) choices.study = "vicar";
    if (!ARCHETYPES[choices.archetype]?.implemented) choices.archetype = "none";
    const abilities = Object.keys(PATHS[choices.path].abilities ?? {});
    if (abilities.length && !abilities.includes(choices.ability)) choices.ability = abilities[0];

    const discordant = choices.ability !== STUDY_ABILITY[choices.study];
    if (discordant && !DISCORD[choices.discord]) choices.discord = "fortuitous";
    if (!discordant) choices.discord = null;

    return {choices, discordant};
}

// Runs before getData so the level-up form renders the updated class and associations
function applyChoices(app) {
    const item = app.item;
    const {choices, discordant} = resolveChoices(app);
    app._swChoices = {choices, discordant};

    if (!foundry.utils.objectsEqual(item.getFlag("akashic-spellweaver", "choices") ?? {}, choices)) {
        app._swBaseAssoc ??= foundry.utils.deepClone(item._source.system.links?.classAssociations ?? []);
        app._swBaseSystem ??= foundry.utils.deepClone(item._source.system);
        const touched = new Set(Object.values(ARCHETYPES).flatMap((a) => Object.keys(a.classChanges ?? {})));
        const resetChanges = Object.fromEntries(
            [...touched].map((k) => [k, foundry.utils.getProperty({system: app._swBaseSystem}, k)]),
        );
        const extra = [...(ABILITY_FEATURES[choices.ability] ?? [])];
        if (discordant) extra.push({...DISCORD[choices.discord], level: 1});

        const archetype = ARCHETYPES[choices.archetype];
        const archetypeChanges = {...(archetype.classChanges ?? {})};
        // Diminished Attributes sets Ref equal to Fort; Resilient Discord still raises Fort to the better of Ref/Will, so Ref stays good
        if (choices.discord === "resilient") delete archetypeChanges["system.savingThrows.ref.value"];
        const allAssocs = [
            ...app._swBaseAssoc,
            ...extra.map(({name, uuid, level}) => ({name, uuid, level})),
            ...(archetype.addAssociations ?? []),
        ].filter((a) => !(archetype.removeAssociations ?? []).includes(a.uuid));

        const classUpdates = {
            "system.casting.type": choices.ability === "cha" ? "spontaneous" : "prepared",
            "system.casting.ability": choices.ability,
            "system.links.classAssociations": allAssocs,
            "flags.akashic-spellweaver.choices": choices,
            "flags.akashic-spellweaver.archetype": choices.archetype,
            ...resetChanges,
            ...archetypeChanges,
        };

        item.updateSource(classUpdates);
        app.mold?.updateSource(classUpdates);
        delete app.config.associations;
        app._initData();
    }
}

Hooks.once("libWrapper.Ready", () => {
    libWrapper.register(
        "akashic-spellweaver",
        "pf1.applications.LevelUpForm.prototype.getData",
        function (wrapped, ...args) {
            if (isSpellweaverWizard(this)) applyChoices(this);
            return wrapped(...args);
        },
        "WRAPPER",
    );
});

Hooks.on("renderLevelUpForm", (app, html) => {
    if (!isSpellweaverWizard(app) || !app._swChoices) return;
    const {choices, discordant} = app._swChoices;

    const form = html.is("form") ? html : html.find("form");
    form.find("> section")
        .first()
        .prepend(buildChoicesHTML(app, choices, discordant));
});

Hooks.once("init", () => {
    Handlebars.registerHelper("translate", function (key, options) {
        const {count} = options.hash;
        return game.i18n.format(`${key}.${count === 1 ? "one" : "other"}`, {
            count,
        });
    });
});
