import {skipShatterRollDialog} from "./shatter-dialog.mjs";
import {
    addVeilCountFormula,
    automaticHeightening,
    hookActorSheet,
    hookVeilSheet,
    onPreCreateItem,
    prepareSpellweaverBook,
    registerSpellbookLevelFilter,
    setupClass,
} from "./spellweaver-class.mjs";
import {setupCastInterception} from "./cast-interception.mjs";
import "./render-choices.mjs";

console.log("Spellweaver | Module loading");

Hooks.on("pf1ClassLevelChange", (actor, classItem, currentLevel, newLevel) => {
    if (!classItem.getFlag("akashic-spellweaver", "isSpellweaver")) return;
    setupClass(actor);
});

Hooks.once("libWrapper.Ready", () => {
    libWrapper.register(
        "akashic-spellweaver",
        "pf1.documents.item.ItemPF.prototype.use",
        skipShatterRollDialog,
        "MIXED",
    );
    setupCastInterception();
    registerSpellbookLevelFilter();
});

Hooks.on("pf1PrepareBaseActorData", prepareSpellweaverBook);

Hooks.on("renderVeilItemSheet", (app, html, data) => {
    hookVeilSheet(app, html);
});

Hooks.on("renderActorSheet", (app, html, data) => {
    hookActorSheet(app, html);
});

Hooks.on("pf1GetRollData", (item, rollData) => {
    addVeilCountFormula(item, rollData);
});

Hooks.on("pf1CreateActionUse", (actionUse) => {
    automaticHeightening(actionUse);
});

Hooks.on("preCreateItem", (item, data, options, userId) => {
    onPreCreateItem(item, data, options, userId);
});
