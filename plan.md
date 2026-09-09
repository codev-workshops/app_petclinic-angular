# Angular 16 -> 20 Migration Plan

Phased upgrade of `spring-petclinic-angular` from Angular 16.2.1 to Angular 20.

## Branching model

- Base branch: `feature/praveen-demo-migration` (created once from `main`, receives no direct commits).
- Each phase is a leaf branch created from the current tip of the base branch and merged back via PR.
- Every PR targets `feature/praveen-demo-migration`; nothing targets `main`.
- There is no CI: `npm run build`, `npm run test-headless` and `npm run lint` are run locally before each PR.

## Definition of Done (every phase)

- `npm run build`, `npm run test-headless` and `npm run lint` pass locally.
- PR opened as draft against the base branch, Devin review findings resolved, PR marked ready for review.
- Not merged by Devin; merge (leaf -> base, later base -> main) is done by a human.
- Status table below updated with the resulting `@angular/core` version and branch/PR reference.

## Status

| Phase | Target Angular version | Branch | PR | Status | Resulting @angular/core version |
|-------|------------------------|--------|----|--------|---------------------------------|
| 0 - Pre-work | 16 (unchanged) | `feature/praveen-demo-migration-phase0-prework` | #28 | Done | 16.2.1 |
| 1 - Angular 17 | 17 | `feature/praveen-demo-migration-phase1-ng17` | - | Not started | - |
| 2 - Angular 18 | 18 | `feature/praveen-demo-migration-phase2-ng18` | - | Not started | - |
| 3 - Angular 19 | 19 | `feature/praveen-demo-migration-phase3-ng19` | - | Not started | - |
| 4 - Angular 20 | 20 | `feature/praveen-demo-migration-phase4-ng20` | - | Not started | - |

## Phase checklist

### Phase 0 - Pre-work (target: Angular 16, unchanged)

Scope:
- [x] Migrate RxJS `^6.3.1` -> `^7.x`.
- [x] Convert all `.subscribe(next, error)` multi-argument callbacks to `.subscribe({ next, error })` (components, services, specs).
- [x] Replace any `toPromise()` usage (none present).
- [x] Remove `codelyzer` from `devDependencies` (lint stays on `@angular-eslint/*`).
- [x] Bump `@types/node` off `^12`.
- [x] Create this `plan.md`.

DoD:
- [x] Angular remains 16.2.1.
- [x] build/test/lint green locally.
- [x] Devin review findings resolved.
- [x] PR ready for review against base; not merged.

### Phase 1 - Angular 17 (target: 17.x)

Scope:
- [ ] Node 18.13+/20.9+, TypeScript 5.2-5.4, `zone.js` `~0.14`.
- [ ] `ng update @angular/core@17 @angular/cli@17`, then `ng update @angular/material@17` (cdk in lockstep).
- [ ] Replace `HttpClientModule` in `src/app/app.module.ts` with `provideHttpClient()`.
- [ ] Optional: move `angular.json` from `@angular-devkit/build-angular:browser` to the esbuild `application` builder; verify jQuery/Tether/Bootstrap globals still inject.

DoD:
- [ ] All `@angular/*` packages on 17.x.
- [ ] build/test/lint green locally.
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

### Phase 2 - Angular 18 (target: 18.x)

Scope:
- [ ] `ng update` core/cli/material/cdk to 18; TypeScript 5.4+.
- [ ] Remove Protractor: delete the `spring-petclinic-angular-e2e` project and `:protractor` builder from `angular.json`, delete `protractor.conf.js` and `e2e/tsconfig.e2e.json`, remove `protractor` from `package.json`.
- [ ] Stand up Cypress or Playwright as the e2e runner.
- [ ] Review Material 3 theming impact on the datepicker / `@angular/material-moment-adapter` in `src/app/pets/pets.module.ts` and `src/app/visits/visits.module.ts`.

DoD:
- [ ] All `@angular/*` packages on 18.x; no Protractor references; e2e runner works.
- [ ] build/test/lint green locally.
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

### Phase 3 - Angular 19 (target: 19.x)

Scope:
- [ ] `ng update` to 19; TypeScript 5.5/5.6.
- [ ] Run the standalone components migration schematic.
- [ ] Convert all NgModules (`AppModule`, `OwnersModule`, `PetsModule`, `VisitsModule`, `PetTypesModule`, `VetsModule`, `SpecialtiesModule`, `PartsModule` and routing modules) to standalone.
- [ ] Replace `bootstrapModule(AppModule)` in `src/main.ts` with `bootstrapApplication`.
- [ ] Move module-level providers (e.g. `DateAdapter` / `MAT_DATE_FORMATS` in `src/app/pets/pets.module.ts`) into standalone config.

DoD:
- [ ] All `@angular/*` packages on 19.x; app standalone-bootstrapped.
- [ ] build/test/lint green locally.
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

### Phase 4 - Angular 20 (target: 20.x)

Scope:
- [ ] Node 20.19+/22+, TypeScript ~5.8; `ng update` to 20.
- [ ] Migrate unit tests off the deprecated Karma builder to web-test-runner or Vitest; update/remove `karma.conf.js`, `src/test.ts`, `src/tsconfig.spec.json` and the `test` builder in `angular.json`; keep `test-headless`/`test` scripts working.
- [ ] Optional: adopt `provideZonelessChangeDetection` and remove `zone.js` from `package.json`/polyfills.
- [ ] Note in this file that the base branch holds the full 16 -> 20 migration awaiting human review/merge into `main`.

DoD:
- [ ] All `@angular/*` packages on 20.x; unit tests pass on the new runner.
- [ ] build/lint green locally.
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

## Cross-cutting

- Bump `@angular/material` and `@angular/cdk` in lockstep with `@angular/core` in every phase.
- Consider migrating `moment` / `@angular/material-moment-adapter` (listed in `allowedCommonJsDependencies` in `angular.json`) to Luxon or the native date adapter.
