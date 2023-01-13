import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GiftGame, GiftPeople } from '../core/models/gift-game.model';
import { GiftGameService } from '../core/services/gift-game.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-gift-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gift-game.component.html',
  styleUrls: ['./gift-game.component.scss']
})
export class GiftGameComponent implements OnInit {

  giftList$: Observable<GiftGame[]>;
  giftForm: FormGroup;
  selectedGame: GiftGame;

  peopleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ggService: GiftGameService
  ) {
    this.giftForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    
  }

  ngOnInit(): void {
    this.giftList$ = this.ggService.getAll();
  }

  onSubmit() {
    if (this.giftForm.valid) {
      const newGiftGame = {
        name: this.giftForm.value.name,
        people: [],
        started: false
      };
      this.ggService.create(newGiftGame).then(() => this.giftForm.setValue({ name: '' }));
    }
  }

  removeList(id: string | undefined) {
    if (!id) {
      return;
    }
    this.ggService.delete(id);
  }

  selectGame(game: GiftGame) {
    this.selectedGame = game;
    this.peopleForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  addPeople() {
    if (this.peopleForm.valid) {
      if (!this.selectedGame.people) {
        this.selectedGame.people = [];
      }
      this.selectedGame.people.push({
        name: this.peopleForm.value.name,
        sendTo: ''
      });

      this.ggService.update(this.selectedGame).then(() => this.peopleForm.setValue({ name: '' }));
    }
  }

  removePeople(index: number) {
    if (!this.selectedGame || !this.selectedGame.people || !this.selectedGame.people.length) {
      return;
    }
    this.selectedGame.people.splice(index, 1);
    this.ggService.update(this.selectedGame);
  }

  startGame() {
    if (!this.selectGame || this.selectedGame.people.length < 2) {
      return;
    }

    let receivedList = this.selectedGame.people.map(p => p.name);
    this.selectedGame.people.forEach((sender) => {
      const num = Math.floor(Math.random() * (receivedList.length - 1));
      const receiver = receivedList.filter(p => p !== sender.name)[num];
      sender.sendTo = receiver || '';
      receivedList = receivedList.filter(n => n != receiver);
    });
    this.selectedGame.started = true;
    this.ggService.update(this.selectedGame);
  }
}
