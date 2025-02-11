import { MapPlayer, Timer } from "w3ts/index";
import type { ExtUnit } from "./ExtUnit";
// import { RGB } from "./RGB and colortext";
// import { JOB } from "Folders/Jobs/Job System";

const hintsMax = 10;

export class ExtPlayer {
	readonly mapPlayer: MapPlayer;

	realName = "";
	rename = "No Name Set";

	reputation = 0;
	payTax = true;

	hero?: ExtUnit;
	// AnimationRun: boolean = false;
	// MoveUp: boolean = false;
	// MoveDown: boolean = false;
	// MoveRight: boolean = false;
	// MoveLeft: boolean = false;
	// MoveRightSidestep: boolean = false;
	// MoveLeftSidestep: boolean = false;
	// PressSpace: boolean = false;
	// LookRight: boolean = false;
	// LookLeft: boolean = false;
	// LookTimeTillReturn: number = 0;
	// LookCurrentAngle: number = 0;
	// TurnSensitivity: number = 10;

	// hints: boolean[] = [];

	// bankBalance: number = 0;
	// bankDebt: number = 0;
	// bankDebtTimer: number = 0;
	// bankDebtPayment: number = 0;
	// bankDebtsUnpaid: number = 0;
	// bankMaxDebtsUpaid: number = 0;
	// bankDebtPenalty: number = 0;
	// bankDeductJob: boolean = false;
	// LoanPopupValue: number = 0;
	// bankDailyDeposit: number = 0;
	// bankDailyWithdraw: number = 0;

	// bankPenaltyData: { timer: number, condition: number, totalTime: number }[] = [];
	hero_type:
		| "human_male"
		| "human_female"
		| "orc_male"
		| "orc_female"
		| "nightelf_female"
		| "dwarf_male"
		| "goblin_male" = "human_male";

	// job: JOB.Job = null;
	jobsDone = 0;

	Bounty = 0;
	repTimer = 0;

	// RGBcolor: RGB = new RGB(255, 3, 3);
	// camEnable = false;
	// ThreeDMode = true;
	// camMode: number = 1;
	// mouseX: any = 0;
	// mouseY: any = 0;
	// camYaw: number = 0;
	// camPitch: number = 350;
	// camSenseYaw: any = 0.2;
	// camSensePitch: any = 0.2;
	// camSenseAccurateAim: number = 1;

	constructor(public id: number) {
		const mapPlayer = MapPlayer.fromIndex(id);
		if (!mapPlayer) {
			throw new Error(`MapPlayer with id ${id} not found`);
		}
		this.mapPlayer = mapPlayer;
	}

	public set gold(amount: number) {
		this.mapPlayer.setState(PLAYER_STATE_RESOURCE_GOLD, R2I(amount));
	}

	public get gold() {
		return this.mapPlayer.getState(PLAYER_STATE_RESOURCE_GOLD);
	}

	public set lumber(amount: number) {
		this.mapPlayer.setState(PLAYER_STATE_RESOURCE_LUMBER, R2I(amount));
	}

	public get lumber() {
		return this.mapPlayer.getState(PLAYER_STATE_RESOURCE_LUMBER);
	}

	public get handle() {
		return this.mapPlayer.handle;
	}

	public static fromHandle(handle: player): ExtPlayer {
		return ExtPlayers[GetPlayerId(handle)];
	}

	public static fromEnum() {
		const mapPlayer = MapPlayer.fromEnum();
		if (!mapPlayer) {
			throw new Error("MapPlayer from enum is undefined");
		}
		return ExtPlayer.fromHandle(mapPlayer.handle);
	}

	public static fromEvent() {
		const mapPlayer = MapPlayer.fromEvent();
		if (!mapPlayer) {
			throw new Error("MapPlayer from event is undefined");
		}
		return ExtPlayer.fromHandle(mapPlayer.handle);
	}

	public static fromFilter() {
		const mapPlayer = MapPlayer.fromFilter();
		if (!mapPlayer) {
			throw new Error("MapPlayer from filter is undefined");
		}
		return ExtPlayer.fromHandle(mapPlayer.handle);
	}

	public static fromIndex(index: number) {
		return ExtPlayers[index];
	}

	public static fromLocal() {
		return ExtPlayer.fromHandle(GetLocalPlayer());
	}

	public static get passive() {
		return ExtPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE);
	}

	public static get hostile() {
		return ExtPlayer.fromIndex(PLAYER_NEUTRAL_AGGRESSIVE);
	}

	public isPlaying() {
		return this.mapPlayer.slotState === PLAYER_SLOT_STATE_PLAYING && this.mapPlayer.controller === MAP_CONTROL_USER;
	}

	/**
     * 
     * @param player 
     * the other player
     * @param settings
        bj_ALLIANCE_UNALLIED
        bj_ALLIANCE_UNALLIED_VISION /
        bj_ALLIANCE_NEUTRAL /
        bj_ALLIANCE_NEUTRAL_VISION /
        bj_ALLIANCE_ALLIED /
        bj_ALLIANCE_ALLIED_VISION /
        bj_ALLIANCE_ALLIED_ADVUNITS 
     */
	public setAllianceState(player: MapPlayer, settings: number) {
		SetPlayerAllianceStateBJ(this.mapPlayer.handle, player.handle, settings);
	}

	public DisplayText(message: string) {
		DisplayTextToPlayer(this.mapPlayer.handle, 0, 0, message);
	}
}

export const ExtPlayers: ExtPlayer[] = [];
export const ExtPlayersUsers: ExtPlayer[] = [];

export function SetupExtPlayers() {
	try {
		for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
			ExtPlayers[i] = new ExtPlayer(i);
			// for (let l = 0; l < hintsMax; l++) {
			//     ExtPlayers[i].hints[l] = false;
			// }
		}

		Timer.create().start(0, false, () => {
			for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
				const p = ExtPlayers[i];
				if (p.isPlaying()) {
					ExtPlayersUsers.push(p);
				}
			}
		});
	} catch (e) {
		print(`SetupExtPlayers: ${e}`);
	}
}
