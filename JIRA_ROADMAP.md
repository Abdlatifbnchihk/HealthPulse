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
