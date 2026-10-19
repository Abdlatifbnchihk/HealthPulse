# HealthPulse — Jira Tickets & GitHub Branches
## Project Key: HP | Base Branch: `main`

---

## SPRINT 1: Foundation & Multi-Tenancy (Aug 23-25)
**Tasks:** HP-17 to HP-32 | **Duration:** 2-3 days

---

## EPIC 1: [HealthPulse] - Multi-Tenancy & Auth Base
**Jira Epic:** HP-1 | **Branch:** `feature/1-multi-tenancy-auth`
**Priority:** Highest | **Labels:** `foundation`, `multi-tenancy`, `auth`

---

### STORY: [Multi-Tenancy] - Create Tenants Migration & Model
**Jira Story:** HP-5 | **Branch:** `feature/2-create-tenants`
**Priority:** Highest | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-17** | [1e] Create migration file | `feature/3-tenants-migration` | `database/migrations/xxxx_create_tenants_table.php` |
| **HP-18** | [Tenants] Create Eloquent Model | `feature/4-tenants-model` | `app/Models/Tenant.php` |
| **HP-19** | [Tenants] Create Factory & Seeders | `feature/5-tenants-factory-seeder` | `database/factories/TenantFactory.php`, `database/seeders/TenantSeeder.php` |

---

### STORY: [Multi-Tenancy] - Create Users Migration & Model with Tenant Scope
**Jira Story:** HP-6 | **Branch:** `feature/6-create-users-with-scope`
**Priority:** Highest | **Story Points:** 8

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-20** | [Users] Create migration file | `feature/7-users-migration` | `database/migrations/xxxx_create_users_table.php` |
| **HP-21** | [Users] Create Eloquent Model | `feature/8-users-model` | `app/Models/User.php` |
| **HP-22** | [Users] Create TenantScope class | `feature/9-tenant-scope` | `app/Scopes/TenantScope.php` |
| **HP-23** | [Users] Create Factory & Seeders | `feature/10-users-factory-seeder` | `database/factories/UserFactory.php`, `database/seeders/UserSeeder.php` |

---

### STORY: [Multi-Tenancy] - Implement Global Tenant Middleware
**Jira Story:** HP-7 | **Branch:** `feature/11-tenant-middleware`
**Priority:** Highest | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-24** | [Middleware] Create ResolveTenant middleware | `feature/12-resolve-tenant-middleware` | `app/Http/Middleware/ResolveTenant.php` |
| **HP-25** | [Middleware] Create tenant() helper | `feature/13-tenant-helper` | `app/Helpers/tenant.php` |
| **HP-26** | [Middleware] Register in Kernel & Routes | `feature/14-register-middleware` | `bootstrap/app.php` |
| **HP-27** | [Middleware] Create TenantService container binding | `feature/15-tenant-service-binding` | `app/Providers/AppServiceProvider.php` |

---

## EPIC 2: [HealthPulse] - Doctor Schedule & Profiles
**Jira Epic:** HP-2 | **Branch:** `feature/16-doctor-schedules`
**Priority:** High | **Labels:** `doctor`, `scheduling`, `profiles`

---

### STORY: [Doctor Profiles] - Create Doctor_profiles Migration & Model
**Jira Story:** HP-8 | **Branch:** `feature/17-create-doctor-profiles`
**Priority:** High | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-28** | [DoctorProfiles] Create migration file | `feature/18-doctor-profiles-migration` | `database/migrations/xxxx_create_doctor_profiles_table.php` |
| **HP-29** | [DoctorProfiles] Create Eloquent Model | `feature/19-doctor-profiles-model` | `app/Models/DoctorProfile.php` |
| **HP-30** | [DoctorProfiles] Create Factory | `feature/20-doctor-profiles-factory` | `database/factories/DoctorProfileFactory.php` |

---

### STORY: [Doctor Schedules] - Create Doctor_schedules Migration & Model
**Jira Story:** HP-9 | **Branch:** `feature/21-create-doctor-schedules`
**Priority:** High | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-31** | [DoctorSchedules] Create migration file | `feature/22-doctor-schedules-migration` | `database/migrations/xxxx_create_doctor_schedules_table.php` |
| **HP-32** | [DoctorSchedules] Create Eloquent Model | `feature/23-doctor-schedules-model` | `app/Models/DoctorSchedule.php` |

---

## SPRINT 2: Booking System (Aug 26-28)
**Tasks:** HP-33 to HP-49 | **Duration:** 2-3 days

---

### STORY: [Doctor Schedules] - Implement Time-Slot Generation Logic
**Jira Story:** HP-10 | **Branch:** `feature/24-slot-generator`
**Priority:** High | **Story Points:** 8

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-33** | [SlotGenerator] Create service class | `feature/25-slot-generator-class` | `app/Services/SlotGenerator.php` |
| **HP-34** | [SlotGenerator] Implement day_of_week conversion | `feature/26-day-of-week-conversion` | `app/Services/SlotGenerator.php` |
| **HP-35** | [SlotGenerator] Implement slot splitting logic | `feature/27-slot-splitting` | `app/Services/SlotGenerator.php` |
| **HP-36** | [SlotGenerator] Exclude booked slots | `feature/28-exclude-booked-slots` | `app/Services/SlotGenerator.php` |
| **HP-37** | [SlotGenerator] Create unit tests | `feature/29-slot-generator-tests` | `tests/Unit/Services/SlotGeneratorTest.php` |

---

## EPIC 3: [HealthPulse] - Booking System & Concurrency
**Jira Epic:** HP-3 | **Branch:** `feature/30-booking-system`
**Priority:** High | **Labels:** `booking`, `concurrency`, `redis`

---

### STORY: [Appointments] - Create Appointments Migration & Model
**Jira Story:** HP-11 | **Branch:** `feature/31-create-appointments`
**Priority:** High | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-38** | [Appointments] Create migration file | `feature/32-appointments-migration` | `database/migrations/xxxx_create_appointments_table.php` |
| **HP-39** | [Appointments] Create Eloquent Model | `feature/33-appointments-model` | `app/Models/Appointment.php` |
| **HP-40** | [Appointments] Create Factory | `feature/34-appointments-factory` | `database/factories/AppointmentFactory.php` |

---

### STORY: [Appointments] - Implement Atomic Booking with Redis Locks
**Jira Story:** HP-12 | **Branch:** `feature/35-atomic-booking-redis`
**Priority:** Highest | **Story Points:** 13

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-41** | [BookingService] Create service class | `feature/36-booking-service-class` | `app/Services/BookingService.php` |
| **HP-42** | [BookingService] Implement Redis lock acquisition | `feature/37-redis-lock` | `app/Services/BookingService.php` |
| **HP-43** | [BookingService] Implement atomic DB transaction | `feature/38-atomic-transaction` | `app/Services/BookingService.php` |
| **HP-44** | [BookingService] Implement slot conflict detection | `feature/39-slot-conflict-detection` | `app/Services/BookingService.php` |
| **HP-45** | [BookingService] Add booking confirmation logic | `feature/40-booking-confirmation` | `app/Services/BookingService.php` |
| **HP-46** | [BookingService] Create integration tests | `feature/41-booking-service-tests` | `tests/Feature/Services/BookingServiceTest.php` |

---

## EPIC 4: [HealthPulse] - AI Pre-Consultation & SOAP Notes
**Jira Epic:** HP-4 | **Branch:** `feature/42-ai-intake-soap`
**Priority:** High | **Labels:** `ai`, `openai`, `soap`, `intake`

---

### STORY: [AI Intake] - Create Ai_patient_intakes Migration & Model
**Jira Story:** HP-13 | **Branch:** `feature/43-create-ai-intakes`
**Priority:** High | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-47** | [AiIntake] Create migration file | `feature/44-ai-intake-migration` | `database/migrations/xxxx_create_ai_patient_intakes_table.php` |
| **HP-48** | [AiIntake] Create Eloquent Model | `feature/45-ai-intake-model` | `app/Models/AiPatientIntake.php` |
| **HP-49** | [AiIntake] Create Factory | `feature/46-ai-intake-factory` | `database/factories/AiPatientIntakeFactory.php` |

---

## SPRINT 3: AI & SOAP Notes (Aug 29-30)
**Tasks:** HP-50 to HP-64 | **Duration:** 2 days

---

### STORY: [AI Intake] - Build Intake Schema & API Endpoint
**Jira Story:** HP-14 | **Branch:** `feature/47-intake-api`
**Priority:** High | **Story Points:** 8

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-50** | [IntakeAPI] Create FormRequest validation | `feature/48-intake-form-request` | `app/Http/Requests/StoreIntakeRequest.php` |
| **HP-51** | [IntakeAPI] Create Controller | `feature/49-intake-controller` | `app/Http/Controllers/Api/V1/IntakeController.php` |
| **HP-52** | [IntakeAPI] Create API routes | `feature/50-intake-routes` | `routes/api.php` |
| **HP-53** | [IntakeAPI] Create queue job for AI processing | `feature/51-intake-queue-job` | `app/Jobs/ProcessAiIntakeJob.php` |

---

### STORY: [Consultation Records] - Create Consultation_records Migration & Model
**Jira Story:** HP-15 | **Branch:** `feature/52-create-consultation-records`
**Priority:** High | **Story Points:** 5

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-54** | [ConsultationRecords] Create migration file | `feature/53-consultation-migration` | `database/migrations/xxxx_create_consultation_records_table.php` |
| **HP-55** | [ConsultationRecords] Create Eloquent Model | `feature/54-consultation-model` | `app/Models/ConsultationRecord.php` |
| **HP-56** | [ConsultationRecords] Create Factory | `feature/55-consultation-factory` | `database/factories/ConsultationRecordFactory.php` |

---

### STORY: [SOAP Notes] - Build SOAP Note Generator API Service
**Jira Story:** HP-16 | **Branch:** `feature/56-soap-generator`
**Priority:** High | **Story Points:** 13

| Jira Key | Sub-task | Branch | File Target |
|----------|----------|--------|-------------|
| **HP-57** | [SoapGenerator] Create service interface | `feature/57-soap-generator-interface` | `app/Services/Contracts/SoapGeneratorInterface.php` |
| **HP-58** | [SoapGenerator] Implement OpenAI driver | `feature/58-openai-driver` | `app/Services/SoapGenerators/OpenAiSoapGenerator.php` |
| **HP-59** | [SoapGenerator] Implement Claude driver | `feature/59-claude-driver` | `app/Services/SoapGenerators/ClaudeSoapGenerator.php` |
| **HP-60** | [SoapGenerator] Create prompt template | `feature/60-soap-prompt-template` | `app/Services/Prompts/soap_note_prompt.php` |
| **HP-61** | [SoapGenerator] Create API endpoint | `feature/61-soap-api-endpoint` | `routes/api.php`, `app/Http/Controllers/Api/V1/ConsultationController.php` |
| **HP-62** | [SoapGenerator] Create queue job | `feature/62-soap-queue-job` | `app/Jobs/GenerateSoapNoteJob.php` |
| **HP-63** | [SoapGenerator] Add retry & error handling | `feature/63-retry-error-handling` | `app/Services/SoapGenerators/*.php` |
| **HP-64** | [SoapGenerator] Create integration tests | `feature/64-soap-generator-tests` | `tests/Feature/Services/SoapGeneratorTest.php` |

---

## Git Branch Workflow

```bash
# Create all feature branches
git checkout main
git checkout -b feature/1-multi-tenancy-auth
git checkout main
git checkout -b feature/16-doctor-schedules
git checkout main
git checkout -b feature/30-booking-system
git checkout main
git checkout -b feature/42-ai-intake-soap

# Example: Create subtask branch
git checkout feature/2-create-tenants
git checkout -b feature/3-tenants-migration

# Merge flow
git checkout feature/2-create-tenants
git merge --no-ff feature/3-tenants-migration
git merge --no-ff feature/4-tenants-model
git merge --no-ff feature/5-tenants-factory-seeder

git checkout feature/1-multi-tenancy-auth
git merge --no-ff feature/2-create-tenants
git merge --no-ff feature/6-create-users-with-scope
git merge --no-ff feature/11-tenant-middleware

git checkout main
git merge --no-ff feature/1-multi-tenancy-auth
```

---

## Summary

| Sprint | Name | Jira Keys | Tasks | Dates |
|--------|------|-----------|-------|-------|
| **Sprint 1** | Foundation & Multi-Tenancy | HP-17 to HP-32 | 16 | Aug 23-25 |
| **Sprint 2** | Booking System | HP-33 to HP-49 | 17 | Aug 26-28 |
| **Sprint 3** | AI & SOAP Notes | HP-50 to HP-64 | 15 | Aug 29-30 |
| **TOTAL** | — | HP-17 to HP-64 | **48** | 7 days |

---

## Jira Issue Hierarchy

| Level | Jira Key | Title | Branch |
|-------|----------|-------|--------|
| **Epic** | HP-1 | Multi-Tenancy & Auth Base | `feature/1-multi-tenancy-auth` |
| Story | HP-5 | Create Tenants Migration & Model | `feature/2-create-tenants` |
| Task | HP-17 | [Tenants] Create migration file | `feature/3-tenants-migration` |
| Task | HP-18 | [Tenants] Create Eloquent Model | `feature/4-tenants-model` |
| Task | HP-19 | [Tenants] Create Factory & Seeders | `feature/5-tenants-factory-seeder` |
| Story | HP-6 | Create Users Migration & Model | `feature/6-create-users-with-scope` |
| Task | HP-20 | [Users] Create migration file | `feature/7-users-migration` |
| Task | HP-21 | [Users] Create Eloquent Model | `feature/8-users-model` |
| Task | HP-22 | [Users] Create TenantScope class | `feature/9-tenant-scope` |
| Task | HP-23 | [Users] Create Factory & Seeders | `feature/10-users-factory-seeder` |
| Story | HP-7 | Implement Global Tenant Middleware | `feature/11-tenant-middleware` |
| Task | HP-24 | [Middleware] Create ResolveTenant middleware | `feature/12-resolve-tenant-middleware` |
| Task | HP-25 | [Middleware] Create tenant() helper | `feature/13-tenant-helper` |
| Task | HP-26 | [Middleware] Register in Kernel & Routes | `feature/14-register-middleware` |
| Task | HP-27 | [Middleware] Create TenantService container binding | `feature/15-tenant-service-binding` |
| **Epic** | HP-2 | Doctor Schedule & Profiles | `feature/16-doctor-schedules` |
| Story | HP-8 | Create Doctor_profiles Migration & Model | `feature/17-create-doctor-profiles` |
| Task | HP-28 | [DoctorProfiles] Create migration file | `feature/18-doctor-profiles-migration` |
| Task | HP-29 | [DoctorProfiles] Create Eloquent Model | `feature/19-doctor-profiles-model` |
| Task | HP-30 | [DoctorProfiles] Create Factory | `feature/20-doctor-profiles-factory` |
| Story | HP-9 | Create Doctor_schedules Migration & Model | `feature/21-create-doctor-schedules` |
| Task | HP-31 | [DoctorSchedules] Create migration file | `feature/22-doctor-schedules-migration` |
| Task | HP-32 | [DoctorSchedules] Create Eloquent Model | `feature/23-doctor-schedules-model` |
| Story | HP-10 | Implement Time-Slot Generation Logic | `feature/24-slot-generator` |
| Task | HP-33 | [SlotGenerator] Create service class | `feature/25-slot-generator-class` |
| Task | HP-34 | [SlotGenerator] Implement day_of_week conversion | `feature/26-day-of-week-conversion` |
| Task | HP-35 | [SlotGenerator] Implement slot splitting logic | `feature/27-slot-splitting` |
| Task | HP-36 | [SlotGenerator] Exclude booked slots | `feature/28-exclude-booked-slots` |
| Task | HP-37 | [SlotGenerator] Create unit tests | `feature/29-slot-generator-tests` |
| **Epic** | HP-3 | Booking System & Concurrency | `feature/30-booking-system` |
| Story | HP-11 | Create Appointments Migration & Model | `feature/31-create-appointments` |
| Task | HP-38 | [Appointments] Create migration file | `feature/32-appointments-migration` |
| Task | HP-39 | [Appointments] Create Eloquent Model | `feature/33-appointments-model` |
| Task | HP-40 | [Appointments] Create Factory | `feature/34-appointments-factory` |
| Story | HP-12 | Implement Atomic Booking with Redis Locks | `feature/35-atomic-booking-redis` |
| Task | HP-41 | [BookingService] Create service class | `feature/36-booking-service-class` |
| Task | HP-42 | [BookingService] Implement Redis lock acquisition | `feature/37-redis-lock` |
| Task | HP-43 | [BookingService] Implement atomic DB transaction | `feature/38-atomic-transaction` |
| Task | HP-44 | [BookingService] Implement slot conflict detection | `feature/39-slot-conflict-detection` |
| Task | HP-45 | [BookingService] Add booking confirmation logic | `feature/40-booking-confirmation` |
| Task | HP-46 | [BookingService] Create integration tests | `feature/41-booking-service-tests` |
| **Epic** | HP-4 | AI Pre-Consultation & SOAP Notes | `feature/42-ai-intake-soap` |
| Story | HP-13 | Create Ai_patient_intakes Migration & Model | `feature/43-create-ai-intakes` |
| Task | HP-47 | [AiIntake] Create migration file | `feature/44-ai-intake-migration` |
| Task | HP-48 | [AiIntake] Create Eloquent Model | `feature/45-ai-intake-model` |
| Task | HP-49 | [AiIntake] Create Factory | `feature/46-ai-intake-factory` |
| Story | HP-14 | Build Intake Schema & API Endpoint | `feature/47-intake-api` |
| Task | HP-50 | [IntakeAPI] Create FormRequest validation | `feature/48-intake-form-request` |
| Task | HP-51 | [IntakeAPI] Create Controller | `feature/49-intake-controller` |
| Task | HP-52 | [IntakeAPI] Create API routes | `feature/50-intake-routes` |
| Task | HP-53 | [IntakeAPI] Create queue job for AI processing | `feature/51-intake-queue-job` |
| Story | HP-15 | Create Consultation_records Migration & Model | `feature/52-create-consultation-records` |
| Task | HP-54 | [ConsultationRecords] Create migration file | `feature/53-consultation-migration` |
| Task | HP-55 | [ConsultationRecords] Create Eloquent Model | `feature/54-consultation-model` |
| Task | HP-56 | [ConsultationRecords] Create Factory | `feature/55-consultation-factory` |
| Story | HP-16 | Build SOAP Note Generator API Service | `feature/56-soap-generator` |
| Task | HP-57 | [SoapGenerator] Create service interface | `feature/57-soap-generator-interface` |
| Task | HP-58 | [SoapGenerator] Implement OpenAI driver | `feature/58-openai-driver` |
| Task | HP-59 | [SoapGenerator] Implement Claude driver | `feature/59-claude-driver` |
| Task | HP-60 | [SoapGenerator] Create prompt template | `feature/60-soap-prompt-template` |
| Task | HP-61 | [SoapGenerator] Create API endpoint | `feature/61-soap-api-endpoint` |
| Task | HP-62 | [SoapGenerator] Create queue job | `feature/62-soap-queue-job` |
| Task | HP-63 | [SoapGenerator] Add retry & error handling | `feature/63-retry-error-handling` |
| Task | HP-64 | [SoapGenerator] Create integration tests | `feature/64-soap-generator-tests` |


---

# ADDENDUM (2026-10-18) — HP-65 & HP-66 (Backend Completion + Frontend)

**Jira Epics:** HP-65, HP-66 | **Base Branch:** `main` | **New Tasks:** 122 (HP-68 → HP-189)

## EPIC 5: [HealthPulse] - Backend API Completion & Hardening
**Jira Epic:** HP-65 | **Branch:** `feature/65-backend-api-completion` | **Priority:** High

| Jira Key | Task | Branch | File Target |
|---|---|---|---|
| **HP-68** | [Auth] Install & configure Laravel Sanctum for API auth | `feature/65-install-configure-laravel-sanctum-for-api-auth` | `composer.json, config/sanctum.php` |
| **HP-69** | [Auth] Add HasApiTokens to User model + token abilities | `feature/66-add-hasapitokens-to-user-model-token-abilities` | `app/Models/User.php` |
| **HP-70** | [API] Create routes/api.php with v1 prefix + middleware groups | `feature/67-create-routes-api-php-with-v1-prefix-middleware-groups` | `routes/api.php, bootstrap/app.php` |
| **HP-71** | [Auth] Create AuthController (register, login, logout, me) | `feature/68-create-authcontroller-register-login-logout-me` | `app/Http/Controllers/Api/V1/AuthController.php, routes/api.php` |
| **HP-72** | [FormRequest] Create RegisterRequest | `feature/69-create-registerrequest` | `app/Http/Requests/RegisterRequest.php` |
| **HP-73** | [FormRequest] Create LoginRequest | `feature/70-create-loginrequest` | `app/Http/Requests/LoginRequest.php` |
| **HP-74** | [FormRequest] Create ForgotPasswordRequest | `feature/71-create-forgotpasswordrequest` | `app/Http/Requests/ForgotPasswordRequest.php` |
| **HP-75** | [FormRequest] Create ResetPasswordRequest | `feature/72-create-resetpasswordrequest` | `app/Http/Requests/ResetPasswordRequest.php` |
| **HP-76** | [Auth] Implement password reset flow | `feature/73-implement-password-reset-flow` | `config/auth.php, app/Http/Controllers/Api/V1/AuthController.php` |
| **HP-77** | [Security] Create EnsureRole middleware | `feature/74-create-ensurerole-middleware` | `app/Http/Middleware/EnsureRole.php, bootstrap/app.php` |
| **HP-78** | [Security] Register all policies + super-admin Gate::before | `feature/75-register-all-policies-super-admin-gate-before` | `app/Providers/AppServiceProvider.php` |
| **HP-79** | [Security] Configure API rate limiting per route group | `feature/76-configure-api-rate-limiting-per-route-group` | `bootstrap/app.php, app/Providers/AppServiceProvider.php` |
| **HP-80** | [API] Create global JSON exception handler | `feature/77-create-global-json-exception-handler` | `bootstrap/app.php, app/Exceptions/Handler.php` |
| **HP-81** | [API] Create ApiResponse trait/helper | `feature/78-create-apiresponse-trait-helper` | `app/Http/Responses/ApiResponse.php, app/Traits/` |
| **HP-82** | [Policy] Create TenantPolicy | `feature/79-create-tenantpolicy` | `app/Policies/TenantPolicy.php` |
| **HP-83** | [Policy] Create UserPolicy | `feature/80-create-userpolicy` | `app/Policies/UserPolicy.php` |
| **HP-84** | [Policy] Create DoctorProfilePolicy | `feature/81-create-doctorprofilepolicy` | `app/Policies/DoctorProfilePolicy.php` |
| **HP-85** | [Policy] Create DoctorSchedulePolicy | `feature/82-create-doctorschedulepolicy` | `app/Policies/DoctorSchedulePolicy.php` |
| **HP-86** | [Policy] Create AppointmentPolicy | `feature/83-create-appointmentpolicy` | `app/Policies/AppointmentPolicy.php` |
| **HP-87** | [Policy] Create AiPatientIntakePolicy | `feature/84-create-aipatientintakepolicy` | `app/Policies/AiPatientIntakePolicy.php` |
| **HP-88** | [Policy] Create ConsultationRecordPolicy | `feature/85-create-consultationrecordpolicy` | `app/Policies/ConsultationRecordPolicy.php` |
| **HP-89** | [FormRequest] Create StoreTenantRequest | `feature/86-create-storetenantrequest` | `app/Http/Requests/StoreTenantRequest.php` |
| **HP-90** | [FormRequest] Create UpdateTenantRequest | `feature/87-create-updatetenantrequest` | `app/Http/Requests/UpdateTenantRequest.php` |
| **HP-91** | [FormRequest] Create StoreUserRequest | `feature/88-create-storeuserrequest` | `app/Http/Requests/StoreUserRequest.php` |
| **HP-92** | [FormRequest] Create UpdateUserRequest | `feature/89-create-updateuserrequest` | `app/Http/Requests/UpdateUserRequest.php` |
| **HP-93** | [FormRequest] Create UpdateProfileRequest | `feature/90-create-updateprofilerequest` | `app/Http/Requests/UpdateProfileRequest.php` |
| **HP-94** | [FormRequest] Create StoreDoctorProfileRequest | `feature/91-create-storedoctorprofilerequest` | `app/Http/Requests/StoreDoctorProfileRequest.php` |
| **HP-95** | [FormRequest] Create UpdateDoctorProfileRequest | `feature/92-create-updatedoctorprofilerequest` | `app/Http/Requests/UpdateDoctorProfileRequest.php` |
| **HP-96** | [FormRequest] Create StoreDoctorScheduleRequest | `feature/93-create-storedoctorschedulerequest` | `app/Http/Requests/StoreDoctorScheduleRequest.php` |
| **HP-97** | [FormRequest] Create UpdateDoctorScheduleRequest | `feature/94-create-updatedoctorschedulerequest` | `app/Http/Requests/UpdateDoctorScheduleRequest.php` |
| **HP-98** | [FormRequest] Create StoreAppointmentRequest | `feature/95-create-storeappointmentrequest` | `app/Http/Requests/StoreAppointmentRequest.php` |
| **HP-99** | [FormRequest] Create RescheduleAppointmentRequest | `feature/96-create-rescheduleappointmentrequest` | `app/Http/Requests/RescheduleAppointmentRequest.php` |
| **HP-100** | [FormRequest] Create UpdateAppointmentStatusRequest | `feature/97-create-updateappointmentstatusrequest` | `app/Http/Requests/UpdateAppointmentStatusRequest.php` |
| **HP-101** | [FormRequest] Create UpdateIntakeRequest | `feature/98-create-updateintakerequest` | `app/Http/Requests/UpdateIntakeRequest.php` |
| **HP-102** | [FormRequest] Create StoreConsultationRequest | `feature/99-create-storeconsultationrequest` | `app/Http/Requests/StoreConsultationRequest.php` |
| **HP-103** | [FormRequest] Create UpdateConsultationRequest | `feature/100-create-updateconsultationrequest` | `app/Http/Requests/UpdateConsultationRequest.php` |
| **HP-104** | [API] Create TenantController + routes | `feature/101-create-tenantcontroller-routes` | `app/Http/Controllers/Api/V1/TenantController.php, routes/api.php` |
| **HP-105** | [API] Create UserController + routes | `feature/102-create-usercontroller-routes` | `app/Http/Controllers/Api/V1/UserController.php, routes/api.php` |
| **HP-106** | [API] Create DoctorProfileController + routes | `feature/103-create-doctorprofilecontroller-routes` | `app/Http/Controllers/Api/V1/DoctorProfileController.php, routes/api.php` |
| **HP-107** | [API] Create DoctorScheduleController + routes | `feature/104-create-doctorschedulecontroller-routes` | `app/Http/Controllers/Api/V1/DoctorScheduleController.php, routes/api.php` |
| **HP-108** | [API] Create AvailabilityController | `feature/105-create-availabilitycontroller` | `app/Http/Controllers/Api/V1/AvailabilityController.php, routes/api.php` |
| **HP-109** | [API] Create AppointmentController + routes | `feature/106-create-appointmentcontroller-routes` | `app/Http/Controllers/Api/V1/AppointmentController.php, routes/api.php` |
| **HP-110** | [API] Create IntakeController + routes | `feature/107-create-intakecontroller-routes` | `app/Http/Controllers/Api/V1/IntakeController.php, routes/api.php` |
| **HP-111** | [API] Create ConsultationController + routes | `feature/108-create-consultationcontroller-routes` | `app/Http/Controllers/Api/V1/ConsultationController.php, routes/api.php` |
| **HP-112** | [API] Create ProfileController | `feature/109-create-profilecontroller` | `app/Http/Controllers/Api/V1/ProfileController.php, routes/api.php` |
| **HP-113** | [API] Create DashboardController | `feature/110-create-dashboardcontroller` | `app/Http/Controllers/Api/V1/DashboardController.php, routes/api.php` |
| **HP-114** | [Resource] Create TenantResource + TenantCollection | `feature/111-create-tenantresource-tenantcollection` | `app/Http/Resources/TenantResource.php, app/Http/Resources/TenantCollection.php` |
| **HP-115** | [Resource] Create UserResource + UserCollection | `feature/112-create-userresource-usercollection` | `app/Http/Resources/UserResource.php, app/Http/Resources/UserCollection.php` |
| **HP-116** | [Resource] Create DoctorProfileResource + DoctorProfileCollection | `feature/113-create-doctorprofileresource-doctorprofilecollection` | `app/Http/Resources/DoctorProfileResource.php, app/Http/Resources/DoctorProfileCollection.php` |
| **HP-117** | [Resource] Create DoctorScheduleResource + DoctorScheduleCollection | `feature/114-create-doctorscheduleresource-doctorschedulecollection` | `app/Http/Resources/DoctorScheduleResource.php, app/Http/Resources/DoctorScheduleCollection.php` |
| **HP-118** | [Resource] Create AppointmentResource + AppointmentCollection | `feature/115-create-appointmentresource-appointmentcollection` | `app/Http/Resources/AppointmentResource.php, app/Http/Resources/AppointmentCollection.php` |
| **HP-119** | [Resource] Create AiPatientIntakeResource + AiPatientIntakeCollection | `feature/116-create-aipatientintakeresource-aipatientintakecollection` | `app/Http/Resources/AiPatientIntakeResource.php, app/Http/Resources/AiPatientIntakeCollection.php` |
| **HP-120** | [Resource] Create ConsultationRecordResource + ConsultationRecordCollection | `feature/117-create-consultationrecordresource-consultationrecordcollection` | `app/Http/Resources/ConsultationRecordResource.php, app/Http/Resources/ConsultationRecordCollection.php` |
| **HP-121** | [Resource] Create AvailabilitySlotResource + AvailabilitySlotCollection | `feature/118-create-availabilityslotresource-availabilityslotcollection` | `app/Http/Resources/AvailabilitySlotResource.php, app/Http/Resources/AvailabilitySlotCollection.php` |
| **HP-122** | [Resource] Create AuthResource | `feature/119-create-authresource` | `app/Http/Resources/AuthResource.php` |
| **HP-123** | [Events] Create AppointmentBooked + AppointmentCancelled events and listeners | `feature/120-create-appointmentbooked-appointmentcancelled-events-and-listeners` | `app/Events/, app/Listeners/` |
| **HP-124** | [Notifications] Create booking confirmation & cancellation notifications | `feature/121-create-booking-confirmation-cancellation-notifications` | `app/Notifications/` |
| **HP-125** | [Observer] Create TenantObserver + register | `feature/122-create-tenantobserver-register` | `app/Observers/TenantObserver.php` |
| **HP-126** | [Observer] Create AppointmentObserver + register | `feature/123-create-appointmentobserver-register` | `app/Observers/AppointmentObserver.php` |
| **HP-127** | [Factory] Create DoctorScheduleFactory | `feature/124-create-doctorschedulefactory` | `database/factories/DoctorScheduleFactory.php` |
| **HP-128** | [Factory] Create ConsultationRecordFactory | `feature/125-create-consultationrecordfactory` | `database/factories/ConsultationRecordFactory.php` |
| **HP-129** | [Factory] Create AppointmentFactory | `feature/126-create-appointmentfactory` | `database/factories/AppointmentFactory.php` |
| **HP-130** | [Factory] Create AiPatientIntakeFactory | `feature/127-create-aipatientintakefactory` | `database/factories/AiPatientIntakeFactory.php` |
| **HP-131** | [Seeder] Create UserSeeder | `feature/128-create-userseeder` | `database/seeders/` |
| **HP-132** | [Seeder] Create DoctorProfileSeeder + DoctorScheduleSeeder | `feature/129-create-doctorprofileseeder-doctorscheduleseeder` | `database/seeders/` |
| **HP-133** | [Seeder] Create AppointmentSeeder + DemoDataSeeder | `feature/130-create-appointmentseeder-demodataseeder` | `database/seeders/` |
| **HP-134** | [Config] Configure Redis queue + AI providers | `feature/131-configure-redis-queue-ai-providers` | `config/queue.php, config/services.php, .env.example` |
| **HP-135** | [Hardening] Add SoftDeletes to Tenant | `feature/132-add-softdeletes-to-tenant` | `app/Models/Tenant.php` |
| **HP-136** | [Refactor] Normalize model & relationship naming | `feature/133-normalize-model-relationship-naming` | `app/Models/*.php` |
| **HP-137** | [Docs] Generate OpenAPI/Scribe API documentation | `feature/134-generate-openapi-scribe-api-documentation` | `config/scribe.php, docs/` |
| **HP-138** | [Tests] Feature tests: Auth flows | `feature/135-feature-tests-auth-flows` | `tests/Feature/` |
| **HP-139** | [Tests] Feature tests: Tenant & User CRUD + authorization | `feature/136-feature-tests-tenant-user-crud-authorization` | `tests/Feature/` |
| **HP-140** | [Tests] Feature tests: Doctor profile & schedule CRUD | `feature/137-feature-tests-doctor-profile-schedule-crud` | `tests/Feature/` |
| **HP-141** | [Tests] Feature tests: Booking & availability endpoints | `feature/138-feature-tests-booking-availability-endpoints` | `tests/Feature/` |
| **HP-142** | [Tests] Feature tests: Intake & consultation endpoints | `feature/139-feature-tests-intake-consultation-endpoints` | `tests/Feature/` |
| **HP-143** | [API] Create NotificationController + routes | `feature/140-create-notificationcontroller-routes` | `app/Http/Controllers/Api/V1/NotificationController.php, routes/api.php` |

## EPIC 6: [HealthPulse] - Frontend Web Application
**Jira Epic:** HP-66 | **Branch:** `feature/66-frontend-web-application` | **Priority:** High

| Jira Key | Task | Branch | File Target |
|---|---|---|---|
| **HP-144** | [FE Setup] Scaffold React SPA structure in resources/js | `feature/141-scaffold-react-spa-structure-in-resources-js` | `resources/js/` |
| **HP-145** | [FE Setup] Configure React Router with route tree + lazy loading | `feature/142-configure-react-router-with-route-tree-lazy-loading` | `resources/js/` |
| **HP-146** | [FE Setup] Create API client (axios) with interceptors | `feature/143-create-api-client-axios-with-interceptors` | `resources/js/` |
| **HP-147** | [FE Setup] Create auth context/store | `feature/144-create-auth-context-store` | `resources/js/` |
| **HP-148** | [FE Setup] Create protected + role-based route guards | `feature/145-create-protected-role-based-route-guards` | `resources/js/` |
| **HP-149** | [FE Setup] Set up server-state data fetching (React Query) | `feature/146-set-up-server-state-data-fetching-react-query` | `resources/js/` |
| **HP-150** | [FE Setup] Build design system: Tailwind theme & tokens | `feature/147-build-design-system-tailwind-theme-tokens` | `resources/js/` |
| **HP-151** | [FE UI] Build shared UI kit | `feature/148-build-shared-ui-kit` | `resources/js/` |
| **HP-152** | [FE Setup] Global app providers | `feature/149-global-app-providers` | `resources/js/` |
| **HP-153** | [FE Auth] Build Login page | `feature/150-build-login-page` | `resources/js/` |
| **HP-154** | [FE Auth] Build Register page | `feature/151-build-register-page` | `resources/js/` |
| **HP-155** | [FE Auth] Build Forgot password page | `feature/152-build-forgot-password-page` | `resources/js/` |
| **HP-156** | [FE Auth] Build Reset password page | `feature/153-build-reset-password-page` | `resources/js/` |
| **HP-157** | [FE Auth] Build Auth layout + form validation | `feature/154-build-auth-layout-form-validation` | `resources/js/` |
| **HP-158** | [FE Layout] Build public layout | `feature/155-build-public-layout` | `resources/js/` |
| **HP-159** | [FE Layout] Build dashboard shell | `feature/156-build-dashboard-shell` | `resources/js/` |
| **HP-160** | [FE Layout] Implement role-based navigation menu | `feature/157-implement-role-based-navigation-menu` | `resources/js/` |
| **HP-161** | [FE Patient] Build patient dashboard | `feature/158-build-patient-dashboard` | `resources/js/` |
| **HP-162** | [FE Patient] Build doctor directory page | `feature/159-build-doctor-directory-page` | `resources/js/` |
| **HP-163** | [FE Patient] Build doctor detail page with availability | `feature/160-build-doctor-detail-page-with-availability` | `resources/js/` |
| **HP-164** | [FE Patient] Build booking flow | `feature/161-build-booking-flow` | `resources/js/` |
| **HP-165** | [FE Patient] Build my appointments list page | `feature/162-build-my-appointments-list-page` | `resources/js/` |
| **HP-166** | [FE Patient] Build appointment detail page | `feature/163-build-appointment-detail-page` | `resources/js/` |
| **HP-167** | [FE Patient] Build cancel/reschedule UI | `feature/164-build-cancel-reschedule-ui` | `resources/js/` |
| **HP-168** | [FE Patient] Build AI pre-consultation intake form | `feature/165-build-ai-pre-consultation-intake-form` | `resources/js/` |
| **HP-169** | [FE Patient] Build intake status / AI summary view | `feature/166-build-intake-status-ai-summary-view` | `resources/js/` |
| **HP-170** | [FE Patient] Build patient profile & settings page | `feature/167-build-patient-profile-settings-page` | `resources/js/` |
| **HP-171** | [FE Doctor] Build doctor dashboard | `feature/168-build-doctor-dashboard` | `resources/js/` |
| **HP-172** | [FE Doctor] Build doctor profile management page | `feature/169-build-doctor-profile-management-page` | `resources/js/` |
| **HP-173** | [FE Doctor] Build weekly schedule management | `feature/170-build-weekly-schedule-management` | `resources/js/` |
| **HP-174** | [FE Doctor] Build doctor appointments list + filters | `feature/171-build-doctor-appointments-list-filters` | `resources/js/` |
| **HP-175** | [FE Doctor] Build appointment detail + intake review | `feature/172-build-appointment-detail-intake-review` | `resources/js/` |
| **HP-176** | [FE Doctor] Build consultation workspace | `feature/173-build-consultation-workspace` | `resources/js/` |
| **HP-177** | [FE Doctor] Build SOAP note generation UI | `feature/174-build-soap-note-generation-ui` | `resources/js/` |
| **HP-178** | [FE Doctor] Build consultation records list/detail | `feature/175-build-consultation-records-list-detail` | `resources/js/` |
| **HP-179** | [FE Admin] Build admin dashboard with analytics | `feature/176-build-admin-dashboard-with-analytics` | `resources/js/` |
| **HP-180** | [FE Admin] Build tenant management | `feature/177-build-tenant-management` | `resources/js/` |
| **HP-181** | [FE Admin] Build tenant detail + subscription view | `feature/178-build-tenant-detail-subscription-view` | `resources/js/` |
| **HP-182** | [FE Admin] Build users management | `feature/179-build-users-management` | `resources/js/` |
| **HP-183** | [FE] Implement consistent form validation & error handling | `feature/180-implement-consistent-form-validation-error-handling` | `-` |
| **HP-184** | [FE] Implement toast notifications + error boundary UX | `feature/181-implement-toast-notifications-error-boundary-ux` | `-` |
| **HP-185** | [FE] Responsive design pass + accessibility | `feature/182-responsive-design-pass-accessibility` | `-` |
| **HP-186** | [FE] Loading / empty / error states across screens | `feature/183-loading-empty-error-states-across-screens` | `-` |
| **HP-187** | [FE] Frontend component tests | `feature/184-frontend-component-tests` | `-` |
| **HP-188** | [FE] E2E tests for critical flows | `feature/185-e2e-tests-for-critical-flows` | `-` |
| **HP-189** | [FE] Build & env configuration | `feature/186-build-env-configuration` | `-` |

## Updated Summary

| Sprint | Name | Jira Keys | Tasks | Dates |
|---|---|---|---|---|
| Sprint 1 | Foundation & Multi-Tenancy | HP-17 to HP-32 | 16 | Aug 23-25 |
| Sprint 2 | Booking System | HP-33 to HP-49 | 17 | Aug 26-28 |
| Sprint 3 | AI & SOAP Notes | HP-50 to HP-64 | 15 | Aug 29-30 |
| Sprint 4+ (tentative) | Backend API Completion | HP-68 to HP-143 | 76 | TBD |
| Sprint 5+ (tentative) | Frontend Web Application | HP-144 to HP-189 | 46 | TBD |
| **TOTAL** | — | HP-17 to HP-189 | **170** | — |
