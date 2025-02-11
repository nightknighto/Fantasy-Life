import { ExtPlayer } from "src/classes/ExtPlayer";
import { ExtTrigger } from "src/classes/ExtTrigger";
import { ExtUnit } from "src/classes/ExtUnit";
import { UT } from "src/utils/UnitTypes";
import { Item, Unit } from "w3ts";
import { Players } from "w3ts/globals";

type WeaponTypes = "unarmed" | "sword" | "bow" | "dagger" | "gloves" | "staff" | "spear" | "special";

const weaponTypeTable: { [key: number]: WeaponTypes } = {};
weaponTypeTable[FourCC("I005")] = "sword";
weaponTypeTable[FourCC("I006")] = "sword";
weaponTypeTable[FourCC("I00C")] = "bow";
weaponTypeTable[FourCC("I00E")] = "bow";
weaponTypeTable[FourCC("I00V")] = "dagger";
weaponTypeTable[FourCC("I003")] = "dagger";
weaponTypeTable[FourCC("I036")] = "gloves";
weaponTypeTable[FourCC("I037")] = "gloves";
weaponTypeTable[FourCC("I00W")] = "staff";
weaponTypeTable[FourCC("I00Y")] = "staff";
weaponTypeTable[FourCC("I03W")] = "spear";
weaponTypeTable[FourCC("I03Z")] = "spear";
weaponTypeTable[FourCC("I04W")] = "special";

const UnitVariableSkinsTable: {
	[key in ExtPlayer["hero_type"]]: {
		[key in WeaponTypes]: string;
	};
} = {
	human_male: {
		unarmed: "H008",
		sword: "H017",
		bow: "H02A",
		dagger: "H01Q",
		gloves: "H05O",
		staff: "H02S",
		spear: "H01C",
		special: "H040",
	},
	human_female: {
		unarmed: "H00C",
		sword: "H01A",
		bow: "H02C",
		dagger: "H01S",
		gloves: "H05M",
		staff: "H02U",
		spear: "H01B",
		special: "H033",
	},
	nightelf_female: {
		unarmed: "H044",
		sword: "H049",
		bow: "H045",
		dagger: "H048",
		gloves: "H04B",
		staff: "H053",
		spear: "H04A",
		special: "H04C",
	},
	orc_male: {
		unarmed: "H05D",
		sword: "H05H",
		bow: "H05L",
		dagger: "H05J",
		gloves: "H05N",
		staff: "H05K",
		spear: "H05I",
		special: "H05P",
	},
	orc_female: {
		unarmed: "H05Y",
		sword: "H062",
		bow: "H060",
		dagger: "H05V",
		gloves: "H063",
		staff: "H05U",
		spear: "H05Z",
		special: "H05W",
	},
	dwarf_male: {
		unarmed: "H01K",
		sword: "H01W",
		bow: "H01J",
		dagger: "H01M",
		gloves: "H022",
		staff: "H01Y",
		spear: "H02A",
		special: "H043",
	},
	goblin_male: {
		unarmed: "H01H",
		sword: "H02F",
		bow: "H02Y",
		dagger: "H02O",
		gloves: "H02M",
		staff: "H02I",
		spear: "H01L",
		special: "H042",
	},
};

const DummyAreaX = 0;
const DummyAreaY = 0;
const ABIL_UnequipBook = FourCC("A0BL");
const ABIL_Unequip = FourCC("A01V");

function initEquip() {
	const equipTrig = new ExtTrigger("EquipItem");

	equipTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_USE_ITEM);
	equipTrig.addCondition(() => {
		const u = Unit.fromEvent();
		if (!u) throw "Unit is undefined";

		return (
			u.isHero() &&
			u.typeId !== FourCC(UT.Werewolf) &&
			weaponTypeTable[Item.fromHandle(GetManipulatedItem())?.typeId || 0] != null
		);
	});
	equipTrig.addAction(() => {
		const u = ExtUnit.fromEvent();
		const uOwner = u?.getOwner();
		const item = Item.fromHandle(GetManipulatedItem());
		if (!u || !item || !uOwner) throw "Unit or item or player is undefined";

		const p = ExtPlayer.fromHandle(uOwner.handle);

		const weaponType = weaponTypeTable[item.typeId];
		if (!weaponType) throw "weaponType is undefined";

		const modelUnitId = UnitVariableSkinsTable[p.hero_type][weaponType];
		if (!modelUnitId) throw "modelUnitId is undefined";

		mirrorHero(u, modelUnitId);
	});
}

function mirrorHero(u: Unit, modelUnitId: string) {
	const modelUnit = Unit.create(Players[PLAYER_NEUTRAL_PASSIVE], FourCC(modelUnitId), 0, 0, 0);
	if (!modelUnit) throw "ModelUnit is undefined";

	const equipment: (Item | undefined)[] = [];
	for (let i = 0; i < 6; i++) {
		equipment[i] = u.removeItemFromSlot(i);
	}

	u.skin = modelUnit.skin;

	const strength = u.strength;
	const agility = u.agility;
	const intelligence = u.intelligence;

	u.strength = 1;
	u.agility = 1;
	u.intelligence = 1;

	modelUnit.strength = 1;
	modelUnit.agility = 1;
	modelUnit.intelligence = 1;

	modelUnit.life = (u.life / u.maxLife) * modelUnit.maxLife;
	modelUnit.mana = (u.mana / u.maxMana) * modelUnit.maxMana;

	u.maxLife = modelUnit.maxLife;
	u.life = modelUnit.life;
	u.maxMana = modelUnit.maxMana;
	u.mana = modelUnit.mana;
	u.moveSpeed = modelUnit.defaultMoveSpeed;
	u.name = modelUnit.name;
	u.nameProper = modelUnit.nameProper;
	u.acquireRange = modelUnit.defaultAcquireRange;
	u.propWindow = modelUnit.defaultPropWindow;
	u.turnSpeed = modelUnit.defaultTurnSpeed;
	u.setAttackCooldown(modelUnit.getAttackCooldown(0), 0);
	u.armor = modelUnit.armor;
	u.setDiceNumber(modelUnit.getDiceNumber(0), 0);
	u.setDiceSides(modelUnit.getDiceSides(0), 0);

	let baseDamage = modelUnit.getBaseDamage(0);
	const primaryAttribute = getUnitPrimaryAttibute(modelUnit);
	switch (primaryAttribute) {
		case "str":
			baseDamage += strength;
			break;
		case "agi":
			baseDamage += agility;
			break;
		case "int":
			baseDamage += intelligence;
			break;
	}
	u.setBaseDamage(baseDamage, 0);

	BlzSetUnitWeaponRealField(
		u.handle,
		UNIT_WEAPON_RF_ATTACK_RANGE,
		1,
		BlzGetUnitWeaponRealField(modelUnit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 0) -
			BlzGetUnitWeaponRealField(u.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 0),
	); //working. It adds value, not set it.
	BlzSetUnitWeaponRealField(
		u.handle,
		UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED,
		0,
		BlzGetUnitWeaponRealField(u.handle, UNIT_WEAPON_RF_ATTACK_PROJECTILE_SPEED, 0),
	); //working
	BlzSetUnitWeaponIntegerField(
		u.handle,
		UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE,
		0,
		BlzGetUnitWeaponIntegerField(modelUnit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0),
	); //working
	BlzSetUnitWeaponIntegerField(
		u.handle,
		UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED,
		0,
		BlzGetUnitWeaponIntegerField(modelUnit.handle, UNIT_WEAPON_IF_ATTACK_TARGETS_ALLOWED, 0),
	); //working
	BlzSetUnitWeaponIntegerField(
		u.handle,
		UNIT_WEAPON_IF_ATTACK_WEAPON_SOUND,
		0,
		BlzGetUnitWeaponIntegerField(modelUnit.handle, UNIT_WEAPON_IF_ATTACK_WEAPON_SOUND, 0),
	); //working

	const unitAttackProjectileArt = BlzGetUnitWeaponStringField(
		modelUnit.handle,
		UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART,
		0,
	) as string;
	BlzSetUnitWeaponStringField(u.handle, UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART, 0, unitAttackProjectileArt); //working! note: attack type (doesnt have field) should be missile

	const defenseType = modelUnit.getField(UNIT_IF_DEFENSE_TYPE) as number;
	u.setField(UNIT_IF_DEFENSE_TYPE, defenseType); //works

	const hitPointsRegenRate = modelUnit.getField(UNIT_RF_HIT_POINTS_REGENERATION_RATE) as number;
	u.setField(UNIT_RF_HIT_POINTS_REGENERATION_RATE, hitPointsRegenRate); //works

	const manaRegen = modelUnit.getField(UNIT_RF_MANA_REGENERATION) as number;
	u.setField(UNIT_RF_MANA_REGENERATION, manaRegen); //works

	// to restore shadow, must cast a hex on the unit

	u.strength = strength;
	u.agility = agility;
	u.intelligence = intelligence;

	modelUnit.destroy();
	for (let i = 0; i < 6; i++) {
		if (equipment[i]) u.addItem(equipment[i] as Item);
	}
	//weapon abilities, add new, remove old
	//weapon damage, add buff
	//find a way to change the primary attribute icon atleast
}

function getUnitPrimaryAttibute(u: Unit): "str" | "agi" | "int" {
	const attr = u.getField(UNIT_IF_PRIMARY_ATTRIBUTE) as number;
	switch (attr) {
		case 1:
			return "str";
		case 2:
			return "int";
		case 3:
			return "agi";
		default:
			throw `Invalid primary attribute: ${attr}`;
	}
}
export function InitializeEquipmentSystem() {
	initEquip();
}
