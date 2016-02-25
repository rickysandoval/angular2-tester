/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />

import {Component, provide, Inject} from "angular2/core";
import {List} from "immutable";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';

import {HeaderComponent} from "./header.component";
// import {TodoList} from "./TodoList";
import {Todo} from "./todo";
// import {Footer} from "./Footer";
import {TodoService} from "./todo.service";
import {LoadTodosAction, AddTodoAction, StartBackendAction, EndBackendAction, Action} from "./state/todoActions";
// import {UiState, initialUiState} from "./state/ui-state";
import {dispatcher, state, initialState} from "./di-tokens";
// import './getName';
// import {applicationStateFactory} from "./state/applicationStateFactory";
// import {ApplicationState} from "./state/application-state";


@Component({
    selector: 'my-app',
    directives: [HeaderComponent],
    templateUrl: 'app/app.component.html'
})
/*

<section id="todoapp">
                <todo-header (todo)="onAddTodo($event)"></todo-header>
                <todo-list></todo-list>
                <todo-footer [hidden]="(size | async) === 0" [count]="size | async"></todo-footer>
            </section>
            <footer id="info">
                <p>{{uiStateMessage | async}}</p>
                <p>Add, Remove and Complete TODOs</p>
            </footer>
*/
export class AppComponent {

    constructor(@Inject(dispatcher) private dispatcher: Observer<Action>,
                private todoService: TodoService) {
        this.loadInitialData();
        this.dispatcher.subscribe(function(e){
            console.log(e);
        });
    }

    // constructor(@Inject(dispatcher) private dispatcher: Observer<Action>,
    //             @Inject(state) private state: Observable<ApplicationState>,
    //             private todoService: TodoService) {

    //     this.loadInitialData();
    // }

    // get size() {
    //     return this.state.map((state: ApplicationState) => state.todos.size);
    // }

    // get uiStateMessage() {
    //     return this.state.map((state: ApplicationState) => state.uiState.message);
    // }


    onAddTodo(description) {
        let newTodo = new Todo({id:Math.random(), description});

        this.dispatcher.next(new StartBackendAction('Saving Todo...'));

        this.todoService.saveTodo(newTodo)
            .subscribe(
                res => {
                    this.dispatcher.next(new AddTodoAction(newTodo));
                    this.dispatcher.next(new EndBackendAction(null));
                },
                err => {
                    this.dispatcher.next(new EndBackendAction('Error occurred: '));
                }
            );
    }

    loadInitialData() {
        this.todoService.getAllTodos()
            .subscribe(
                res => {
                    let todos = (<Object[]>res.json().todos).map((todo: any) =>
                         new Todo({id:todo.id, description:todo.description,completed: todo.completed}));
                    console.log(todos);
                    this.dispatcher.next(new LoadTodosAction(List(todos)));
                },
                err => console.log("Error retrieving Todos")
            );

    }

}


