import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class ExampleService {
	constructor(private _http: Http) {}

	public parametricSearch(term:string, callback:Function) {

		this._http.get('/server-webapp/api/parametricSearch?catFilter=&facetOn=false&format=json&maxResults=15&minQFilter=&searchTerm=' + (term || '*') + '&sortOn=available_quantity&sortOrder=desc&startIndex=0')
			.subscribe(res=>{
				callback(res.json().views)
			});
	}
}
