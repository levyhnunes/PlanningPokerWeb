import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api'

import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { SignalRService } from 'src/app/services/signalr-service';
import { Player } from 'src/app/models/player';
import { Room } from 'src/app/models/room';

@Component({
  selector: 'app-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.css']
})
export class DeckCardComponent implements OnInit {

  room: Room;
  players: Player[];
  playerLogged: Player;
  items: MenuItem[];

  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit(): void {
    this.playerLogged = new Player();
    // this.startConnection();
    // this.onPlayers();
    // this.onPlayerCard();
    // this.onDisconnectedPlayer();
    this.getRoom();
  }

  private getRoom = () => {
    this.http.get<Room>('https://localhost:44392/api/Rooms')
      .subscribe(room => {
        this.room = room;
        this.players = room.players
        this.startConnection(room.id);
        console.log("room ", room);
      })
  }

  private startConnection(roomId: number) {
    this.signalRService.startConnection().then(connectionId => {
      this.onPlayers();
      this.onPlayerCard();
      this.onDisconnectedPlayer();
      this.onRoom(roomId);

      this.playerLogged.connectionId = connectionId;
      const params = {
        name: localStorage.getItem("@planning-poker:user"),
        connectionId: connectionId
      };

      this.http.post<Player>('https://localhost:44392/api/Rooms/' + roomId + '/Players', params).toPromise();
    });
  }

  private onPlayers() {
    this.signalRService.onPlayers((newPlayer: Player) => {
      console.log("newPlayer ", newPlayer);
      const player = this.players.find(user => user.id == newPlayer.id);
      if (!player) {
        this.players.push(newPlayer);
        console.log("newUser ", newPlayer);
      }
      console.log("playerLogged ", this.playerLogged);
      if (this.playerLogged.connectionId == newPlayer.connectionId) {
        this.playerLogged = newPlayer;
      }
    });
  }

  private onPlayerCard() {
    this.signalRService.onPlayerCard((playerCard) => {
      const user = this.players.find(user => user.connectionId == playerCard.connectionId);
      user.card = playerCard.card;
      console.log("playerCard ", playerCard);
    });
  }

  private onDisconnectedPlayer() {
    this.signalRService.onDisconnectedPlayer((connectionId) => {
      this.players = this.players.filter(user => user.connectionId !== connectionId);
      console.log("disconnectedPlayer ", connectionId);
    })
  }

  private onRoom(roomId: number) {
    this.signalRService.onRoom(roomId, (room: Room) => {
      console.log("###UpdateRomm")
      this.room.reveal = room.reveal
      if (!room.reveal) {
        this.players.map(p => p.card = null);
      }
    })
  }

  newPlayerAdm(userId: number) {
    const params = {
      oldAdmId: this.playerLogged.id,
      newAdmId: userId
    };

    this.http.post<Player>('https://localhost:44392/api/Rooms/NewPlayerAdm', params)
      .subscribe(_ => this.playerLogged.isAdmin = false)
  }

  addCard(card: number): void {
    this.playerLogged.card = card;
    const params = {
      connectionId: this.playerLogged.connectionId,
      card: card,
    };
    this.http.put<Player>('https://localhost:44392/api/Rooms/Players', params).toPromise();
  }

  updateRoom(reveal: boolean) {
    const params = {
      id: this.room.id,
      reveal: reveal
    };
    this.http.put<Player>('https://localhost:44392/api/Rooms', params).toPromise();
  }
}
