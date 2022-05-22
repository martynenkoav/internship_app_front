import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {TokenStorageService} from "../../service/token-storage.service";


@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
  title = 'app';

  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  user: any;
  text: string;
  disabled: boolean;

  constructor(private tokenStorageService: TokenStorageService){
    this.user = tokenStorageService.getUser().username;
  }

  ngOnInit(): void {
    let socket = new WebSocket("ws://findinternshipsapp.herokuapp.com/greeting");
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect({}, function(frame) {
      that.ws.subscribe("/errors", function(message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/reply", function(message) {
        console.log(message)
        that.showGreeting(message.body);
      });
      that.disabled = true;
    }, function(error) {
      alert("STOMP error " + error);
    });
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }

  sendName() {
    let data = JSON.stringify({
      'user' : this.user,
      'text' : this.text
    })
    this.ws.send("/app/message", {}, data);
  }

  showGreeting(message) {
    this.showConversation = true;
    this.greetings.push(message)
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
