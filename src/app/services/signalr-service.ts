import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data: string[];

    private hubConnection: signalR.HubConnection

    constructor(private http: HttpClient) { }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44392/planningPokerHub')
            .build();

        return this.hubConnection
            .start()
            .then((_) => {
                console.log('Connection started');
                return this.hubConnection.invoke('GetConnectionId');
            })
            .catch(err => console.log('Error while starting connection: ' + err))
    }

    public onPlayers = (functionResult) => {
        return this.hubConnection.on('ReceivePlayer', functionResult);
    }

    public onPlayerCard = (functionResult) => {
        return this.hubConnection.on('ReceivePlayerCard', functionResult);
    }

    public onDisconnectedPlayer = (functionResult) => {
        return this.hubConnection.on('DisconnectedPlayer', functionResult);
    }

    public onRoom = (roomId: number, functionResult) => {
        console.log('UpdateRoom#' + roomId);
        return this.hubConnection.on('UpdateRoom#' + roomId, functionResult);
    }
}