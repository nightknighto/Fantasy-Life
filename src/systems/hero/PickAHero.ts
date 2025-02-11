import { Trigger } from "w3ts/index";
import { ExtUnit } from "src/classes/ExtUnit";
import { ExtPlayer } from "src/classes/ExtPlayer";
import { ExtTrigger } from "src/classes/ExtTrigger";

const HumanMaleUnit = FourCC("H008");
const HumanFemaleUnit = FourCC("H00C");
const NightFemaleUnit = FourCC("H044");
const OrcMaleUnit = FourCC("H05D");
const OrcFemaleUnit = FourCC("H05Y");
const DwarfMaleUnit = FourCC("H01K");
const GoblinMaleUnit = FourCC("H01H");

const OrcFemaleItem = FourCC("I055");
const OrcMaleItem = FourCC("I053");
const HumanFemaleItem = FourCC("I047");
const HumanMaleItem = FourCC("I03E");
const GoblinMaleItem = FourCC("I04R");
const DwarfMaleItem = FourCC("I04Q");
const NightElfFemaleItem = FourCC("I04X");

const TooltipSubSet = FourCC("A037"); //abil id of Tool Tip (sub set)
const TooltipMasterSet = FourCC("A06P");
const ToggleTaxesBook = FourCC("A0BI");

const POINT_Town_Center = { x: 0, y: 3061 };
const POINT_Hero_Respawn = { x: -4500, y: 4100 };

const itemToUnitMap: { [key: number]: { type: ExtPlayer["hero_type"]; unit: number } } = {
	[OrcFemaleItem]: { type: "orc_female", unit: OrcFemaleUnit },
	[OrcMaleItem]: { type: "orc_male", unit: OrcMaleUnit },
	[HumanFemaleItem]: { type: "human_female", unit: HumanFemaleUnit },
	[HumanMaleItem]: { type: "human_male", unit: HumanMaleUnit },
	[GoblinMaleItem]: { type: "goblin_male", unit: GoblinMaleUnit },
	[DwarfMaleItem]: { type: "dwarf_male", unit: DwarfMaleUnit },
	[NightElfFemaleItem]: { type: "nightelf_female", unit: NightFemaleUnit },
};

export function InitializePickingHero() {
	try {
		const t = new ExtTrigger("PickAHero");

		t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);

		t.addCondition(() => {
			const manipulatedItem = GetManipulatedItem();
			if (!manipulatedItem) return false;
			const i = GetItemTypeId(manipulatedItem);
			return i in itemToUnitMap;
		});

		t.addAction(() => {
			const manipulatedItem = GetManipulatedItem();
			if (!manipulatedItem) return;
			const i = GetItemTypeId(manipulatedItem);

			const mapping = itemToUnitMap[i];
			if (!mapping) return;

			const extUnit = ExtUnit.fromEvent();
			if (!extUnit) return;

			const owner = extUnit.getOwner();
			if (!owner) return;
			const player = ExtPlayer.fromHandle(owner.handle);
			player.hero_type = mapping.type;

			if (player.hero?.exist) {
				player.hero.destroy();
			}
			const unitType = mapping.unit;
			player.hero = ExtUnit.create(player.mapPlayer, unitType, POINT_Town_Center.x, POINT_Town_Center.y, 270);
			player.hero.addAbility(TooltipSubSet);
			player.hero.addAbility(TooltipMasterSet);
			player.hero.addAbility(ToggleTaxesBook);
			player.hero.skillPoints = 2;
			PanCameraToTimedForPlayer(player.handle, player.hero.x, player.hero.y, 0.1);
			SelectUnitForPlayerSingle(player.hero.handle, player.handle);

			extUnit.destroy();
		});
	} catch (e) {
		print(`PickAHero: ${e}`);
	}
}
