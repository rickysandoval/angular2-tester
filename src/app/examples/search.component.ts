import {Component} from 'angular2/core';

import {ExampleService} from './example.service';

@Component({
	selector: 'search-example',
	templateUrl: 'app/examples/search.component.html',
	providers: [ExampleService]
})
export class SearchComponent {

	constructor(private _exampleService: ExampleService) {}

	public searchResults:any[] = [];
	public searchString:string = '';

	public runSearch() {
		this._exampleService.parametricSearch(this.searchString, (res) => {
			this.searchResults = res;
		});
	}
}