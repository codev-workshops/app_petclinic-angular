# Angular 16 -> 22 Migration Plan

Phased upgrade of `spring-petclinic-angular` from Angular 16.2.1 to Angular 22 (Phases 0-4 took it to Angular 20; Phases 5-6 continue to 21 and 22 under the same branching model, DoD and verification methods).

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
| 4 - Angular 20 | 20 | `feature/praveen-demo-migration-phase4-ng20` | #32 | Done | 20.3.30 |
| 5 - Angular 21 | 21 | `feature/praveen-demo-migration-phase5-ng21` | #34 | In progress | 21.2.22 |
| 6 - Angular 22 | 22 | `feature/praveen-demo-migration-phase6-ng22` | - | Not started | - |

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
- [x] Note in this file that the base branch holds the full 16 -> 20 migration awaiting human review/merge into `main` (see "Final state" below; superseded by Phases 5-6, which extend the same base branch).

DoD:
- [x] All `@angular/*` packages on 20.x; unit tests pass on the new runner (43 passed, 2 todo).
- [x] build/lint green locally.
- [x] Browser smoke test against local backend (results on #32).
- [x] Devin review findings resolved (review on #32 reported no findings).
- [x] PR ready for review against base; not merged.

### Phase 5 - Angular 21 (target: 21.x)

Scope:
- [x] Prerequisites: Node `^20.19 || ^22.12 || >=24` (VM Node 20.20 is fine), TypeScript `>=5.9 <6.0` (from 5.8.3), `@angular/build` 21 requires Vitest `^4.0.8` (from 3.2.4). `ng update` moved TypeScript to 5.9.3, Vitest to 4.1.11 and `@types/node` to 26.5.0 itself; Node 20.20 was accepted (note: the *latest* CLI, 22.x, already requires Node 22.22+, so `ng update --migrate-only` without a local CLI fails on this VM - run migrations through `node_modules/.bin/ng`).
- [x] `ng update @angular/core@21 @angular/cli@21 @angular-eslint/schematics@21`, then `ng update @angular/material@21` (cdk and material-moment-adapter in lockstep, 21.2.14). Automatic migrations applied: `tsconfig.json` dropped the `lib: [es2017, dom]` override (CLI default es2022); `src/main.ts` now passes `provideZoneChangeDetection()` explicitly (Angular 21 defaults new bootstraps to zoneless, so this keeps the app zone-based); the mandatory `control-flow-migration` converted every template from `*ngIf`/`*ngFor` to `@if`/`@for` and dropped the `NgIf`/`NgFor` imports. The migration was re-run with `format` disabled (prettier hidden) because the default run reformatted whole files with prettier defaults (double quotes, failing the repo's single-quote lint rule). Optional migrations `use-application-builder` and `router-current-navigation` were not run (app `build`/`serve` stay on `@angular-devkit/build-angular:browser`, still shipped in 21.2).
- [x] Upgrade `vitest` to 4.x (4.1.11 via `ng update`; `jsdom` 26.1 unchanged); `angular.json` `test` stays on `@angular/build:unit-test` with the `test-build` target. `npm test`/`npm run test-headless` work (43 passed, 2 todo).
- [x] Re-run `npm run lint`: no new `@angular-eslint` 21 rule failures. Only fix needed was type-related: Angular 21 type-checks `@HostListener` argument lists against the handler signature, so `RouterLinkStubDirective` in `src/app/testing/router-stubs.ts` dropped the unused `['$event']` argument.
- [x] Re-checked `it.todo` in `vet-add`/`vet-edit` specs and the `moment` namespace-import warnings from the esbuild test bundle: still warnings only, left as is.
- [ ] ~~Optional (deferred, decide at the time): `provideZonelessChangeDetection` and drop `zone.js`.~~ Not adopted: app stays on zone.js with an explicit `provideZoneChangeDetection()`.

DoD:
- [x] All `@angular/*` packages on 21.x (core 21.2.22, material/cdk 21.2.14); unit tests pass on Vitest 4 (43 passed, 2 todo).
- [x] build/test-headless/lint green locally.
- [ ] Browser smoke test against local backend (results on the PR).
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

### Phase 6 - Angular 22 (target: 22.x)

Scope:
- [ ] Prerequisites: Node `^22.22.3 || ^24.15 || >=26` - the VM runs Node 20.20, so Node must be upgraded first (blueprint/`nvm`, plus `engines` in `package.json` if declared); TypeScript `>=6.0 <6.1` (from 5.9), Vitest stays `^4.0.8`.
- [ ] `ng update @angular/core@22 @angular/cli@22 @angular-eslint/schematics@22`, then `ng update @angular/material@22` (cdk and material-moment-adapter in lockstep, 22.1.x). Review and apply the CLI's automatic migrations.
- [ ] TypeScript 6 changes: review new default strictness/removed flags affecting `tsconfig*.json`; fix compile errors surfaced in app and spec code.
- [ ] Verify `@angular-devkit/build-angular:browser` is still available in 22; if it has been removed, move `build`/`serve` to `@angular/build:application` in this phase (reversing the Phase 1 "dropped" decision only because it becomes mandatory) and re-add the Bootstrap/jQuery/Tether `styles`/`scripts`/`assets` on the new target; drop the separate `test-build` target if `test` can reuse `build`.
- [ ] Lint toolchain: `@angular-eslint` 22 requires ESLint `^9 || ^10` (repo is on ESLint 8.57 / `@typescript-eslint` 7 / legacy `.eslintrc.json`, still accepted by `@angular-eslint` 21). Upgrade `eslint` to 9.x and `@typescript-eslint/*` to an 8.x+ release compatible with it, convert `.eslintrc.json` to a flat `eslint.config.js` (`ng update @angular-eslint/schematics@22` / `convert-to-flat-config` schematic), and confirm the `@angular-eslint/builder` `lint` target still runs, before `npm run lint` is used as the phase gate.
- [ ] Re-run `npm run lint` and fix any new `@angular-eslint` 22 rule defaults; re-run `npm run e2e` (Playwright) to confirm the e2e harness still starts `ng serve`.
- [ ] Optional (deferred, decide at the time): zoneless change detection if not done in Phase 5.
- [ ] Update "Final state" below to describe the 16 -> 22 result.

DoD:
- [ ] All `@angular/*` packages on 22.x; unit tests pass.
- [ ] build/test-headless/lint green locally on the upgraded Node.
- [ ] Browser smoke test against local backend (results on the PR).
- [ ] Devin review findings resolved.
- [ ] PR ready for review against base; not merged.

## Final state

After Phase 4, `feature/praveen-demo-migration` holds the complete Angular 16.2 -> 20.3 migration (RxJS 7, standalone bootstrap, `inject()` DI, Playwright e2e, Vitest unit tests). Phases 5 and 6 extend the same base branch to Angular 21 and 22 via the same leaf-branch/PR flow. At every point the base branch awaits human review and a human-performed merge into `main`; Devin does not merge it.

## Cross-cutting

- Bump `@angular/material` and `@angular/cdk` in lockstep with `@angular/core` in every phase.
- Consider migrating `moment` / `@angular/material-moment-adapter` (listed in `allowedCommonJsDependencies` in `angular.json`) to Luxon or the native date adapter.
