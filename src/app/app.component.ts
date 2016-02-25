import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {ExampleContainerComponent} from './examples/example-container.component';

@Component({
	selector: 'my-app',
	template: `
	<div>
		<h1>{{title}}</h1>
		<nav>
			<a [routerLink]="['Examples']">Examples</a>
		</nav>
		<router-outlet></router-outlet>
	</div>
	`,
	directives: [
		ROUTER_DIRECTIVES
	],
	providers: [
		ROUTER_PROVIDERS
	]
})
@RouteConfig([
	{
		path: "/examples",
		name: "Examples",
		component: ExampleContainerComponent
	}
])
export class AppComponent {
	public title:string = 'Verical';
}