import {Record} from 'immutable';
/*
	https://facebook.github.io/immutable-js/docs/#/Record

	A record is similar to a JS object, but enforce a specific set of allowed string keys,
	and have default values;

*/

const TodoRecord = Record({
	id: 0,
	description: "",
	completed: false
});

export class Todo extends TodoRecord {

	id: number;
	description: string;
	completed: boolean;

	constructor(props) {
		super(props);
	}
}