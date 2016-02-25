import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {Subject} from 'rxjs/Subject';

import {AppComponent} from './app.component';
import {TodoService} from './todo.service';
import {dispatcher} from './di-tokens';
import {Action} from './state/todoActions';


// bootstrap(App, [
//     HTTP_PROVIDERS,
//     TodoService,
//     provide(initialState, {useValue: {todos: List([]), uiState: initialUiState}}),
//     provide(dispatcher, {useValue: new Subject<Action>()}),
//     provide(state, {useFactory: applicationStateFactory, deps: [new Inject(initialState), new Inject(dispatcher)]})
// ]);

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    TodoService,
    provide(dispatcher, {useValue: new Subject<Action>()}),
]);