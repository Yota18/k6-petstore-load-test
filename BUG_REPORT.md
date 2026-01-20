# 🐞 Petstore API Bug Report

**Date:** 2026-01-19
**Reporter:** Antigravity QA Team

## Summary
During performance testing (Negative Scenarios), we discovered that the API returns `200 OK` for invalid requests where `400 Bad Request` or `401 Unauthorized` is expected. This indicates improper input validation and security risks.

## 🐛 Issues Found

### 1. Invalid Login Returns 200 OK
- **Endpoint:** `GET /user/login`
- **Severity:** 🔴 **Critical** (Security Risk)
- **Description:** Attempting to login with non-existent username/password returns a unified 200 OK session response instead of 401/403.
- **Payload:** `username=wrong&password=wrong`
- **Actual Result:** `200 OK` `{"code":200,"type":"unknown","message":"logged in user session:..."}`
- **Expected Result:** `401 Unauthorized` or `403 Forbidden`

### 2. Invalid Checkouts Accepted
- **Endpoint:** `POST /store/order`
- **Severity:** 🟠 **High** (Data Integrity)
- **Description:** Submitting an empty JSON body `{}` creates a valid order with ID `0` or random ID, instead of being rejected.
- **Payload:** `{}`
- **Actual Result:** `200 OK` `{"id":442...,"petId":0,"quantity":0,"complete":false}`
- **Expected Result:** `400 Bad Request` (Validation Error)

### 3. Invalid Pet Creation Allowed
- **Endpoint:** `POST /pet`
- **Severity:** 🟡 **Medium**
- **Description:** Submitting invalid data types (e.g., string for ID) results in a 200 OK or 500 Server Error depending on parsing, rather than a handled 400 Bad Request.
- **Actual Result:** `200 OK` (sometimes) or `500 Server Error`
- **Expected Result:** `400 Bad Request`

## 📉 Performance Observations
- **Latency:** The P95 response time is consistently > 700ms, exceeding the SLA of 500ms. Optimization is recommended.
