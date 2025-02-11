import { InitializeEquipmentSystem } from "./EquipmentSystem";
import { InitializePickingHero } from "./PickAHero";

export namespace HeroSystem {
	export function init() {
		InitializePickingHero();
		InitializeEquipmentSystem();
	}
}
