Hooks.once("init", function() {
  const path = "modules/alternative-exhaustion-5e/module/assets/exhaustion";
  const uuid = "Compendium.alternative-exhaustion-5e.exhaustion.JournalEntry.lMTExo0cxBVCDIgF.JournalEntryPage.cspWveykstnu3Zcv";
  CONFIG.DND5E.conditionEffects.halfHealth.delete("exhaustion-4");
  CONFIG.DND5E.conditionEffects.halfMovement.delete("exhaustion-2");
  CONFIG.DND5E.conditionEffects.noMovement.delete("exhaustion-5");
  CONFIG.DND5E.conditionTypes.exhaustion.levels = 10;
  CONFIG.DND5E.conditionTypes.exhaustion.icon = `${path}.svg`;
  CONFIG.DND5E.conditionTypes.exhaustion.reference = uuid;
  const exh = CONFIG.statusEffects.find(e => e.id === "exhaustion");
  foundry.utils.mergeObject(exh, CONFIG.DND5E.conditionTypes.exhaustion, {insertKeys: false});

  game.settings.register("alternative-exhaustion-5e", "manual", {
    name: "ALT_EXH.SETTING_MANUAL",
    hint: "ALT_EXH.SETTING_MANUAL_HINT",
    type: Boolean,
    default: true,
    config: true,
    scope: "world",
    requiresReload: true
  });

  if (game.settings.get("alternative-exhaustion-5e", "manual")) return;

  Hooks.on("dnd5e.preRollDeathSave", function(actor, config) {
    const exh = actor.system.attributes?.exhaustion ?? 0;
    if (exh > 0) config.parts.push("-@attributes.exhaustion");
  });

  Hooks.on("dnd5e.prepareLeveledSlots", function(spells, actor, progression) {
    const exh = actor.system.attributes?.exhaustion ?? 0;
    if (!(exh > 0)) return;
    for (const [k, v] of Object.entries(actor.system.skills ?? {})) {
      v.total -= exh;
      v.passive -= exh;
    }
    for (const [k, v] of Object.entries(actor.system.abilities ?? {})) {
      v.mod -= exh;
      v.save -= exh;
      v.dc -= exh;
    }
    actor.system.attributes.spelldc -= exh;
  });
});
