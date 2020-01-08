import { Component, OnInit } from '@angular/core';
import { StoryService } from '../shared/story.service';
import { timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '../dialog/dialog.component';
import { Story } from '../shared/story';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  storyList: [];
  stratTime: number = 0;
  interval: number = 10000;
  headerColumns = ['title', 'url', 'created_at', 'author'];
  displayData = new MatTableDataSource;
  storyData: {};

  constructor(private storyService: StoryService, private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchStoryData();
  }

  fetchStoryData() { // fetching stories from API and refreshing for every 10seconds
    timer(this.stratTime, this.interval).pipe(concatMap(() =>
      this.storyService.fetchStories())).subscribe(res => {
        this.storyList = res['hits'];
        this.displayData = new MatTableDataSource(this.storyList);
        console.log('Stories from API', this.storyList);
      });
  }

  openDialog(data) { // opening dialog and showing raw Json
    this.storyData = JSON.stringify(data);
    this.dialog.open(DialogComponent, {
        width: '50%',
        data: this.storyData
    });
  }

  searchByTitle(column: string) { 
    this.displayData.filterPredicate = (key: Story, filter: string) => {
      const titlesearch = key[column] && key[column].toLowerCase() || '';
      return titlesearch.indexOf(filter) != -1;
    }
  }

  searchFilter(search: string) { // search filter of table by column title
    this.searchByTitle('title');
    this.displayData.filter = search.trim().toLowerCase();
  }

}
