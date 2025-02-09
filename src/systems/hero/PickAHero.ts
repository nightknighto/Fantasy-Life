import { Trigger } from "w3ts/index";
import { ExtUnit } from "src/classes/ExtUnit";
import { ExtPlayer } from "src/classes/ExtPlayer";

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
const TYPE_Soul = FourCC("e000");

const itemToUnitMap: { [key: number]: { race: ExtPlayer["heroRace"]; gender: ExtPlayer["heroGender"]; unit: number } } =
	{
		[OrcFemaleItem]: { race: "orc", gender: "female", unit: OrcFemaleUnit },
		[OrcMaleItem]: { race: "orc", gender: "male", unit: OrcMaleUnit },
		[HumanFemaleItem]: { race: "human", gender: "female", unit: HumanFemaleUnit },
		[HumanMaleItem]: { race: "human", gender: "male", unit: HumanMaleUnit },
		[GoblinMaleItem]: { race: "goblin", gender: "male", unit: GoblinMaleUnit },
		[DwarfMaleItem]: { race: "dwarf", gender: "male", unit: DwarfMaleUnit },
		[NightElfFemaleItem]: { race: "nightelf", gender: "female", unit: NightFemaleUnit },
	};

export function InitializePickingHero() {
	try {
		let t = Trigger.create();

		t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);

		t.addCondition(
			Condition(() => {
				const manipulatedItem = GetManipulatedItem();
				if (!manipulatedItem) return false;
				let i = GetItemTypeId(manipulatedItem);
				return i in itemToUnitMap;
			}),
		);

		t.addAction(() => {
			try {
				const manipulatedItem = GetManipulatedItem();
				if (!manipulatedItem) return;
				let i = GetItemTypeId(manipulatedItem);

				const mapping = itemToUnitMap[i];
				if (!mapping) return;

				const extUnit = ExtUnit.fromEvent();
				if (!extUnit) return;

				const owner = extUnit.getOwner();
				if (!owner) return;
				const player = ExtPlayer.fromHandle(owner.handle);
				player.heroRace = mapping.race;
				player.heroGender = mapping.gender;

				if (player.hero?.exist) {
					player.hero.destroy();
				}

				const unitType = mapping.unit;
				player.hero = ExtUnit.create(player.mapPlayer, unitType, POINT_Town_Center.x, POINT_Town_Center.y, 270);
				// player.hero = new ExtUnit(player.mapPlayer, unitType, POINT_Town_Center.x, POINT_Town_Center.y, 270);
				player.hero.addAbility(TooltipSubSet);
				player.hero.addAbility(TooltipMasterSet);
				// player.hero.addAbility(ToggleTaxesBook);
				player.hero.skillPoints = 2;
				PanCameraToTimedForPlayer(player.handle, player.hero.x, player.hero.y, 0.1);
				SelectUnitForPlayerSingle(player.hero.handle, player.handle);

				extUnit.destroy();
			} catch (e) {
				print("Error in hero picking action: " + e);
			}
		});
	} catch (e) {
		print("PickAHero: " + e);
	}
}
