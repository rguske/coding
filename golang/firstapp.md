Source: https://vcoffee.cloud/posts/cheat-sheet/

## Install Node.js, Angular and GoLang on Ubuntu

brew install node
npm install -g @angular/cli

## Build a new app

ng new my-app --routing=false --style=css && cd my-app && ng add @clr/angular
code . # if Visual Studio Code is installed
ng serve --live-reload --open

## Add components and routing

ng generate module app-routing --flat --module=app && ng generate component comp1 && ng generate component comp2

### app-component.html

Make a backup of the original file like e.g. app-component.html_backup

```html
<div class="main-container">
  <header class="header header-6">
    <div class="branding">
      <a href="javascript:void(0)">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
    <clr-vertical-nav>
      <a clrVerticalNavLink routerLink="./comp1" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="dashboard"></clr-icon>
        Comp1
      </a>
      <a clrVerticalNavLink routerLink="./comp2">
        <clr-icon clrVerticalNavIcon shape="vm"></clr-icon>
        Comp2
     </a>
    </clr-vertical-nav>
  </div>
</div>
```

### app-routing.ts

Make a copy of it too.

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comp1Component } from './comp1/comp1.component';
import { Comp2Component } from './comp2/comp2.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'comp1', component: Comp1Component },
  { path: 'comp2', component: Comp2Component },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
```

## Add data model

touch models.ts

```ts
export interface Cat {
    text: string;
}
```

## Add services

ng generate service cats

### in cats.service.ts:

```ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cat } from './models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatsService {

  constructor(private http: HttpClient) { }

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>("https://cat-fact.herokuapp.com/facts")
  }
}
```

### in app.module.ts:

```ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
  ],
})
```

### in comp1.component.ts:

```ts
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
```

## add Clarity component to display data

### in comp1.component.html

```html
<p>comp1 works!</p>

<clr-datagrid>
    <clr-dg-column>Cat Facts</clr-dg-column>
  
    <clr-dg-row *ngFor="let cat of cats">
      <clr-dg-cell>{{cat.text}}</clr-dg-cell>
    </clr-dg-row>
  
    <clr-dg-footer>{{cats.length}} cat facts</clr-dg-footer>
</clr-datagrid>
```

## create a small Web Server in Go

```shell
mkdir -p ./server
cd server
go mod init rguske
```

```shell
touch main.go

package main

import (
	"github.com/gin-gonic/gin"

	"path"
	"path/filepath"
)

func main() {
	router := gin.Default()

	router.NoRoute(func(c *gin.Context) {
		dir, file := path.Split(c.Request.RequestURI)
		ext := filepath.Ext(file)
		if file == "" || ext == "" {
			c.File("./index.html")
		} else {
			c.File("./" + path.Join(dir, file))
		}

	})

	err := router.Run(":8080")
	if err != nil {
		panic(err)
	}
}
```

```
go build
ng build --prod
mv rguske ./dist/my-app
cd ./dist/my-app
./rguske
```

## create a dockerfile

```dockerfile
FROM golang:latest as builder

LABEL maintainer="Robert Guske <rguske@vmware.com>"

WORKDIR /app

COPY server/go.mod server/go.sum ./

RUN go mod download

COPY server .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

COPY dist/my-app .

EXPOSE 80

CMD ["./main"]
```

### push to Harbor

```shell
docker build -t harbor.jarvis.lab/knative/my-kn-demo-app:0.1 .
docker login -u admin harbor.jarvis.lab
docker push harbor.jarvis.lab/knative/my-app:1.0
```


