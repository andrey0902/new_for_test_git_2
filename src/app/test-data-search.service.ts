import { Injectable } from '@angular/core';
import { SearchDataService } from './input/searchautocomplete/shared/search.data.service';
import { Observable, of } from 'rxjs/index';
import { TypeheadItemModel } from './input/searchautocomplete/shared/typehead.item.model';

@Injectable({
  providedIn: 'root'
})
export class TestDataSearchService implements SearchDataService {
  data: TypeheadItemModel[] = [
    {
      item: {
        name: 'aaaaa',
        id: 5
      }
    },
    {
      item: {
        name: 'bbbb',
        id: 6
      }
    },
    {
      item: {
        name: 'cccc',
        id: 7
      }
    },
    {
      item: {
        name: 'dddd',
        id: 8
      }
    },
    {
      item: {
        name: 'ggggg',
        id: 5
      }
    },
    {
      item: {
        name: 'aaabbb',
        id: 6
      }
    },
    {
      item: {
        name: 'bbccc',
        id: 7
      }
    },
    {
      item: {
        name: 'cccddd',
        id: 8
      }
    }
  ];
  constructor() { }

  getData (str: string): Observable<TypeheadItemModel[]> {
    return of(this.filter(str));
  }

  filter(str) {
    return this.data.filter((item) => item.item.name.toLowerCase().includes(str));
  }
}
