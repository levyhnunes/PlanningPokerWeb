import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { SignalRService } from 'src/app/services/signalr-service';
import { User } from 'src/app/models/user';




@Component({
  selector: 'app-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.css']
})
export class DeckCardComponent implements OnInit {

  users: User[];

  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit(): void {
    this.signalRService.startConnection().then(connectionId => {
      console.log('connectionId: ', connectionId)
      const userName = localStorage.getItem("@planning-poker:user")
      const params = {
        name: userName,
        connectionId: connectionId
      };
      this.http.post<User>('https://localhost:44392/api/Room/AddPlayer', params)
        .subscribe(user => {
          // this.users.push(user);
        })
      // .pipe(catchError(error => {
      //   console.log(error);
      //   return throwError(error);
      // }));

    });
    this.signalRService.onPlayes((newUser: any) => {
      const user = this.users.find(user => user.id == newUser.id);
      if (!user) {
        this.users.push(newUser);
        console.log("newUser ", newUser);
      }
    });
    this.signalRService.onPlayerCard((playerCard) => {
      const user = this.users.find(user => user.connectionId == playerCard.connectionId);
      user.card = playerCard.card;
      console.log("playerCard ", playerCard);
    });
    this.signalRService.onDisconnectedPlayer((connectionId) => {
      this.users = this.users.filter(user => user.connectionId !== connectionId);
      console.log("disconnectedPlayer ", connectionId);
    })
    this.startHttpRequest();
    console.log("deu certo !!!")
  }

  private startHttpRequest = () => {
    this.http.get<User[]>('https://localhost:44392/api/Room/GetPlayers')
      .subscribe(users => {
        this.users = users;
        console.log("users ", users);
      })
  }

}
