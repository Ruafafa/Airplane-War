export namespace backend {
	
	export class UserGameInfo {
	    id: number;
	    name: string;
	    high_score: number;
	    // Go type: time
	    high_score_time: any;
	
	    static createFrom(source: any = {}) {
	        return new UserGameInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.high_score = source["high_score"];
	        this.high_score_time = this.convertValues(source["high_score_time"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

