import { Component, OnInit, inject } from '@angular/core';
import {PetType} from '../pettype';
import {Router} from '@angular/router';
import {PetTypeService} from '../pettype.service';
import {Specialty} from '../../specialties/specialty';
import { finalize } from 'rxjs/operators';

import { FormsModule } from '@angular/forms';
import { PettypeAddComponent } from '../pettype-add/pettype-add.component';

@Component({
    selector: 'app-pettype-list',
    templateUrl: './pettype-list.component.html',
    styleUrls: ['./pettype-list.component.css'],
    imports: [FormsModule, PettypeAddComponent]
})
export class PettypeListComponent implements OnInit {
  private pettypeService = inject(PetTypeService);
  private router = inject(Router);

  pettypes: PetType[];
  errorMessage: string;
  responseStatus: number;
  isPetTypesDataReceived: boolean = false;
  isInsert = false;

  constructor() {
    this.pettypes = [] as PetType[];
  }

  ngOnInit() {
    this.pettypeService.getPetTypes().pipe(
      finalize(() => {
        this.isPetTypesDataReceived = true;
      })
    ).subscribe({
      next: pettypes => this.pettypes = pettypes,
      error: error => this.errorMessage = error as any
    });
  }

  deletePettype(pettype: PetType) {
    this.pettypeService.deletePetType(pettype.id.toString()).subscribe({
      next: response => {
        this.responseStatus = response;
        this.pettypes = this.pettypes.filter(currentItem => !(currentItem.id === pettype.id));
      },
      error: error => this.errorMessage = error as any
    });
  }

  onNewPettype(newPetType: Specialty) {
    this.pettypes.push(newPetType);
    this.showAddPettypeComponent();
  }

  showAddPettypeComponent() {
    this.isInsert = !this.isInsert;
  }

  showEditPettypeComponent(updatedPetType: PetType) {
    this.router.navigate(['/pettypes', updatedPetType.id.toString(), 'edit']);
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }
}
