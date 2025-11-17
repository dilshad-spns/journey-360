# Mock API Implementation Summary

## Overview
Successfully implemented automatic mock API generation for Journey 360 with **only 3 endpoints** for the travel insurance journey, clearly classified as inbound and outbound APIs.

## Three Generated APIs

### 1. GET /api/v1/destination (INBOUND)
**Purpose**: Fetch list of destinations for dropdown field
**Type**: Inbound API - Gets data FROM external system
**Response**: Array of destinations with id, name, code, region

### 2. GET /api/v1/coverages (INBOUND)
**Purpose**: Fetch coverage options based on trip details
**Type**: Inbound API - Gets data FROM external system  
**Response**: Coverage plans (Bronze/Silver/Gold) and add-ons with pricing

### 3. POST /api/v1/submitJourney (OUTBOUND)
**Purpose**: Submit complete journey and issue policy
**Type**: Outbound API - Sends data TO external system
**Response**: Policy number, PDF, coverage dates, helpline info

## API Classification

### Inbound APIs (2)
- **Definition**: APIs the application calls to GET data FROM external systems
- **Examples**: GET /api/v1/destination, GET /api/v1/coverages
- **Badge Color**: Blue

### Outbound APIs (1)
- **Definition**: APIs the application calls to SEND data TO external systems
- **Examples**: POST /api/v1/submitJourney
- **Badge Color**: Green

## UI Features

### APIs Tab in Right Sidebar
- Located after "Schema" tab
- Shows all 3 generated endpoints
- Clear inbound/outbound classification
- Accordion layout for endpoint details

### Each Endpoint Shows:
- **Overview Tab**: API type, method, status, delay, description
- **Request Tab**: JSON schema + example request
- **Response Tab**: JSON schema + example response
- **cURL Tab**: Copy-ready cURL command

### Design System Compliance
All UI uses CSS variables:
- Colors: `bg-card`, `bg-primary`, `text-foreground`, `border-border`
- Radius: `--radius-card`, `--radius-button`, `--radius`
- Elevation: `--elevation-sm`, `--elevation-md`
- Typography: CSS base styles (NO Tailwind font classes)

## Files Modified

1. **`/utils/mockApi.ts`**: Simplified to generate ONLY 3 endpoints
2. **`/components/APIViewer.tsx`**: Added inbound/outbound classification
3. **`/components/FormEditorPage.tsx`**: Integrated APIs tab

## Usage

1. Generate travel insurance form
2. Click "APIs" tab in right sidebar
3. See 3 endpoints with clear inbound/outbound labels
4. Click any endpoint to view details
5. Copy JSON schemas or cURL commands for testing

## Benefits

✅ **Simplified**: Only 3 essential endpoints (not dozens)
✅ **Classified**: Clear inbound vs outbound distinction
✅ **JSON Schema**: Standard schema definitions
✅ **Design System**: Uses team CSS variables
✅ **Developer Ready**: Copy-ready examples and cURL commands
