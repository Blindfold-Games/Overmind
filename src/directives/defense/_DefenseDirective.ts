import {CombatOverlord} from '../../overlords/CombatOverlord';
import {Overlord} from '../../overlords/Overlord';
import {Overseer} from '../../Overseer';
import {Directive} from '../Directive';
import {Colony} from '../../Colony';

export abstract class DefenseDirective extends Directive {

	constructor(flag: Flag, colonyFilter?: (colony: Colony) => boolean) {
		super(flag, colonyFilter);
		(<Overseer>Overmind.overseer).combatPlanner.directives.push(this);
	}

	get overlord(): CombatOverlord {
		return (<CombatOverlord>_.filter(this.overlords, overlord => overlord instanceof CombatOverlord)[0]);
	}
}
