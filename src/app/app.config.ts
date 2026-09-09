import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withXhr} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {appRoutes} from './app.routes';
import {HttpErrorHandler} from './error.service';
import {OwnerService} from './owners/owner.service';
import {PetService} from './pets/pet.service';
import {VisitService} from './visits/visit.service';
import {PetTypeService} from './pettypes/pettype.service';
import {VetService} from './vets/vet.service';
import {VetResolver} from './vets/vet-resolver';
import {SpecialtyService} from './specialties/specialty.service';
import {SpecResolver} from './specialties/spec-resolver';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'MM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withXhr()),
    provideAnimations(),
    HttpErrorHandler,
    OwnerService,
    PetService,
    VisitService,
    PetTypeService,
    VetService,
    VetResolver,
    SpecialtyService,
    SpecResolver,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
};
