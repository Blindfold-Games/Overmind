import {CombatCreepSetup} from '../../creepSetups/CombatCreepSetup';
import {CombatSetups, Roles} from '../../creepSetups/setups';
import {DirectiveInvasionDefense} from '../../directives/defense/invasionDefense';
import {CombatIntel} from '../../intel/CombatIntel';
import {OverlordPriority} from '../../priorities/priorities_overlords';
import {profile} from '../../profiler/decorator';
import {CombatZerg} from '../../zerg/CombatZerg';
import {CombatOverlord} from '../CombatOverlord';
import {log} from '../../console/log';

/**
 * Spawns ranged defenders to defend against incoming player invasions in an owned room
 */
@profile
export class BunkerRangedDefenseOverlord extends CombatOverlord {

	zealots: CombatZerg[];

	room: Room;
	directive: DirectiveInvasionDefense;

	static settings = {
		retreatHitsPercent : 0.85,
		reengageHitsPercent: 0.95,
	};

	constructor(directive: DirectiveInvasionDefense, priority = OverlordPriority.defense.bunkerRangedDefense) {
		// Only spawn inside room
		super(directive, 'bunkerRangedDefense', priority, 1, 30);
		this.zealots = this.combatZerg(Roles.bunkerRanged);
	}


	private handleDefender(zealot: CombatZerg): void {
		if (!zealot.inRampart) {
			const nearbyRampart = _.find(zealot.room.walkableRamparts, rampart => rampart.pos.getRangeTo(zealot) < 5);
			if (nearbyRampart) {
				zealot.goTo(nearbyRampart);
			}
		}
		if (zealot.room.hostiles.length > 0) {
			zealot.autoBunkerCombat(zealot.room.name);
		} else {
			// go out of way in bunker
		}
	}

	/**
	 * Computes how much *additional* ranged parts we need
	 */
	private computeNeededAdditionalRangedPotential(): number {
		const healAmount = CombatIntel.maxHealingByCreeps(this.room.hostiles);
		const towerDamage = this.room.hostiles[0] ? CombatIntel.towerDamageAtPos(this.room.hostiles[0].pos) || 0 : 0;
		const worstDamageMultiplier = _.min(_.map(this.room.hostiles,
												  creep => CombatIntel.minimumDamageTakenMultiplier(creep)));
		const zealotDamage = RANGED_ATTACK_POWER * CombatIntel.getMyCombatPotentials(this.zealots).ranged;
		const maxDamageReceived = worstDamageMultiplier * (zealotDamage + towerDamage + 1);
		const needAdditionalDamage = Math.max(healAmount - maxDamageReceived, 0);
		const neededRangedParts = needAdditionalDamage / RANGED_ATTACK_POWER;
		return neededRangedParts;
	}

	init() {
		if (this.reassignIdleCreeps(Roles.bunkerRanged, 1)) return;

		const setup = CombatSetups.zealot.default;

		const neededAdditionalRangedPotential = this.computeNeededAdditionalRangedPotential();
		if (neededAdditionalRangedPotential) {
			this.requestCreep(setup);
		}
	}

	run() {
		this.autoRun(this.zealots, zealot => this.handleDefender(zealot));
	}
}
