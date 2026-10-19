# HealthPulse — Jira Project Roadmap
## Project Key: HP | Stack: Laravel 13 + MySQL 8.0 + Redis + React.js

---

## EPIC 1: [HealthPulse] - Multi-Tenancy & Auth Base
**Priority:** Highest | **Labels:** `foundation`, `multi-tenancy`, `auth`
**Description:** Implement the core multi-tenancy architecture using single-database tenant_id scope strategy. Every database query must apply a global Scope on tenant_id derived from the authenticated user.

### STORY: [Multi-Tenancy] - Create Tenants Migration & Model
**Type:** Story | **Priority:** Highest | **Story Points:** 5
**Description:** Create the Tenants table migration and Eloquent model to isolate clinics and manage SaaS billing state.
**Acceptance Criteria:**
- Migration creates `tenants` table with fields: `id`, `name`, `slug` (unique), `subscription_status`, `trial_ends_at`, `timestamps`
- `subscription_status` uses enum: active, trial, suspended, cancelled
- Model uses `HasFactory`, `SoftDeletes`
- Slug is auto-generated from name using Laravel's Str::slug()

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [Tenants] - Create migration file | Create `database/migrations/xxxx_create_tenants_table.php` with all fields, indexes on `slug` and `subscription_status` |
| SUBTASK: [Tenants] - Create Eloquent Model | Create `app/Models/Tenant.php` with fillable fields, casts for `subscription_status` and `trial_ends_at` |
| SUBTASK: [Tenants] - Create Factory & Seeders | Create `TenantFactory` with fake data and `TenantSeeder` for development |

---

### STORY: [Multi-Tenancy] - Create Users Migration & Model with Tenant Scope
**Type:** Story | **Priority:** Highest | **Story Points:** 8
**Description:** Create the Users table with nullable `tenant_id` FK and implement global scope for tenant isolation.
**Acceptance Criteria:**
- Migration creates `users` table with: `id`, `tenant_id` (nullable FK → tenants.id), `email` (unique), `name`, `password`, `role` (enum: super_admin, doctor, patient), `phone`, `timestamps`
- `TenantScope` applied globally on User model
- Super admins have `tenant_id = NULL` and bypass scope
- Model relationships: `belongsTo(Tenant)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [Users] - Create migration file | Create `database/migrations/xxxx_create_users_table.php` with tenant_id FK, index on `tenant_id` and `role` |
| SUBTASK: [Users] - Create Eloquent Model | Create `app/Models/User.php` with TenantScope, fillable fields, role casts |
| SUBTASK: [Users] - Create TenantScope class | Create `app/Scopes/TenantScope.php` that filters by `tenant_id = auth()->user()->tenant_id` |
| SUBTASK: [Users] - Create Factory & Seeders | Create `UserFactory` with role-based states (doctor, patient, super_admin) |

---

### STORY: [Multi-Tenancy] - Implement Global Tenant Middleware
**Type:** Story | **Priority:** Highest | **Story Points:** 5
**Description:** Create middleware that resolves the current tenant from the authenticated user and sets it application-wide.
**Acceptance Criteria:**
- Middleware `ResolveTenant` sets `app('tenant')` from authenticated user's `tenant_id`
- Middleware registers tenant in service container
- Tenant ID accessible via `tenant()` helper function
- Applied globally to all `api` and `web` routes

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [Middleware] - Create ResolveTenant middleware | Create `app/Http/Middleware/ResolveTenant.php` that resolves tenant from auth user |
| SUBTASK: [Middleware] - Create tenant() helper | Create `app/Helpers/tenant.php` helper function returning current tenant instance |
| SUBTASK: [Middleware] - Register in Kernel & Routes | Register middleware in `bootstrap/app.php` or `Http/Kernel.php` for api/web groups |
| SUBTASK: [Middleware] - Create TenantService container binding | Bind tenant singleton in `AppServiceProvider` boot method |

---

## EPIC 2: [HealthPulse] - Doctor Schedule & Profiles
**Priority:** High | **Labels:** `doctor`, `scheduling`, `profiles`
**Description:** Build the doctor profile management and schedule engine with time-slot generation using day_of_week (TINYINT 1=Monday, 7=Sunday).

### STORY: [Doctor Profiles] - Create Doctor_profiles Migration & Model
**Type:** Story | **Priority:** High | **Story Points:** 5
**Description:** Create the Doctor_profiles table linking users to their professional details.
**Acceptance Criteria:**
- Migration creates `doctor_profiles` table: `id`, `user_id` (unique FK → users.id), `tenant_id` (FK → tenants.id), `specialty`, `consultation_fee` (decimal), `slot_duration` (integer, minutes), `timestamps`
- Unique constraint on `(user_id, tenant_id)`
- Model relationships: `belongsTo(User)`, `belongsTo(Tenant)`, `hasMany(DoctorSchedule)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [DoctorProfiles] - Create migration file | Create migration with unique index on `user_id`, composite index on `(tenant_id, specialty)` |
| SUBTASK: [DoctorProfiles] - Create Eloquent Model | Create `app/Models/DoctorProfile.php` with relationships and fillable fields |
| SUBTASK: [DoctorProfiles] - Create Factory | Create `DoctorProfileFactory` with specialty and fee fake data |

---

### STORY: [Doctor Schedules] - Create Doctor_schedules Migration & Model
**Type:** Story | **Priority:** High | **Story Points:** 5
**Description:** Create the Doctor_schedules table for weekly recurring availability using day_of_week TINYINT.
**Acceptance Criteria:**
- Migration creates `doctor_schedules` table: `id`, `doctor_id` (FK → users.id), `tenant_id` (FK → tenants.id), `day_of_week` (TINYINT, 1-7), `start_time` (time), `end_time` (time), `slot_duration_minutes` (integer), `is_active` (boolean, default true), `timestamps`
- Check constraint: `day_of_week BETWEEN 1 AND 7`
- Check constraint: `end_time > start_time`
- Model relationships: `belongsTo(User, 'doctor_id')`, `belongsTo(Tenant)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [DoctorSchedules] - Create migration file | Create migration with check constraints, index on `(doctor_id, day_of_week, is_active)` |
| SUBTASK: [DoctorSchedules] - Create Eloquent Model | Create `app/Models/DoctorSchedule.php` with scopes for active schedules and day filtering |

---

### STORY: [Doctor Schedules] - Implement Time-Slot Generation Logic
**Type:** Story | **Priority:** High | **Story Points:** 8
**Description:** Build service class to generate available time slots from doctor schedules using day_of_week TINYINT.
**Acceptance Criteria:**
- Service class `SlotGenerator` takes doctor_id and date, returns available slots
- Converts date to day_of_week (1-7) to query matching schedules
- Generates slots based on `start_time`, `end_time`, and `slot_duration_minutes`
- Excludes slots that conflict with existing appointments
- Returns array of `{start, end, available}` objects

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [SlotGenerator] - Create service class | Create `app/Services/SlotGenerator.php` with `generateForDoctor(doctorId, date)` method |
| SUBTASK: [SlotGenerator] - Implement day_of_week conversion | Convert Carbon date to TINYINT (1=Mon, 7=Sun) for schedule matching |
| SUBTASK: [SlotGenerator] - Implement slot splitting logic | Split time ranges into slots using `slot_duration_minutes` from schedule |
| SUBTASK: [SlotGenerator] - Exclude booked slots | Query Appointments table to mark conflicting slots as unavailable |
| SUBTASK: [SlotGenerator] - Create unit tests | Test slot generation, edge cases (no schedule, overlapping appointments) |

---

## EPIC 3: [HealthPulse] - Booking System & Concurrency
**Priority:** High | **Labels:** `booking`, `concurrency`, `redis`
**Description:** Implement the appointment booking system with atomic transactions and Redis-based double-booking protection.

### STORY: [Appointments] - Create Appointments Migration & Model
**Type:** Story | **Priority:** High | **Story Points:** 5
**Description:** Create the Appointments table for storing patient-doctor booking records.
**Acceptance Criteria:**
- Migration creates `appointments` table: `id`, `tenant_id` (FK → tenants.id), `patient_id` (FK → users.id), `doctor_id` (FK → users.id), `appointment_date` (date), `start_time` (time), `end_time` (time), `status` (enum: pending, confirmed, completed, canceled), `notes` (text, nullable), `timestamps`
- Composite unique index on `(tenant_id, doctor_id, appointment_date, start_time)` to enforce single-booking at DB level
- Model relationships: `belongsTo(Tenant)`, `belongsTo(User, 'patient_id')`, `belongsTo(User, 'doctor_id')`, `hasOne(AiPatientIntake)`, `hasOne(ConsultationRecord)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [Appointments] - Create migration file | Create migration with composite unique index, indexes on `(tenant_id, status)` and `(doctor_id, appointment_date)` |
| SUBTASK: [Appointments] - Create Eloquent Model | Create `app/Models/Appointment.php` with relationships, status enum casts, scopes |
| SUBTASK: [Appointments] - Create Factory | Create `AppointmentFactory` with status states and future date generation |

---

### STORY: [Appointments] - Implement Atomic Booking with Redis Locks
**Type:** Story | **Priority:** Highest | **Story Points:** 13
**Description:** Build booking service with Redis-based distributed locks to prevent double-booking of the same time slot.
**Acceptance Criteria:**
- Service class `BookingService` uses Redis lock on `lock:slot:{doctor_id}:{date}:{start_time}`
- Lock acquired before checking slot availability
- Booking inserted within DB transaction
- Lock released after commit or on failure
- Returns proper error messages for concurrent booking attempts
- Handles lock timeout and deadlock scenarios

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [BookingService] - Create service class | Create `app/Services/BookingService.php` with `bookAppointment()` method |
| SUBTASK: [BookingService] - Implement Redis lock acquisition | Use `Cache::lock()` with 10-second timeout for slot-level locking |
| SUBTASK: [BookingService] - Implement atomic DB transaction | Wrap booking insert in `DB::transaction()` with proper rollback handling |
| SUBTASK: [BookingService] - Implement slot conflict detection | Query for overlapping appointments within transaction before insert |
| SUBTASK: [BookingService] - Add booking confirmation logic | Auto-confirm if no conflicts, return pending if slot already held |
| SUBTEST: [BookingService] - Create integration tests | Test concurrent booking attempts, lock behavior, transaction rollback |

---

## EPIC 4: [HealthPulse] - AI Pre-Consultation & SOAP Notes
**Priority:** High | **Labels:** `ai`, `openai`, `soap`, `intake`
**Description:** Implement AI-powered patient intake forms and SOAP note generation using OpenAI/Claude API integration.

### STORY: [AI Intake] - Create Ai_patient_intakes Migration & Model
**Type:** Story | **Priority:** High | **Story Points:** 5
**Description:** Create the Ai_patient_intakes table for storing pre-consultation symptom data and AI-generated summaries.
**Acceptance Criteria:**
- Migration creates `ai_patient_intakes` table: `id`, `appointment_id` (unique FK → appointments.id), `tenant_id` (FK → tenants.id), `raw_symptoms` (json), `ai_summary` (text, nullable), `urgency` (enum: low, medium, high, critical, nullable), `timestamps`
- One-to-one relationship with Appointments
- Model relationships: `belongsTo(Appointment)`, `belongsTo(Tenant)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [AiIntake] - Create migration file | Create migration with unique index on `appointment_id`, index on `(tenant_id, urgency)` |
| SUBTASK: [AiIntake] - Create Eloquent Model | Create `app/Models/AiPatientIntake.php` with JSON cast for `raw_symptoms` |
| SUBTASK: [AiIntake] - Create Factory | Create `AiPatientIntakeFactory` with realistic symptom JSON data |

---

### STORY: [AI Intake] - Build Intake Schema & API Endpoint
**Type:** Story | **Priority:** High | **Story Points:** 8
**Description:** Create API endpoint for patients to submit symptoms and receive AI-processed summary.
**Acceptance Criteria:**
- POST `/api/v1/intakes` accepts `appointment_id` and `symptoms` array
- Validates appointment belongs to authenticated patient
- Stores raw symptoms as JSON
- Triggers AI processing asynchronously (queue job)
- Returns intake record with processing status

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [IntakeAPI] - Create FormRequest validation | Create `app/Http/Requests/StoreIntakeRequest.php` with rules for symptoms array |
| SUBTASK: [IntakeAPI] - Create Controller | Create `app/Http/Controllers/Api/V1/IntakeController.php` with store method |
| SUBTASK: [IntakeAPI] - Create API routes | Register route in `routes/api.php` with patient middleware |
| SUBTASK: [IntakeAPI] - Create queue job for AI processing | Create `app/Jobs/ProcessAiIntakeJob.php` for async AI summary generation |

---

### STORY: [Consultation Records] - Create Consultation_records Migration & Model
**Type:** Story | **Priority:** High | **Story Points:** 5
**Description:** Create the Consultation_records table for storing SOAP notes generated from consultations.
**Acceptance Criteria:**
- Migration creates `consultation_records` table: `id`, `appointment_id` (unique FK → appointments.id), `tenant_id` (FK → tenants.id), `raw_notes` (text, nullable), `soap_subjective` (text), `soap_objective` (text), `soap_assessment` (text), `soap_plan` (text), `timestamps`
- One-to-one relationship with Appointments
- Model relationships: `belongsTo(Appointment)`, `belongsTo(Tenant)`

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [ConsultationRecords] - Create migration file | Create migration with unique index on `appointment_id`, index on `(tenant_id)` |
| SUBTASK: [ConsultationRecords] - Create Eloquent Model | Create `app/Models/ConsultationRecord.php` with fillable SOAP fields |
| SUBTASK: [ConsultationRecords] - Create Factory | Create `ConsultationRecordFactory` with sample SOAP note data |

---

### STORY: [SOAP Notes] - Build SOAP Note Generator API Service
**Type:** Story | **Priority:** High | **Story Points:** 13
**Description:** Create service class that uses OpenAI/Claude API to generate structured SOAP notes from raw consultation notes.
**Acceptance Criteria:**
- Service class `SoapNoteGenerator` takes raw notes and intake summary
- Calls OpenAI/Claude API with structured prompt for SOAP format
- Parses response into `subjective`, `objective`, `assessment`, `plan` fields
- Stores result in `consultation_records` table
- Handles API failures gracefully with retry logic
- Supports both OpenAI and Claude via configurable driver

**Sub-tasks:**

| Sub-task | Description |
|----------|-------------|
| SUBTASK: [SoapGenerator] - Create service interface | Create `app/Services/Contracts/SoapGeneratorInterface.php` with `generate()` method |
| SUBTASK: [SoapGenerator] - Implement OpenAI driver | Create `app/Services/SoapGenerators/OpenAiSoapGenerator.php` using OpenAI API |
| SUBTASK: [SoapGenerator] - Implement Claude driver | Create `app/Services/SoapGenerators/ClaudeSoapGenerator.php` using Anthropic API |
| SUBTASK: [SoapGenerator] - Create prompt engineering template | Create `app/Services/Prompts/soap_note_prompt.php` with structured SOAP extraction prompt |
| SUBTASK: [SoapGenerator] - Create API endpoint | POST `/api/v1/consultations` to trigger SOAP generation from raw notes |
| SUBTASK: [SoapGenerator] - Create queue job for async processing | Create `app/Jobs/GenerateSoapNoteJob.php` for background processing |
| SUBTASK: [SoapGenerator] - Add retry & error handling | Implement exponential backoff for API failures, log errors |
| SUBTASK: [SoapGenerator] - Create integration tests | Test API calls, response parsing, error scenarios with mocked responses |

---

## Summary

| Epic | Stories | Sub-tasks | Total Story Points |
|------|---------|-----------|-------------------|
| EPIC 1: Multi-Tenancy & Auth Base | 3 | 11 | 18 |
| EPIC 2: Doctor Schedule & Profiles | 3 | 10 | 18 |
| EPIC 3: Booking System & Concurrency | 2 | 11 | 18 |
| EPIC 4: AI Pre-Consultation & SOAP Notes | 4 | 16 | 31 |
| **TOTAL** | **12** | **48** | **85** |

---

## Jira MCP Reconnection Instructions

Once you have your API token, run these commands:

```powershell
# 1. Set the environment variable
[System.Environment]::SetEnvironmentVariable("JIRA_API_TOKEN", "YOUR_TOKEN_HERE", "User")

# 2. Restart opencode (close and reopen)

# 3. Then ask me: "Use Jira MCP to create all epics, stories, and sub-tasks from JIRA_ROADMAP.md"
```


---

# ADDENDUM (2026-10-18) — HP-65 & HP-66

Total new issues: **122** tasks (HP-68 → HP-189) across 2 new epics.

## EPIC 5: [HealthPulse] - Backend API Completion & Hardening
**Jira Epic:** HP-65 | **Branch:** `feature/65-backend-api-completion`
**Priority:** High | **Labels:** `backend`, `api`, `mvc`, `hardening`
**Description:** Complete the backend MVC layers on top of the existing foundation (HP-1…HP-64): token auth (Sanctum), authorization policies for every model, form-request validation, API controllers + REST endpoints, API resources and resource collections, plus cross-cutting hardening (JSON error handling, throttling, events/notifications/observers, factories/seeders, docs, tests).

**Tasks (76):**

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
**Jira Epic:** HP-66 | **Branch:** `feature/66-frontend-web-application`
**Priority:** High | **Labels:** `frontend`, `react`, `spa`, `ui`
**Description:** React + Vite + Tailwind single-page application consuming the v1 API. Covers app scaffolding, auth flows, role-based layouts, patient portal (browse/book/intake), doctor portal (schedule/appointments/SOAP), super-admin console (tenants/users), shared UI kit, API integration layer and frontend testing.

**Tasks (46):**

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

| Epic | Jira Epic | Tasks | Story Points |
|---|---|---|---|
| EPIC 1: Multi-Tenancy & Auth Base | HP-1 | 11 | 18 |
| EPIC 2: Doctor Schedule & Profiles | HP-2 | 10 | 18 |
| EPIC 3: Booking System & Concurrency | HP-3 | 11 | 18 |
| EPIC 4: AI Pre-Consultation & SOAP Notes | HP-4 | 16 | 31 |
| EPIC 5: Backend API Completion & Hardening | HP-65 | 76 | TBD |
| EPIC 6: Frontend Web Application | HP-66 | 46 | TBD |
| **TOTAL** | — | **170** | — |
