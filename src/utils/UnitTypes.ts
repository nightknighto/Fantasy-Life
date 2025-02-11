export namespace UT {
	export const Archer = "h00M";
	export const DwarfArch = "h04F";
	export const DwarfMage = "h04H";
	export const DwarfSold = "h04G";
	export const GobMage = "h04I";
	export const GobArch = "h04K";
	export const GobSold = "h04M";
	export const Mage = "h01P";
	export const NEMage = "h054";
	export const NEArch = "h052";
	export const NESold = "h051";
	export const OrcSold = "h05E";
	export const OrcMage = "h05F";
	export const Soldier = "h00L";
	export const OrcArch = "h05G";

	export const TheDestroyer = "h059";
	export const BladeMaster = "h055";
	export const CastleProtector = "h04W";
	export const EliteArcher = "h056";
	export const EliteSoldier = "h04U";
	export const Halberdier = "h04P";
	export const Raider = "h05R";
	export const HolyMonk = "h04V";
	export const FireEngine = "h04R";
	export const UltimateMEKA = "n026";

	export const HumanBarracks = "h00K";
	export const HumanBarracks2 = "h04X";
	export const DwarfBarracks = "h04S";
	export const DwarfBarracks2 = "h04T";
	export const GoblinBarracks = "h04L";
	export const GoblinBarracks2 = "h04Q";
	export const ElfBarracks = "h057";
	export const ElfBarracks2 = "h058";
	export const OrcBarracks = "h05S";
	export const OrcBarracks2 = "h05T";

	export const SamuraiGuard = FourCC("h06Y");
	export const SamuraiWarrior = FourCC("h06Z");

	export const KingSoldiers: string[] = [
		UT.Soldier,
		UT.Mage,
		UT.Archer,
		UT.DwarfArch,
		UT.DwarfMage,
		UT.DwarfSold,
		UT.GobMage,
		UT.GobArch,
		UT.GobSold,
		UT.NEMage,
		UT.NEArch,
		UT.NESold,
		UT.OrcSold,
		UT.OrcArch,
		UT.OrcMage,
	];

	export const DoorSwitch = "h023";

	export const Soul = "e000";
	export const CommandsDummy = "e00Y";
	export const Chocobo = FourCC("h061");

	export const Wine_Horse = "h06N"; //CHANGE NAME

	export const House_Deed = "n00E";
	export const Chicken_Coup = "h015";
	export const Farm = "h010";

	export const Officer = "h026";

	export const LandlordApart = "n022";
	export const LandlordSmall = "n00D";
	export const LandlordMedium = "n00F";
	export const LandlordLarge = "n00G";
	export const LandlordMansion = "n00H";
	export const Pillow = "h02J";

	export const Landlords: string[] = [
		UT.LandlordApart,
		UT.LandlordSmall,
		UT.LandlordMedium,
		UT.LandlordLarge,
		UT.LandlordMansion,
	];

	export const Villager_MaleYouth = "n00W";
	export const Villager_FemaleYouth = "n00Z";
	export const Villager_MaleAdult = "n00V";
	export const Villager_FemaleAdult = "n00Y";
	export const Villager_MaleElder = "n00X";
	export const Villager_FemaleElder = "n010";
	export const Villager_Male = "nvl2";
	export const Villager_Male2 = "nvil";

	export const Villagers: string[] = [
		UT.Villager_MaleYouth,
		UT.Villager_FemaleYouth,
		UT.Villager_MaleAdult,
		UT.Villager_FemaleAdult,
		UT.Villager_MaleElder,
		UT.Villager_FemaleElder,
		UT.Villager_Male,
		UT.Villager_Male2,
	];

	export const RitualCircle = "h020";

	export const BottomArea_SkeletonWarrior = FourCC("n02C");
	export const BottomArea_SkeletonArcher = FourCC("n02D");

	export const Bandits_Renegade = "h02L";
	export const Bandits_Thief = "h038";
	export const Bandits_RenegadeSergeant = "h03T";

	export const Cultist_merc = "n027";

	export const Werewolf = "H006";

	export const Demonic_Warrior = "n02E";
	export const Demonic_Soldier = "n00S";
	export const Demonic_Entity = "n00M";

	export const Street_Light = FourCC("h025");
	export const Street_Light_Source = FourCC("h028");
	export const Practice_Dummy = FourCC("h03W");
	export const Practice_DummyRange = FourCC("h06O");

	export const Jobs = {
		zombie: FourCC("h04N"),
		HotSteel: FourCC("h05B"),
		Rock_Chunk: FourCC("h00F"),
	};

	export const nonRespawningCreep = [
		UT.BottomArea_SkeletonWarrior,
		UT.BottomArea_SkeletonArcher,
		UT.Practice_Dummy,
		UT.Practice_DummyRange,
		...Object.values(UT.Jobs),
	];

	/**
	 * Checks if a given typeId is present in the provided array of numbers.
	 *
	 * @param typeId - The number to check for in the array.
	 * @param array - The array of numbers to search within.
	 * @returns A boolean indicating whether the typeId is found in the array.
	 */
	export function isTypeInArray(typeId: number, array: number[]): boolean {
		try {
			for (const numb of array) {
				if (typeId === numb) {
					return true;
				}
			}
			return false;
		} catch (e) {
			print(`isAnyOfThoseForArray: ${e}`);
			throw e;
		}
	}

	/**
	 * Checks if a given type ID exists within an object where the values are numbers.
	 *
	 * @param typeId - The type ID to check for.
	 * @param array - An object where the keys are strings and the values are numbers.
	 * @returns `true` if the type ID exists in the object, otherwise `false`.
	 */
	export function isTypeInObject(typeId: number, array: { [key: string]: number }): boolean {
		try {
			for (const k in array) {
				if (typeId === array[k]) {
					return true;
				}
			}
			return false;
		} catch (e) {
			print(`isAnyOfThoseForArray: ${e}`);
			throw e;
		}
	}
}
