import { Unit, Item, MapPlayer } from "w3ts/index";

export class ExtUnit extends Unit {
	public static create(owner: MapPlayer, unitId: number, x: number, y: number, face: number) {
		return Unit.create(owner, unitId, x, y, face) as ExtUnit;
	}

	/**
	 * Returns whether the unit exists.
	 * Unit ceases to exist when it is decayed or removed.
	 */
	public get exist() {
		return this.typeId != 0;
	}

	public dropItemFast(it: Item) {
		UnitRemoveItemSwapped(it.handle, this.handle);
	}

	/**Deletes the item carried by the unit */
	public removeItemByType(type: number) {
		const item = GetItemOfTypeFromUnitBJ(this.handle, type);
		if (item) {
			RemoveItem(item);
		}
	}

	public hasItemOfType(type: number) {
		return GetItemOfTypeFromUnitBJ(this.handle, type);
	}

	/**Adds exp and displays a floating text */
	public addExperience(exp: number) {
		super.addExperience(exp, false);
		const textTag = CreateTextTagUnitBJ(I2S(exp) || "", this.handle, 0, 10, 100, 100, 100, 0);
		if (textTag) {
			SetTextTagVelocityBJ(textTag, 64, 90);
			SetTextTagFadepointBJ(textTag, 0.5);
			SetTextTagPermanentBJ(textTag, false);
			SetTextTagLifespanBJ(textTag, 1.0);
		}
	}
}
