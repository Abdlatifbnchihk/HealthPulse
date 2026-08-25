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
