import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync,
  TestComponentBuilder,
  ComponentFixture
} from 'angular2/testing';

import {provide} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {ExampleService} from './example.service';
import {SearchComponent} from './search.component';

const MOCK_RESULTS = [{ "mpn" : "BAV99W,115"}, {"mpn" : "BAV99,235"}, {"mpn" : "BAV99TR"}, {"mpn" : "BAV99W@115"}, {"mpn" : "BAV99-7-F"}, {"mpn" : "BAV99W-7-F"}, {"mpn" : "BAV99W,135"}, {"mpn" : "BAV99LT1G"}, {"mpn" : "BAV99S@115"}, {"mpn" : "BAV99BRVA-7"}, {"mpn" : "BAV99 RF"}, {"mpn" : "BAV99/8,215"}, {"mpn" : "BAV99"}, {"mpn" : "BAV99BRV-7"}, {"mpn" : "BAV99WT1G"}];

class MockExampleService {
	public parametricSearch(term, callback) {
		callback(MOCK_RESULTS);
	}
}

describe('examples >> SearchComponent', () => {
	let searchComponentFixture:ComponentFixture;

	// beforeEachProviders(() => {
	// 	provide(ExampleService, {useClass: MockExampleService})
	// }); this wont work because ExampleService listed as proivder on component
	beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
		return tcb
			.overrideProviders(SearchComponent, [
				provide(ExampleService, {useClass: MockExampleService})
			])
			.createAsync(SearchComponent)
			.then((componentFixture: ComponentFixture) => {
				searchComponentFixture = componentFixture;
			});

	}))

	it('Should retrieve results when calling runSearch method', () => {
		let componentInstance = searchComponentFixture.componentInstance;
		componentInstance.runSearch('test');
		expect(componentInstance.searchResults.length).toEqual(MOCK_RESULTS.length);
	})

});