import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      this.http.post<User[]>('https://localhost:44392/api/PlanningPoker/AddUser', params)
        .subscribe(users => {
          this.users = users;
        })
    });
    this.signalRService.onUsers((newUser) => {
      this.users.push(newUser);
      console.log("newUser ", newUser);
    });
    this.signalRService.onDisconnectedUser((connectionId) => {
      this.users = this.users.filter(user => user.connectionId !== connectionId);
      console.log("disconnectedUser ", connectionId);
    })
    this.startHttpRequest();
    console.log("deu certo !!!")
  }

  private startHttpRequest = () => {
    this.http.get<User[]>('https://localhost:44392/api/PlanningPoker/GetUsers')
      .subscribe(users => {
        this.users = users;
        console.log("users ", users);
      })
  }

}
