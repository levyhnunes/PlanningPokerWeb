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

    public onUsers = (functionResult) => {
        return this.hubConnection.on('ReceiveUser', functionResult);
    }

    public onDisconnectedUser = (functionResult) => {
        return this.hubConnection.on('DisconnectedUser', functionResult);
    }
}