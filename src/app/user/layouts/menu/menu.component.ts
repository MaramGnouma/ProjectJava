import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],

})
export class MenuComponent implements OnInit {
  activeFilter: string = '*';

  filterItems(category: string) {
    this.activeFilter = category;
  }

  shouldShow(category: string): boolean {
    return this.activeFilter === '*' || this.activeFilter === category;
  }

  ngOnInit(): void {
    window.onpageshow = function(event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }
}
