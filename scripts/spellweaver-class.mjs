export async function setupClass(actor, classItem) {
    if (!actor.getFlag("akashic-magic", "veilweaver")) await actor.setFlag("akashic-magic", "veilweaver", true);
    if (!actor.getFlag("akashic-magic", "veilweavingAttr"))
        await actor.setFlag("akashic-magic", "veilweavingAttr", "int");

    const reservoir = actor.items.find((i) => i.system.tag === "classFeat_arcaneReservoir_sw");
    if (reservoir) {
        const exploits = actor.items.filter(
            (i) =>
                i !== reservoir &&
                i.system.tags?.includes("Arcanist Exploit") &&
                !i.links?.charges &&
                !i.system.uses?.per,
        );
        for (const exploit of exploits) await reservoir.createItemLink("charges", exploit);
    }
}

export function prepareSpellweaverBook(actor) {
    const books = actor.system.attributes?.spells?.spellbooks ?? {};
    const book = Object.values(books).find((b) => b.inUse && b.class === "spellweaver");
    if (!book) return;

    const available = actor.items.filter(
        (i) => i.type === "akashic-magic.veil" && i.system.shaped && !i.getFlag("akashic-spellweaver", "shattered"),
    ).length;

    book.autoSpellLevelCalculation = false;
    book.spellPoints.useSystem = true;
    book.spellPoints.maxFormula = `${available}`;
    book.spellPoints.value = available;

    const cls = actor.itemTypes.class.find((c) => (c.system.tag || pf1.utils.createTag(c.name)) === "spellweaver");
    const classLevel = cls?.system.level ?? 0;
    const spontaneous = book.spellPreparationMode === "spontaneous";

    for (let lvl = 0; lvl <= 9; lvl++) {
        const levelData = book.spells?.[`spell${lvl}`];
        if (!levelData) continue;

        levelData.base = lvl > 7 ? null : spontaneous ? spellsKnown(classLevel, lvl) : preparedPerDay(classLevel, lvl);
    }

    const equipped = actor.items.filter((i) => i.type === "equipment" && i.system.equipped);
    const heavy = equipped.some((i) => i.system.subType === "armor" && i.system.equipmentSubtype === "heavyArmor");
    const shield = equipped.some((i) => i.system.subType === "shield");
    book.arcaneSpellFailure = heavy || shield;
}

function preparedPerDay(classLevel, spellLevel) {
    if (spellLevel === 0) return classLevel >= 2 ? 4 : 3; // Arcanoweaver cantrips (prepared)
    const unlock = spellLevel * 3 - 2;
    return classLevel >= unlock ? Math.min(3, classLevel - unlock + 1) : null;
}

function spellsKnown(classLevel, spellLevel) {
    if (spellLevel === 0) return 4 + Math.min(5, Math.floor(classLevel / 2)); // 4 + one each at 2/4/6/8/10
    const unlock = spellLevel * 3 - 2;
    return classLevel >= unlock ? Math.min(5, classLevel - unlock + 2) : null;
}

export function addVeilCountFormula(doc, rollData) {
    if (!(doc instanceof Actor)) return;

    const veils = doc.items.filter((i) => i.type === "akashic-magic.veil" && i.system.shaped);
    const veilsAvailable = veils.filter((v) => !v.getFlag("akashic-spellweaver", "shattered"));

    rollData.veilCount = veils.length;
    rollData.availVeil = veilsAvailable.length;

    const book = Object.values(doc.system.attributes?.spells?.spellbooks ?? {}).find(
        (b) => b.inUse && b.class === "spellweaver",
    );
    if (book) {
        const key = book.spellPreparationMode === "spontaneous" ? "int" : "cha";
        rollData.spellweaver = {exploitMod: rollData.abilities?.[key]?.mod ?? 0};
    }
}

export function hookVeilSheet(app, html) {
    const isShattered = app.item.getFlag("akashic-spellweaver", "shattered");

    if (isShattered) {
        html.find(".sheet-header").css("position", "relative").append(`
      <div class="shattered-banner" style="
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff6b6b;
        color: white;
        padding: 4px 12px;
        font-weight: bold;
        transform: rotate(5deg);
        box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        z-index: 100;
      ">
        SHATTERED
      </div>
    `);

        const nameInput = html.find("input[name='name']");
        nameInput.css({
            "text-decoration": "line-through",
            color: "#ff6b6b",
            opacity: "0.7",
        });
    }
}

export function hookActorSheet(app, html) {
    const actor = app.object;
    const veils = app.object.items.filter((i) => i.type === "akashic-magic.veil");

    html.find(".item-list-header .veil-controls").append(
        '<a class="veil-control item-control items-unshatter" data-tooltip="Unshatter all Veils" name="unshatter"><i class="fa-solid fa-wand-magic-sparkles"></i></a>',
    );

    html.find(".items-unshatter").click(() => {
        const shattered = veils.filter((v) => v.getFlag("akashic-spellweaver", "shattered"));
        if (!shattered.length) return;
        app._forceShowVeilTab = true;
        actor.updateEmbeddedDocuments(
            "Item",
            shattered.map((v) => ({_id: v.id, "flags.akashic-spellweaver.shattered": false})),
        );
    });

    veils.forEach((v) => {
        const isShattered = v.getFlag("akashic-spellweaver", "shattered");

        if (isShattered) {
            const row = html.find(`.item#${v.id}`);
            row.find(".item-name h4").prepend("<strong class='shattered'>Shattered</strong>");
            row.find(".item-controls").append(
                '<a class="veil-control item-control item-unshatter" data-tooltip="Unshatter Veil" name="unshatter"><i class="fa-solid fa-wand-magic-sparkles"></i></a>',
            );

            row.find(".item-unshatter").on("click", (e) => {
                e.preventDefault();
                v.setFlag("akashic-spellweaver", "shattered", false);
                app._forceShowVeilTab = true;
            });
        }
    });

    // Per-level "prepared / known" counter – pf1 hides its own column while spell points are on
    const entry = Object.entries(actor.system.attributes?.spells?.spellbooks ?? {}).find(
        ([, b]) => b.inUse && b.class === "spellweaver",
    );
    if (!entry) return;

    const [bookId, book] = entry;
    const spontaneous = book.spellPreparationMode === "spontaneous";
    const spells = actor.itemTypes.spell.filter((s) => s.system.spellbook === bookId);

    for (let lvl = 0; lvl <= 7; lvl++) {
        const max = book.spells?.[`spell${lvl}`]?.base;
        if (max == null) continue;
        const levelSpells = spells.filter((s) => s.system.level === lvl && s.system.preparation?.value);
        const used = levelSpells.filter((s) => !s.system.domain).length;
        const bonusUsed = levelSpells.filter((s) => s.system.domain).length;
        const bonusMax = !spontaneous && lvl >= 1 ? 1 : 0;

        const header = html.find(`.book-${bookId}-body .spellbook-header[data-level="${lvl}"]`);
        header.find(".spellweaver-uses").remove();
        header.find(".item-name").after(
            `<div class="item-detail spellweaver-uses${used > max ? " over-limit" : ""}"
                  data-tooltip="${spontaneous ? "Spells known" : "Prepared today"}">${used} / ${max}${bonusMax ? ` <span class="bonus">(+${bonusUsed}/${bonusMax})</span>` : ""}</div>`,
        );
    }
}

const getMaxSpellLevel = (lvl) => (lvl >= 1 ? Math.min(7, Math.floor((lvl + 2) / 3)) : 0);

export function registerSpellbookLevelFilter() {
    libWrapper.register(
        "akashic-spellweaver",
        "pf1.applications.actor.ActorSheetPF.prototype._prepareSpellbook",
        function (wrapped, data, spells, bookKey) {
            const sections = wrapped(data, spells, bookKey);
            const book = this.actor.system.attributes?.spells?.spellbooks?.[bookKey];
            if (!Array.isArray(sections) || book?.class !== "spellweaver") return sections;
            const max = getMaxSpellLevel(book.cl?.autoSpellLevelTotal ?? 0);
            return sections.filter((s) => s.items?.length > 0 || s.level <= max);
        },
        "WRAPPER",
    );
}

export function automaticHeightening(actionUse) {
    const item = actionUse.shared.item;
    if (item?.type !== "spell" || item.spellbook?.class !== "spellweaver") return;
    if (!(item.system.level >= 1)) return; // cantrips aren't spellweaving casts

    const classLevel = item.spellbook.cl?.autoSpellLevelTotal ?? 0;
    if (classLevel < 4) return; // feature starts at 4th level

    const max = getMaxSpellLevel(classLevel);
    const rollData = actionUse.shared.rollData;
    if (max > (rollData.sl ?? 0)) rollData.sl = max;
}

const SPELL_LISTS = {int: ["wizard", "magus"], cha: ["bard", "sorcerer"]};

export function onPreCreateItem(item, data, options, userId) {
    if (item.type !== "spell" || userId !== game.user.id) return;
    const book = item.actor?.system.attributes?.spells?.spellbooks?.[item.system.spellbook];
    if (book?.class !== "spellweaver") return;

    const lists = SPELL_LISTS[book.ability] ?? SPELL_LISTS.int;
    const levels = lists.map((c) => item.system.learnedAt?.class?.[c]).filter(Number.isFinite);

    if (levels.length) {
        item.updateSource({"system.level": Math.min(...levels)});
    } else {
        ui.notifications.warn(`${item.name} is not on the ${lists.join("/")} spell list.`);
    }

    const max = getMaxSpellLevel(book.cl?.autoSpellLevelTotal ?? 0);
    if (item.system.level > max) {
        ui.notifications.warn(
            `${item.name} is a level ${item.system.level} spell; you can currently learn up to level ${max}.`,
        );
    }
}
