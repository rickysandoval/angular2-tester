import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {List} from 'immutable';
import {Observable} from 'rxjs/Observable';

import {Todo} from './todo';

@Injectable()
export class TodoService {
	http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getAllTodos(): Observable<Response> {
		return this.http.get('build/assets/todos.json');
	}

	saveTodo(newTodo: Todo) {
		return this.http.get('build/assets/todos.json');
	}

	deleteTodo(deletedTodo: Todo) {
		console.log('delete todo: ' + deletedTodo);
	}

	toggleTodo(toggledTodo:Todo) {
		console.log('toggle todo: ' + toggledTodo);
	}
}