import { Timer, Unit } from "w3ts";
import { Players } from "w3ts/globals";
import { W3TS_HOOK, addScriptHook } from "w3ts/hooks";
import { Units } from "@objectdata/units";

const BUILD_DATE = compiletime(() => new Date().toUTCString());
const TS_VERSION = compiletime(() => require("typescript").version);
const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

const newUnitId = compiletime(( { objectData, constants, log }) => {
  const unit = objectData.units.get(constants.units.Footman);
  
  if (!unit) {
    return;
  }
  
  unit.modelFile = "units\\undead\\EvilArthas\\UndeadArthas.mdl";
  const newUnit = objectData.units.copy(constants.units.Footman);
  if (!newUnit) {
    return;
  }
  newUnit.name = "New Footman";
  newUnit.modelFile = "units\\undead\\EvilArthas\\UndeadArthas.mdl";
  let newUnitId = newUnit.newId

  objectData.save();
  log("Saved object data");
  return newUnitId;
}) as string;

function tsMain() {
  try {
    print(`Build: ${BUILD_DATE}`);
    print(`Typescript: v${TS_VERSION}`);
    print(`Transpiler: v${TSTL_VERSION}`);
    print(" ");
    print("Welcome to TypeScript!");

    const unit = Unit.create(Players[0], FourCC(newUnitId), 0, 0, 270)!;

    new Timer().start(1.0, true, () => {
      unit.color = Players[math.random(0, bj_MAX_PLAYERS)].color;
    });
  } catch (e) {
    print(e);
  }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
