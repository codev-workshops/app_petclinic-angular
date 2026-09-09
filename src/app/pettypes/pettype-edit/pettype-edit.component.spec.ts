import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MockInstance} from 'vitest';

import {PettypeEditComponent} from './pettype-edit.component';
import {PetTypeService} from '../pettype.service';
import {PetType} from '../pettype';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {FormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';

class PetTypeServiceStub {
  getPetTypeById(typeId: string): Observable<PetType> {
    return of();
  }
}


describe('PettypeEditComponent', () => {
  let component: PettypeEditComponent;
  let fixture: ComponentFixture<PettypeEditComponent>;
  let pettypeService: PetTypeService;
  let spy: MockInstance;
  let testPettype: PetType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [FormsModule, PettypeEditComponent],
    providers: [
        { provide: PetTypeService, useClass: PetTypeServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PettypeEditComponent);
    component = fixture.componentInstance;
    testPettype = {
      id: 1,
      name: 'test'
    };

    pettypeService = fixture.debugElement.injector.get(PetTypeService);
    spy = vi.spyOn(pettypeService, 'getPetTypeById')
      .mockReturnValue(of(testPettype));

    fixture.detectChanges();
  });

  it('should create PettypeEditComponent', () => {
    expect(component).toBeTruthy();
  });
});
