# Data Dictionary - HomeScorePro
## Master Reference for All Data Fields, Sources, and Definitions

**Last Updated:** 2025-11-17  
**Status:** Active Documentation  
**Purpose:** Comprehensive reference for all data fields, their sources, definitions, and legal/compliance status

---

## Executive Summary

This document serves as the master data dictionary for HomeScorePro, providing:
- Complete field definitions for all data sources
- Data source mapping (which source provides which fields)
- Legal/compliance status per data source
- Data type and format specifications
- Validation rules and constraints
- Cross-references to completeness tracking and legal compliance

**Total Data Sources:** 6  
**Total Fields Documented:** 50+  
**Data Files:** 2 (suburbs.csv, properties.csv)  
**Database Tables:** 8

---

## 1. Data Sources Overview

| Source | Fields Provided | License Status | Commercial Use | Attribution Required |
|--------|----------------|----------------|----------------|---------------------|
| **ABS SEIFA** | IRSD, IER, IEO scores/deciles | ✅ CC BY 4.0 | ✅ Permitted | ✅ Yes |
| **Victoria Police** | Crime rates | ⚠️ To Verify | ⚠️ To Verify | ✅ Yes |
| **Walk Score API** | Transit, Walk, Bike scores | ❌ License Needed | ❌ License Needed | ✅ Yes |
| **Property Data** | Prices, types, features | ❌ Unknown | ❌ To Verify | ⚠️ TBD |
| **School Data** | Ratings, counts | ⚠️ To Verify | ⚠️ To Verify | ⚠️ TBD |
| **Amenity Data** | Parks, childcare, shopping, cafes | ⚠️ To Verify | ⚠️ To Verify | ⚠️ TBD |

**See:** `legal-compliance-status.md` for detailed licensing information

---

## 2. Data Files

### 2.1 `data/suburbs.csv`

**Purpose:** Master database of Melbourne suburbs with all scoring metrics  
**Records:** 397 suburbs  
**Last Updated:** Unknown  
**Refresh Frequency:** Quarterly recommended

#### Field Definitions

| Field Name | Data Type | Format | Required | Source | Description |
|------------|-----------|--------|----------|--------|-------------|
| `suburb` | String | Text | Yes | Manual | Suburb name (e.g., "Frankston") |
| `postcode` | String | 4 digits | Yes | Manual | Australian postcode (e.g., "3199") |
| `lga` | String | Text | No | Manual | Local Government Area name |
| `latitude` | Decimal | -37.xxxxx | Yes | Geocoding | GPS latitude coordinate |
| `longitude` | Decimal | 144.xxxxx | Yes | Geocoding | GPS longitude coordinate |
| `irsd_score` | Integer | 800-1200 | Yes | ABS SEIFA | Index of Relative Socio-economic Disadvantage |
| `irsd_decile` | Integer | 1-10 | Yes | ABS SEIFA | IRSD decile (1=most disadvantaged) |
| `ier_score` | Integer | 800-1200 | Yes | ABS SEIFA | Index of Education and Occupation |
| `ier_decile` | Integer | 1-10 | Yes | ABS SEIFA | IER decile |
| `ieo_score` | Integer | 800-1200 | Yes | ABS SEIFA | Index of Economic Resources |
| `ieo_decile` | Integer | 1-10 | Yes | ABS SEIFA | IEO decile |
| `medianPrice` | Decimal | Currency | No | Property Data | Median property price (AUD) |
| `growth1yr` | Decimal | Percentage | Yes | Property Data | 1-year capital growth rate (%) |
| `crimeRate` | Decimal | Per 100k | Yes | Victoria Police | Crime rate per 100,000 population |
| `schoolRating` | Decimal | 0-100 | Yes | School Data | Average school rating |
| `schoolCount` | Integer | Count | Yes | School Data | Total number of schools |
| `primarySchools` | Integer | Count | Yes | School Data | Number of primary schools |
| `secondarySchools` | Integer | Count | Yes | School Data | Number of secondary schools |
| `primaryCommuteMinutes` | Integer | Minutes | No | Calculated | Commute time to primary work location |
| `secondaryCommuteMinutes` | Integer | Minutes | No | Calculated | Commute time to secondary work location |
| `rentalYield` | Decimal | Percentage | Yes | Property Data | Rental yield (%) |
| `transitScore` | Integer | 0-100 | No | Walk Score API | Public transit accessibility score |
| `walkScore` | Integer | 0-100 | No | Walk Score API | Walkability score |
| `bikeScore` | Integer | 0-100 | No | Walk Score API | Bike-friendliness score |
| `parksDensity` | Decimal | Density | Yes | Amenity Data | Parks per square km |
| `childcareCenters` | Integer | Count | Yes | Amenity Data | Number of childcare centers |
| `shoppingCenters` | Integer | Count | Yes | Amenity Data | Number of shopping centers |
| `cafesRestaurants` | Integer | Count | Yes | Amenity Data | Number of cafes/restaurants |
| `medicalCenters` | Integer | Count | Yes | Amenity Data | Number of medical centers |
| `category` | String | Enum | Yes | Manual | INNER METRO, OUTER GROWTH, BAYSIDE, HILLS & RANGES |

#### Validation Rules
- `postcode`: Must be 4 digits, valid Australian postcode
- `latitude`: Range -38.5 to -37.0 (Melbourne area)
- `longitude`: Range 144.0 to 146.0 (Melbourne area)
- `irsd_score`, `ier_score`, `ieo_score`: Range 800-1200
- `irsd_decile`, `ier_decile`, `ieo_decile`: Range 1-10
- `transitScore`, `walkScore`, `bikeScore`: Range 0-100
- `category`: Must be one of: INNER METRO, OUTER GROWTH, BAYSIDE, HILLS & RANGES

#### Data Quality Issues
- 19 suburbs missing LGA data
- 53 suburbs missing medianPrice (0 values)
- 279 suburbs missing primaryCommuteMinutes (0 values)
- 279 suburbs missing secondaryCommuteMinutes (0 values)
- 22 suburbs missing transitScore
- 22 suburbs missing walkScore
- ~50% of amenity fields contain placeholder values (3, 2, 10, 2, 50)

### 2.2 `data/properties.csv`

**Purpose:** Test property data for personal testing of B-Score functionality  
**⚠️ FOR PERSONAL USE ONLY** - Contains test data for simulating user property evaluations. Not for commercial use or distribution.  
**Records:** Test properties (for personal testing only)  
**Last Updated:** Unknown  
**Refresh Frequency:** As needed

#### Field Definitions

| Field Name | Data Type | Format | Required | Source | Description |
|------------|-----------|--------|----------|--------|-------------|
| `id` | String | Timestamp | Yes | Generated | Unique property identifier |
| `address` | String | Text | Yes | Manual | Street address |
| `suburb` | String | Text | Yes | Manual | Suburb name (must match suburbs.csv) |
| `postcode` | String | 4 digits | Yes | Manual | Australian postcode |
| `price` | Decimal | Currency | Yes | Property Listing | Property price (AUD) |
| `propertyType` | String | Enum | Yes | Property Listing | house, unit, townhouse, apartment |
| `landSize` | Integer | Square meters | Yes | Property Listing | Land size in sqm (0 for units) |
| `bedrooms` | Integer | Count | Yes | Property Listing | Number of bedrooms |
| `bathrooms` | Decimal | Count | Yes | Property Listing | Number of bathrooms (can be 0.5) |
| `streetQuality` | Integer | 1-5 | Yes | Manual | Street quality rating (1=quiet, 5=busy) |
| `renovationCost` | Decimal | Currency | Yes | Manual | Estimated renovation cost (AUD) |
| `hampzScore` | Integer | 0-100 | No | User Input | Partner Hampz's subjective score |
| `gaheeScore` | Integer | 0-100 | No | User Input | Partner Gahee's subjective score |
| `bScore` | Decimal | 0-100 | Yes | Calculated | Calculated B-Score |
| `isFavorite` | Boolean | TRUE/FALSE | Yes | User Input | Favorite property flag |
| `tags` | String | Text | No | User Input | User-defined tags |
| `notes` | String | Text | No | User Input | User notes about property |
| `dateAdded` | String | Timestamp | Yes | Generated | Date property was added |
| `sourceUrl` | String | URL | No | Personal Test Data | ⚠️ FOR PERSONAL USE ONLY - Test data links for personal testing only |

#### Validation Rules
- `id`: Must be unique (currently has duplicates - needs fixing)
- `suburb`: Must exist in suburbs.csv
- `postcode`: Must match suburb's postcode
- `price`: Must be positive number
- `propertyType`: Must be one of: house, unit, townhouse, apartment
- `landSize`: Must be >= 0
- `bedrooms`: Must be >= 0
- `bathrooms`: Must be >= 0
- `streetQuality`: Must be 1-5
- `hampzScore`, `gaheeScore`: Range 0-100
- `bScore`: Range 0-100

#### Data Quality Issues
- Some duplicate IDs (needs deduplication)
- 31/32 properties have hampzScore = 0 (needs user input)
- 31/32 properties have gaheeScore = 0 (needs user input)

### 2.3 `data/config.json`

**Purpose:** Default configuration values (user preferences override these)  
**Last Updated:** Unknown  
**Refresh Frequency:** As needed

#### Field Definitions

| Field Name | Data Type | Format | Description |
|------------|-----------|--------|-------------|
| `minBudget` | Integer | Currency | Minimum budget (AUD) |
| `maxBudget` | Integer | Currency | Maximum budget (AUD) |
| `primaryLocation` | String | Text | Primary work location name |
| `secondaryLocation` | String | Text | Secondary work location name |
| `transitTargets.primary` | Integer | Minutes | Target commute time to primary location |
| `transitTargets.secondary` | Integer | Minutes | Target commute time to secondary location |
| `theme` | String | Enum | dark, light |
| `categories` | Array | String[] | Preferred suburb categories |
| `locations.primary.name` | String | Text | Primary location name |
| `locations.primary.lat` | Decimal | Latitude | Primary location latitude |
| `locations.primary.lng` | Decimal | Longitude | Primary location longitude |
| `locations.secondary.name` | String | Text | Secondary location name |
| `locations.secondary.lat` | Decimal | Latitude | Secondary location latitude |
| `locations.secondary.lng` | Decimal | Longitude | Secondary location longitude |

---

## 3. Database Tables

### 3.1 `users` Table

**Purpose:** User accounts and authentication  
**Source:** User registration

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `first_name` | VARCHAR(100) | | User's first name |
| `last_name` | VARCHAR(100) | | User's last name |
| `subscription_tier` | VARCHAR(50) | DEFAULT 'free' | free, starter, professional, enterprise |
| `subscription_status` | VARCHAR(50) | DEFAULT 'inactive' | active, inactive, cancelled |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `email_verification_token` | VARCHAR(255) | | Token for email verification |
| `password_reset_token` | VARCHAR(255) | | Token for password reset |
| `password_reset_expires` | TIMESTAMP | | Password reset token expiration |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| `last_login` | TIMESTAMP | | Last login timestamp |

### 3.2 `properties` Table

**Purpose:** User-saved property evaluations  
**Source:** User input via Property Evaluator

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing property ID |
| `user_id` | INTEGER | FOREIGN KEY → users(id) | Owner of this property |
| `address` | VARCHAR(500) | NOT NULL | Street address |
| `suburb` | VARCHAR(100) | NOT NULL | Suburb name |
| `postcode` | VARCHAR(10) | | Australian postcode |
| `price` | DECIMAL(12,2) | | Property price (AUD) |
| `property_type` | VARCHAR(50) | | house, unit, townhouse, apartment |
| `land_size` | DECIMAL(10,2) | | Land size in square meters |
| `bedrooms` | INTEGER | | Number of bedrooms |
| `bathrooms` | DECIMAL(3,1) | | Number of bathrooms |
| `street_quality` | INTEGER | | Street quality rating (1-5) |
| `renovation_cost` | DECIMAL(10,2) | DEFAULT 0 | Estimated renovation cost |
| `hampz_score` | DECIMAL(5,2) | | Partner Hampz's score (0-100) |
| `gahee_score` | DECIMAL(5,2) | | Partner Gahee's score (0-100) |
| `b_score` | DECIMAL(5,2) | | Calculated B-Score (0-100) |
| `is_favorite` | BOOLEAN | DEFAULT FALSE | Favorite property flag |
| `tags` | TEXT | | User-defined tags |
| `notes` | TEXT | | User notes |
| `date_added` | TIMESTAMP | DEFAULT NOW() | When property was added |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 3.3 `suburbs` Table (Future)

**Purpose:** Store suburb data in database (currently using CSV)  
**Source:** `data/suburbs.csv` import

**Note:** Table structure matches `suburbs.csv` fields. See section 2.1 for field definitions.

### 3.4 `subscriptions` Table

**Purpose:** User subscription management  
**Source:** Stripe integration

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing subscription ID |
| `user_id` | INTEGER | FOREIGN KEY → users(id) | Subscribed user |
| `stripe_subscription_id` | VARCHAR(255) | UNIQUE | Stripe subscription ID |
| `stripe_customer_id` | VARCHAR(255) | | Stripe customer ID |
| `plan` | VARCHAR(50) | NOT NULL | starter, professional, enterprise |
| `status` | VARCHAR(50) | NOT NULL | active, cancelled, past_due |
| `current_period_start` | TIMESTAMP | | Current billing period start |
| `current_period_end` | TIMESTAMP | | Current billing period end |
| `cancel_at_period_end` | BOOLEAN | DEFAULT FALSE | Cancel at period end flag |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Subscription creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 3.5 `payments` Table

**Purpose:** Payment transaction records  
**Source:** Stripe payment intents

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing payment ID |
| `user_id` | INTEGER | FOREIGN KEY → users(id) | Paying user |
| `subscription_id` | INTEGER | FOREIGN KEY → subscriptions(id) | Associated subscription |
| `stripe_payment_intent_id` | VARCHAR(255) | UNIQUE | Stripe payment intent ID |
| `amount` | DECIMAL(10,2) | NOT NULL | Payment amount (AUD) |
| `currency` | VARCHAR(3) | DEFAULT 'AUD' | Currency code |
| `status` | VARCHAR(50) | NOT NULL | succeeded, pending, failed |
| `payment_method` | VARCHAR(50) | | card, bank_transfer, etc. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Payment timestamp |

### 3.6 `user_preferences` Table

**Purpose:** User onboarding preferences and settings  
**Source:** User onboarding form

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing preference ID |
| `user_id` | INTEGER | FOREIGN KEY → users(id), UNIQUE | User owning preferences |
| `primary_goal` | VARCHAR(50) | | investment, balanced, lifestyle |
| `budget_min` | DECIMAL(12,2) | | Minimum budget (AUD) |
| `budget_max` | DECIMAL(12,2) | | Maximum budget (AUD) |
| `family_status` | VARCHAR(50) | | single, couple, family |
| `safety_priority` | INTEGER | | Safety priority (1-10) |
| `geographic_categories` | TEXT | | Preferred suburb categories (JSON) |
| `consensus_scoring` | BOOLEAN | DEFAULT FALSE | Enable consensus scoring |
| `onboarding_complete` | BOOLEAN | DEFAULT FALSE | Onboarding completion status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Preference creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 3.7 `favorite_suburbs` Table

**Purpose:** User's favorite suburbs  
**Source:** User selection

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing favorite ID |
| `user_id` | INTEGER | FOREIGN KEY → users(id) | User owning favorite |
| `suburb_name` | VARCHAR(100) | NOT NULL | Suburb name |
| `postcode` | VARCHAR(10) | | Australian postcode |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When favorited |
| UNIQUE(user_id, suburb_name, postcode) | | | Prevent duplicates |

### 3.8 `contact_submissions` Table

**Purpose:** Contact form submissions  
**Source:** Contact form on website

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing submission ID |
| `name` | VARCHAR(200) | NOT NULL | Submitter's name |
| `email` | VARCHAR(255) | NOT NULL | Submitter's email |
| `subject` | VARCHAR(500) | | Message subject |
| `message` | TEXT | NOT NULL | Message content |
| `status` | VARCHAR(50) | DEFAULT 'new' | new, read, replied |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

---

## 4. Data Source Mapping

### 4.1 ABS SEIFA Data

**Fields Provided:**
- `irsd_score`, `irsd_decile`
- `ier_score`, `ier_decile`
- `ieo_score`, `ieo_decile`

**License:** CC BY 4.0  
**Commercial Use:** ✅ Permitted  
**Attribution:** ✅ Required  
**Source URL:** https://www.abs.gov.au/statistics/people/people-and-communities/socio-economic-indexes-areas-seifa-australia

### 4.2 Victoria Police Crime Statistics

**Fields Provided:**
- `crimeRate`

**License:** ⚠️ To Verify (likely CC BY 4.0)  
**Commercial Use:** ⚠️ To Verify  
**Attribution:** ✅ Required  
**Source URL:** data.vic.gov.au / Victoria Police Open Data Portal

### 4.3 Walk Score API

**Fields Provided:**
- `transitScore`
- `walkScore`
- `bikeScore`

**License:** ❌ Commercial API License Required  
**Commercial Use:** ❌ License Needed  
**Attribution:** ✅ Required (per agreement)  
**Source URL:** https://www.walkscore.com/professional/api.php

### 4.4 Property Data

**Fields Provided:**
- `medianPrice`
- `growth1yr`
- `rentalYield`
- Property listings (address, price, type, features)

**License:** ❌ Unknown  
**Commercial Use:** ❌ To Verify  
**Attribution:** ⚠️ TBD  
**Source:** ❌ To Be Identified

### 4.5 School Data

**Fields Provided:**
- `schoolRating`
- `schoolCount`
- `primarySchools`
- `secondarySchools`

**License:** ⚠️ To Verify  
**Commercial Use:** ⚠️ To Verify  
**Attribution:** ⚠️ TBD  
**Source:** ⚠️ To Be Identified

### 4.6 Amenity Data

**Fields Provided:**
- `parksDensity`
- `childcareCenters`
- `shoppingCenters`
- `cafesRestaurants`
- `medicalCenters`

**License:** ⚠️ To Verify  
**Commercial Use:** ⚠️ To Verify  
**Attribution:** ⚠️ TBD  
**Source:** ⚠️ To Be Identified

---

## 5. Legal/Compliance Status per Source

| Data Source | License Status | Commercial Use | Attribution | Risk Level | Action Required |
|-------------|----------------|----------------|-------------|------------|-----------------|
| ABS SEIFA | ✅ Verified | ✅ Permitted | ✅ Required | Low | Implement attribution |
| Victoria Police | ⚠️ Needs Verification | ⚠️ To Verify | ✅ Required | Medium | Verify license |
| Walk Score API | ❌ Not Licensed | ❌ License Needed | ✅ Required | **HIGH** | Obtain commercial license |
| Property Data | ❌ Unknown | ❌ To Verify | ⚠️ TBD | **HIGH** | Identify source, verify license |
| School Data | ⚠️ To Verify | ⚠️ To Verify | ⚠️ TBD | Medium | Verify source and license |
| Amenity Data | ⚠️ To Verify | ⚠️ To Verify | ⚠️ TBD | Medium | Verify source and license |

**See:** `legal-compliance-status.md` for detailed tracking

---

## 6. Data Type & Format Specifications

### 6.1 Common Data Types

- **String:** Text data, variable length
- **Integer:** Whole numbers
- **Decimal:** Floating-point numbers (precision specified)
- **Boolean:** TRUE/FALSE or 1/0
- **Timestamp:** Date and time (ISO 8601 format)
- **Currency:** Decimal with 2 decimal places (AUD)

### 6.2 Format Standards

- **Postcodes:** 4 digits, no spaces
- **Coordinates:** Decimal degrees (latitude: -37.xxxxx, longitude: 144.xxxxx)
- **Percentages:** Decimal (e.g., 4.5 for 4.5%)
- **Scores:** Integer 0-100 or Decimal 0-100
- **Dates:** ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)

### 6.3 Validation Rules Summary

- All required fields must have values
- Numeric fields must be within valid ranges
- String fields must match expected formats
- Foreign keys must reference existing records
- Unique constraints must be respected
- Enum values must match allowed values

---

## 7. Cross-References

### Related Documentation
- **Completeness Tracking:** `completeness-tracking.md` - Data completeness metrics
- **Legal Compliance:** `legal-compliance-status.md` - Detailed licensing tracking
- **Project Understanding:** `project-understanding.md` - Complete project documentation
- **Backend Schema:** `server/database/schema.sql` - Database schema definition

### Data Files
- `data/suburbs.csv` - Suburb master data
- `data/properties.csv` - Sample property data
- `data/config.json` - Configuration defaults

### Database Files
- `server/database/schema.sql` - Complete database schema
- `server/database/models/index.js` - Sequelize model definitions

---

**Last Updated:** 2025-11-17  
**Next Review:** Quarterly or when new fields/sources added




