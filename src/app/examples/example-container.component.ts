import {Component} from 'angular2/core';

import {SearchComponent} from './search.component';

@Component({
	selector: 'example-container',
	templateUrl: 'app/examples/example-container.component.html',
	directives: [
		SearchComponent
	]
})
export class ExampleContainerComponent {

}