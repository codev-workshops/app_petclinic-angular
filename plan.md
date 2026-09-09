# Angular 16 -> 20 Migration Plan

Phased upgrade of `spring-petclinic-angular` from Angular 16.2.1 to Angular 20.

## Branching model

- Base branch: `feature/praveen-demo-migration` (created once from `main`, receives no direct commits).
- Each phase is a leaf branch created from the current tip of the base branch and merged back via PR.
- Every PR targets `feature/praveen-demo-migration`; nothing targets `main`.
- Once a phase PR is merged, delete its leaf branch (remote and local) so only the base branch and the in-progress leaf remain.
- There is no CI: `npm run build`, `npm run test-headless` and `npm run lint` are run locally before each PR.

## Definition of Done (every phase)

- `npm run build`, `npm run test-headless` and `npm run lint` pass locally.
- Functional smoke test in a real browser against a local `spring-petclinic-rest` backend (owners/pets/visits/vets/specialties/pet types CRUD, datepicker, backend-down error path); results posted on the PR. Added as of Phase 2 (run retroactively on Phase 1).
- PR opened as draft against the base branch, Devin review findings resolved, PR marked ready for review.
- Not merged by Devin; merge (leaf -> base, later base -> main) is done by a human.
- Status table below updated with the resulting `@angular/core` version and branch/PR reference.

## Status

| Phase | Target Angular version | Branch | PR | Status | Resulting @angular/core version |
|-------|------------------------|--------|----|--------|---------------------------------|
| 0 - Pre-work | 16 (unchanged) | `feature/praveen-demo-migration-phase0-prework` | #28 | Done | 16.2.1 |
| 1 - Angular 17 | 17 | `feature/praveen-demo-migration-phase1-ng17` | #29 | Done | 17.3.12 |
| 2 - Angular 18 | 18 | `feature/praveen-demo-migration-phase2-ng18` | #30 | Done | 18.2.14 |
| 3 - Angular 19 | 19 | `feature/praveen-demo-migration-phase3-ng19` | #31 | Done | 19.2.25 |
| 4 - Angular 20 | 20 | `feature/praveen-demo-migration-phase4-ng20` | #32 | In progress | 20.3.30 |

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
- [x] Node 18.13+/20.9+ (VM runs Node 20), TypeScript 5.4.5, `zone.js` `~0.14.10`.
- [x] `ng update @angular/core@17 @angular/cli@17 @angular-eslint/schematics@17`, then `ng update @angular/material@17` (cdk and material-moment-adapter in lockstep, 17.3.10).
- [x] Replace `HttpClientModule` in `src/app/app.module.ts` with `provideHttpClient()`.
- [x] ~~Optional (deferred): move `angular.json` from `@angular-devkit/build-angular:browser` to the esbuild `application` builder.~~ Dropped: the app stays on the `browser` builder for the rest of the migration (decision taken at the start of Phase 3).

DoD:
- [x] All `@angular/*` packages on 17.x.
- [x] build/test/lint green locally.
- [x] Devin review findings resolved.
- [x] PR ready for review against base; not merged.

### Phase 2 - Angular 18 (target: 18.x)

Scope:
- [x] `ng update @angular/core@18 @angular/cli@18 @angular-eslint/schematics@18`, then `ng update @angular/material@18` (cdk and material-moment-adapter in lockstep, 18.2.14); TypeScript stays 5.4.5. The core migration replaced `HttpClientTestingModule` with `provideHttpClientTesting()` in service specs; the removed `async` test helper was replaced with `waitForAsync`.
- [x] Remove Protractor: deleted the `spring-petclinic-angular-e2e` project and `:protractor` builder from `angular.json`, `protractor.conf.js`, `e2e/tsconfig.e2e.json` and the Protractor spec/page object; dropped `protractor`, `@types/jasminewd2`, `jasmine-spec-reporter` and `ts-node` from `package.json`.
- [x] Stand up Playwright as the e2e runner: `@playwright/test`, `playwright.config.ts` (starts `ng serve` itself), `e2e/app.spec.ts`; `npm run e2e` = `playwright test` (run `npx playwright install chromium` once).
- [x] Review Material 3 theming impact: the app uses the prebuilt `indigo-pink` (M2) theme, which Material 18 still ships, and `MomentDateAdapter` / `MAT_DATE_FORMATS` in `pets.module.ts` / `visits.module.ts` are unchanged in 18; no theming change needed.

DoD:
- [x] All `@angular/*` packages on 18.x; no Protractor references; e2e runner works.
- [x] build/test/lint green locally.
- [x] Browser smoke test against local backend (results on #30).
- [x] Devin review findings resolved.
- [x] PR ready for review against base; not merged.

### Phase 3 - Angular 19 (target: 19.x)

Scope:
- [x] `ng update @angular/core@19 @angular/cli@19 @angular-eslint/schematics@19`, then `ng update @angular/material@19` (19.2.x); the CLI moved TypeScript to 5.8.3 (within Angular 19's supported 5.5-5.8 range) and `zone.js` to `~0.15.1`.
- [x] Run the standalone components migration schematic (`convert-to-standalone`, `prune-ng-modules`, `standalone-bootstrap`).
- [x] Convert all NgModules to standalone: `AppModule`, `PartsModule`, `TestingModule` and all feature/routing modules deleted; each `*-routing.module.ts` became a `*.routes.ts` exporting a `Routes` array, composed in `src/app/app.routes.ts` (feature routes first, then `welcome`/`''`/`**`, preserving the previous module import order).
- [x] Replace `bootstrapModule(AppModule)` in `src/main.ts` with `bootstrapApplication(AppComponent, appConfig)`.
- [x] Move module-level providers (services, resolvers, `HttpErrorHandler`, `DateAdapter` / `MAT_DATE_FORMATS`) into `src/app/app.config.ts` (`provideRouter`, `provideHttpClient`, `provideAnimations`).

DoD:
- [x] All `@angular/*` packages on 19.x; app standalone-bootstrapped.
- [x] build/test/lint green locally.
- [x] Browser smoke test against local backend (results on #31).
- [x] Devin review findings resolved (review on #31 reported no findings).
- [x] PR ready for review against base; not merged.

### Phase 4 - Angular 20 (target: 20.x)

Scope:
- [x] Node 20.19+/22+, TypeScript ~5.8; `ng update @angular/core@20 @angular/cli@20 @angular-eslint/schematics@20`, then `@angular/material@20` (20.2.x). Node 20.20 / TS 5.8.3 already satisfied the requirements; the CLI switched `moduleResolution` to `bundler`.
- [x] `@angular-eslint` 20 enables `prefer-inject`; ran `ng generate @angular/core:inject` to move all constructor DI to `inject()`.
- [x] Migrate unit tests off the deprecated Karma builder to Vitest (`@angular/build:unit-test`, runner `vitest`, jsdom). Removed `karma.conf.js`, `src/test.ts` and all `karma-*`/`jasmine*` packages; specs moved from Jasmine to Vitest APIs (`vi.spyOn`/`mockReturnValue`, `async`/`await` instead of `waitForAsync`, `textContent` instead of jsdom-unsupported `innerText`). `npm test`/`npm run test-headless` keep working (`ng test` / `ng test --no-watch`).
  - The unit-test builder needs an `@angular/build:application` build target, so a test-only `test-build` target was added in `angular.json`; the app `build`/`serve` targets stay on the webpack `browser` builder (esbuild switch dropped in Phase 1/3).
  - `vet-add`/`vet-edit` specs had no active `it()` (Karma tolerated this, Vitest fails an empty suite); kept as `it.todo('should create')`.
- [ ] ~~Optional: adopt `provideZonelessChangeDetection` and remove `zone.js`.~~ Skipped: not required for 20.x, left for a follow-up.
- [x] Note in this file that the base branch holds the full 16 -> 20 migration awaiting human review/merge into `main` (see "Final state" below).

DoD:
- [x] All `@angular/*` packages on 20.x; unit tests pass on the new runner (43 passed, 2 todo).
- [x] build/lint green locally.
- [x] Browser smoke test against local backend (results on #32).
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

## Final state

Once the Phase 4 PR is merged, `feature/praveen-demo-migration` holds the complete Angular 16.2 -> 20.3 migration (RxJS 7, standalone bootstrap, `inject()` DI, Playwright e2e, Vitest unit tests). It awaits human review and a human-performed merge into `main`; Devin does not merge it.

## Cross-cutting

- Bump `@angular/material` and `@angular/cdk` in lockstep with `@angular/core` in every phase.
- Consider migrating `moment` / `@angular/material-moment-adapter` (listed in `allowedCommonJsDependencies` in `angular.json`) to Luxon or the native date adapter.
