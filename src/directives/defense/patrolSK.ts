import {SourcePatrolOverlord} from '../../overlords/defense/sourceKeeperPatrol';
import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';


/**
 * Remote mining directive for source keeper rooms
 */
@profile
export class DirectiveSKPatrol extends Directive {

	static directiveName = 'patrolSK';
	static color = COLOR_BLUE;
	static secondaryColor = COLOR_YELLOW;

	constructor(flag: Flag) {
		super(flag, colony => colony.level >= 7);
		this.refresh();
	}

	refresh(): void {
		super.refresh();

	}

	spawnMoarOverlords() {
		this.overlords.sourcePatrol = new SourcePatrolOverlord(this);
	}

	init(): void {

	}

	run(): void {

	}
}

