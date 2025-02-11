import { Trigger } from "w3ts";

export class ExtTrigger extends Trigger {
	/**
	 * @param name - The name associated with this trigger, for debugging purposes.
	 */
	constructor(private name: string) {
		super();
	}

	addCondition(condition: () => boolean): triggercondition | undefined {
		return super.addCondition(() => {
			try {
				return condition();
			} catch (e) {
				print(`Error in trigger '${this.name}' condition: ${e}`);
				return false;
			}
		});
	}

	addAction(actionFunc: () => void): triggeraction {
		return super.addAction(() => {
			try {
				actionFunc();
			} catch (e) {
				print(`Error in trigger '${this.name}' action: ${e}`);
			}
		});
	}
}
