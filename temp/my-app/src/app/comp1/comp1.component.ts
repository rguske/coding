import { Component, OnInit } from '@angular/core';
import { CatsService } from '../cats.service';
import { Cat } from '../models';

@Component({
  selector: 'app-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit {

  constructor(public catsService: CatsService) { }

  cats: Cat[] = [];

  ngOnInit() {
    this.catsService.getCats().subscribe((data) => this.cats = data)
  }
}

// import { Component, OnInit } from '@angular/core';
// 
// @Component({
//   selector: 'app-comp1',
//   templateUrl: './comp1.component.html',
//   styleUrls: ['./comp1.component.css']
// })
// export class Comp1Component implements OnInit {
// 
//   constructor() { }
// 
//   ngOnInit(): void {
//   }
// 
// }
