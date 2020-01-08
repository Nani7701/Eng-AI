import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  baseUrl = 'https://hn.algolia.com/api/v1/search_by_date?tags=story';

  constructor(private httpService: HttpClient) { }

  fetchStories() {
    return this.httpService.get(this.baseUrl);
  }
}
