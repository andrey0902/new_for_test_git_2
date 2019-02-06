import { Observable } from 'rxjs/index';

export abstract class SearchDataService {
  getData: (str: string) => Observable<any[]>;
}
