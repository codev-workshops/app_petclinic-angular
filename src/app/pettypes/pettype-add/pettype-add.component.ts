import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {PetType} from '../pettype';
import {PetTypeService} from '../pettype.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-pettype-add',
    templateUrl: './pettype-add.component.html',
    styleUrls: ['./pettype-add.component.css'],
    imports: [FormsModule, NgIf]
})
export class PettypeAddComponent implements OnInit {
  private pettypeService = inject(PetTypeService);

  pettype: PetType;
  errorMessage: string;
  @Output() newPetType = new EventEmitter<PetType>();

  constructor() {
    this.pettype = {} as PetType;
  }

  ngOnInit() {
  }

  onSubmit(pettype: PetType) {
    pettype.id = null;
    this.pettypeService.addPetType(pettype).subscribe({
      next: newPettype => {
        this.pettype = newPettype;
        this.newPetType.emit(this.pettype);
      },
      error: error => this.errorMessage = error as any
    });
  }

}
