# Sprint Backlog Rubric Requirements Audit
**Date:** April 2, 2026 | **Backend Status:** ✅ Running (Port 8080)

---

## 1. REGISTRATION [35 Points]

### 1.1 Registration Form (Completeness & Correctness) - 15 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Frontend form exists** | ✅ PASS | `frontend/src/pages/Register.jsx` - fully implemented |
| **Form fields present** | ✅ PASS | firstName, lastName, email, phone, password, confirmPassword |
| **Required field validation** | ✅ PASS | Password length ≥8, passwords match, all fields required |
| **Form styling/UX** | ✅ PASS | Navbar included, error/success messages, responsive layout |
| **Backend endpoint** | ✅ PASS | `POST /api/auth/register` in AuthController |
| **Input validation** | ✅ PASS | @Valid RegistrationRequest, email uniqueness check |
| **Error handling** | ✅ PASS | Clear error messages for duplicate email, validation failures |

**Subtotal: 15/15 ✅ PASS**

---

### 1.2 Sending Confirmation Email - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Email service implemented** | ❌ FAIL | No EmailService class found in codebase |
| **Email endpoint called** | ❌ FAIL | register() method does NOT send email |
| **Verification token generated** | ⚠️ PARTIAL | Token exists in DB schema, but not used in registration |
| **Verification token stored** | ✅ PASS | `verification_token` column exists in `users` table |
| **Email template** | ❌ FAIL | Not implemented |
| **Token expiry logic** | ❌ FAIL | Not implemented |

**Subtotal: 0/10 ❌ FAIL** → **ACTION REQUIRED**: Implement EmailService + email verification workflow

---

### 1.3 User Data Stored w/ Correct Status - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Default status set** | ✅ PASS | register() sets status="inactive" via userStatusRepository.findByName("inactive") |
| **Status stored in DB** | ✅ PASS | `status_id` mapped to `user_status` table |
| **Inactive status correct** | ✅ PASS | New users created with `status_id=2` (inactive) |
| **Active status option available** | ✅ PASS | `user_status` table has both 'active' and 'inactive' |
| **User inheritance correct** | ✅ PASS | Customer extends BaseUser with JOINED inheritance |

**Subtotal: 10/10 ✅ PASS**

**Registration Total: 25/35 (71%) - Email feature blocking 10 pts**

---

## 2. LOGIN [25 Points]

### 2.1 Login Form (Completeness & Correctness) - 5 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Frontend form exists** | ✅ PASS | `frontend/src/pages/Login.jsx` implemented |
| **Email field** | ✅ PASS | email input present |
| **Password field** | ✅ PASS | password input present with masking |
| **Submit button** | ✅ PASS | Login button functional |
| **Error/Success messages** | ✅ PASS | Displays error on failed login, redirects on success |

**Subtotal: 5/5 ✅ PASS**

---

### 2.2 Forgot My Password Functionality - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Forgot password page** | ✅ PASS | `frontend/src/pages/ForgotPassword.jsx` exists |
| **Reset request endpoint** | ✅ PASS | `POST /api/auth/forgot-password` returns reset token |
| **Token generation** | ✅ PASS | PasswordService.forgotPassword() generates UUID token |
| **Token storage** | ✅ PASS | reset_token stored in users table with expiry |
| **Reset password page** | ✅ PASS | `frontend/src/pages/ResetPassword.jsx` exists |
| **Reset endpoint** | ✅ PASS | `POST /api/auth/reset-password` validates token & updates password |
| **Token validation** | ✅ PASS | resetPassword() checks token existence and expiry |
| **Password hashed** | ✅ PASS | passwordEncoder.encode() applied |
| **Email notification** | ⚠️ PARTIAL | No email sent with reset link (debug_token returned instead) |

**Subtotal: 8/10 ⚠️ PARTIAL** → Email notification not implemented

---

### 2.3 Authentication Logic & Validation - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **AuthResponse includes role** | ✅ PASS | role in AuthResponse DTO: "ADMIN" \| "CUSTOMER" |
| **Valid login handling** | ✅ PASS | Direct comparison: email found + password matches |
| **Invalid email handling** | ✅ PASS | Throws RuntimeException "Invalid email or password" |
| **Invalid password handling** | ✅ PASS | passwordEncoder.matches() check, same error message |
| **Admin dashboard exists** | ❌ FAIL | NO AdminDashboard.jsx page - routing blocked |
| **Admin menu: Manage Movies** | ❌ FAIL | Not implemented |
| **Admin menu: Promotions** | ❌ FAIL | Not implemented |
| **Admin menu: Users** | ❌ FAIL | Not implemented |
| **Admin menu: Showtimes** | ❌ FAIL | Not implemented |
| **Customer redirect** | ⚠️ PARTIAL | Login succeeds but Home page exists, needs role-based routing |

**Subtotal: 4/10 ❌ FAIL** → **BLOCKING**: Admin dashboard is NOT implemented

**Login Total: 17/25 (68%) - Admin portal blocking 6 pts**

---

## 3. LOGOUT [5 Points]

| Requirement | Status | Evidence |
|---|---|---|
| **Logout endpoint exists** | ✅ PASS | `POST /api/auth/logout` in AuthController |
| **Frontend logout button** | ✅ PASS | Profile.jsx has logout button handler |
| **Clear token on client** | ✅ PASS | localStorage.removeItem("token") called |
| **API called on logout** | ✅ PASS | logout endpoint invoked |
| **Clear user session** | ✅ PASS | localStorage.removeItem("user") also called |
| **Redirect to login** | ✅ PASS | navigate("/login") after logout |

**Logout Total: 5/5 ✅ PASS**

---

## 4. EDIT PROFILE [55 Points]

### 4.1 Edit Profile Form (Completeness & Correctness) - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Profile page exists** | ✅ PASS | `frontend/src/pages/Profile.jsx` implemented |
| **Edit form exists** | ✅ PASS | Edit button + form toggling implemented |
| **Editable fields: firstName** | ✅ PASS | Input present, not read-only |
| **Editable fields: lastName** | ✅ PASS | Input present, not read-only |
| **Editable fields: phone** | ✅ PASS | Input present, not read-only |
| **Email field NOT editable** | ✅ PASS | Email shown but not in edit form |
| **Form validation** | ⚠️ PARTIAL | Basic validation only, no regex or length checks |
| **Submit & Cancel buttons** | ✅ PASS | Both buttons present |
| **Required field indicators** | ⚠️ PARTIAL | Not visually marked as required |

**Subtotal: 8/10 ⚠️ PARTIAL**

---

### 4.2 User Data Retrieved & Displayed - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Profile retrieval endpoint** | ✅ PASS | `GET /api/user/profile` exists |
| **Backend service fetches data** | ✅ PASS | ProfileService.getProfile(email) implemented |
| **Data displayed on form** | ✅ PASS | useEffect loads profile, populates formData |
| **Email NOT editable** | ✅ PASS | Email field not in edit form |
| **Authentication required** | ✅ PASS | Authentication object passed to endpoint |
| **Error handling on load** | ✅ PASS | Redirect to login if 401 error |
| **Loading state shown** | ✅ PASS | Loading message displayed while fetching |

**Subtotal: 10/10 ✅ PASS**

---

### 4.3 Data Changes Saved to Database - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Update endpoint exists** | ✅ PASS | `PUT /api/user/profile` in UserController |
| **Backend service updates** | ✅ PASS | ProfileService.updateProfile() implementation |
| **Database persistence** | ✅ PASS | JPA save() called to persist changes |
| **Transaction handling** | ✅ PASS | @Transactional on update methods |
| **User identified by auth** | ✅ PASS | Email from Authentication context used |
| **Success feedback** | ✅ PASS | Success message returned to frontend |

**Subtotal: 10/10 ✅ PASS**

---

### 4.4 Address & Payment Card Restrictions - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Address table exists** | ✅ PASS | `addresses` table with UNIQUE user_id |
| **Max 1 address enforced** | ✅ PASS | UNIQUE KEY on user_id prevents duplicates |
| **Address CRUD endpoints** | ❌ FAIL | NO endpoints for address management |
| **Address UI form** | ❌ FAIL | No address form in Profile.jsx |
| **Payment card table exists** | ✅ PASS | `payment_cards` table with card_number (encrypted) |
| **Max 3 payment cards enforced** | ❌ FAIL | No constraint in DB, no app-level limit |
| **Payment card endpoints** | ❌ FAIL | NO endpoints for payment card management |
| **Payment card UI** | ❌ FAIL | No payment card form in Profile.jsx |
| **Card number encrypted** | ✅ PASS | Column is varbinary (encrypted storage intended) |

**Subtotal: 2/10 ❌ FAIL** → **ACTION REQUIRED**: Implement address & payment card CRUD + UI

---

### 4.5 View Favorite Movies List - 5 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Favorites table exists** | ✅ PASS | `favorites` table with user_id + movie_id |
| **Favorite retrieval endpoint** | ❌ FAIL | NO GET /api/user/favorites endpoint |
| **Favorite service** | ❌ FAIL | No FavoriteService class |
| **Favorite repository** | ❌ FAIL | No FavoriteRepository interface |
| **UI to view favorites** | ❌ FAIL | No favorites list in Profile.jsx |

**Subtotal: 0/5 ❌ FAIL**

---

### 4.6 Add Movie to Favorite List - 10 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Add to favorites endpoint** | ❌ FAIL | NO POST /api/user/favorites endpoint |
| **Remove from favorites endpoint** | ❌ FAIL | NO DELETE /api/user/favorites endpoint |
| **Favorite service logic** | ❌ FAIL | FavoriteService not implemented |
| **Heart icon on MovieDetails** | ❌ FAIL | No heart icon in MovieDetails.jsx |
| **Toggle favorite on click** | ❌ FAIL | No favorite toggle logic |
| **Tooltip on heart icon** | ❌ FAIL | Not implemented |
| **Visual feedback** | ❌ FAIL | No filled/unfilled heart state |
| **Error handling** | ❌ FAIL | Not implemented |

**Subtotal: 0/10 ❌ FAIL** → **BLOCKING**: Favorites feature not implemented

**Edit Profile Total: 30/55 (54%) - Address, Payment Cards, Favorites blocking 25 pts**

---

## 5. NON-FUNCTIONAL REQUIREMENTS [30 Points]

### 5.1 Usability Requirements (UX/UI) - 8 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Clear error messages** | ✅ PASS | Error states in Register, Login, Profile pages |
| **Success messages** | ✅ PASS | Success feedback after registration, profile update |
| **Confirmation messages** | ⚠️ PARTIAL | Basic success/error, no confirmation dialogs |
| **Form field clarity** | ⚠️ PARTIAL | Labels present but no visual "required" indicators |
| **Required fields marked** | ❌ FAIL | No asterisks (*) or visual indicators |
| **Navigation menu** | ✅ PASS | Navbar.jsx provides navigation |
| **Responsive design** | ⚠️ PARTIAL | Mobile layout untested |
| **User guidance** | ⚠️ PARTIAL | Helpful but could be clearer |

**Subtotal: 4/8 ⚠️ PARTIAL** → Required field indicators missing

---

### 5.2 Security Requirements - 22 pts
| Requirement | Status | Evidence |
|---|---|---|
| **Access control enforced** | ✅ PASS | Authentication check on /api/user endpoints |
| **Admin vs Customer roles** | ✅ PASS | Roles distinguish in AuthResponse DTO |
| **Role-based routing** | ⚠️ PARTIAL | Frontend redirect logic exists but NO admin routes |
| **Current password on pwd change** | ❌ FAIL | NO endpoint to change password (forgot-password is different) |
| **Password hashing** | ✅ PASS | BCrypt encoder: passwordEncoder.encode() |
| **Password storage secure** | ✅ PASS | password_hash column stores hashed values |
| **Payment card encryption** | ⚠️ PARTIAL | Column is varbinary but NO encryption logic in code |
| **Card holder name NOT encrypted** | ⚠️ PARTIAL | Stored plaintext (should not accept this) |
| **Card number format validation** | ❌ FAIL | No Luhn algorithm or validation |
| **Email notification on profile change** | ❌ FAIL | No email sent when profile is updated |
| **Email service missing** | ❌ FAIL | BlockingIssue: No EmailService implementation |
| **HTTPS in production** | ⚠️ PARTIAL | localhost for dev, but no production config |

**Subtotal: 6/22 ❌ FAIL** → Email notifications + encryption not implemented

---

## SUMMARY

| Feature | Points | Status | Pass Rate |
|---|---|---|---|
| **1. Registration** | 35 | 25/35 | 71% ❌ EMAIL |
| **2. Login** | 25 | 17/25 | 68% ❌ ADMIN |
| **3. Logout** | 5 | 5/5 | 100% ✅ |
| **4. Edit Profile** | 55 | 30/55 | 54% ❌ FAVORITES/ADDR/CARDS |
| **5. Non-Functional** | 30 | 6/30 | 20% ❌ EMAIL/SECURITY |
| **TOTAL** | **150** | **83/150** | **55% 🔴 CRITICAL GAPS** |

---

## BLOCKING ISSUES (Cannot launch demo without these)

1. ❌ **NO EmailService** → Registration email + password reset email + profile change notifications all blocked
2. ❌ **NO AdminDashboard** → Cannot demo admin login/role routing
3. ❌ **NO Favorites CRUD** → Cannot add/view favorites (10 pts)
4. ❌ **NO Address CRUD** → Cannot manage address (5 pts)
5. ❌ **NO Payment Card CRUD** → Cannot manage cards (5 pts)
6. ❌ **NO Email notifications** → Cannot verify profile security requirement

---

## QUICK FIXES NEEDED

| Priority | Task | Est. Time | Points Unlocked |
|---|---|---|---|
| 🔴 **P0** | Implement EmailService + send verification email | 2 hrs | +10 |
| 🔴 **P0** | Create AdminDashboard.jsx with menu | 1.5 hrs | +6 |
| 🔴 **P0** | Implement Favorites CRUD (backend + frontend) | 2.5 hrs | +10 |
| 🔴 **P0** | Implement Address CRUD (limited to 1) | 1.5 hrs | +5 |
| 🔴 **P0** | Implement PaymentCard CRUD (limit to 3) | 1.5 hrs | +5 |
| 🔴 **P0** | Add payment card encryption logic | 1 hr | +5 |
| 🟡 **P1** | Add email notification on profile change | 1 hr | +5 |
| 🟡 **P1** | Add "change password" endpoint (with current pwd verification) | 1 hr | +2 |
| 🟡 **P1** | Add required field indicators to forms | 0.5 hr | +2 |
| 🟡 **P1** | Add heart icon to MovieDetails for favorites | 0.5 hr | +1 |

**Est. Total to reach 95%+ : ~12 hours**

---

## TEST EVIDENCE CHECKLIST

```
❌ can test: Registration (no email verification)
❌ can test: Login (no admin routing)
❌ can test: Logout ✅ FULLY TESTABLE
❌ can test: Profile View ✅ FULLY TESTABLE
❌ can test: Profile Edit ✅ FULLY TESTABLE
❌ can test: Forgot Password (sends email but no UI verification)
❌ can test: Reset Password ✅ TESTABLE WITH DEBUG TOKEN
❌ can test: Favorites ❌ NOT IMPLEMENTED
❌ can test: Addresses ❌ NOT IMPLEMENTED
❌ can test: Payment Cards ❌ NOT IMPLEMENTED
❌ can test: Admin Dashboard ❌ NOT IMPLEMENTED
```
