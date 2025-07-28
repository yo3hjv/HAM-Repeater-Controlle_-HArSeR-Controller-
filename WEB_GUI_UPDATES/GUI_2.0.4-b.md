# ESP32 Repeater Controller - Multilingual Update 2.0.4-b

## For backend core version: HRSR_R_2.0.4

## General Description

This archive contains updated files for the multilingual web interface of the ESP32 Repeater Controller. The main purpose of these modifications was to identify and update all text elements in the web interface that were not prepared for multilingual support (internationalization).

## Modifications Made

### 1. Updates to HTML Files

#### `settings.html`
- Added `lang-*` classes and `data-lang-placeholder` attributes for:
  - Beacon message sections in "active" and "locked" states
  - Labels and descriptions for the delay between callsign and end message
  - Warning messages and button in the WiFi Settings section

#### `header.html`
- Added the `lang-beacon-label` class for the "Beacon:" text in the header to enable its translation

### 2. Updates to Language Files

#### `LanguageFiles/en.ini` (English)
- Added new translation keys for:
  - Beacon messages in active and locked states
  - Descriptions for the delay between callsign and end message
  - Warning messages in the WiFi section
  - The "Beacon:" label in the header

#### `LanguageFiles/ro.ini` (Romanian)
- Completely updated the file with all necessary translation keys
- Added translations for all missing sections, including:
  - The [beacon-messages] section
  - The [wifi-warnings] section
  - The [about] section
  - Other keys that were missing from the original file

#### `LanguageFiles/de.ini` (German)
- Added the translation key for "Beacon:" (translated as "Bake:")

#### `LanguageFiles/it.ini` (Italian)
- Added the translation key for "Beacon:"

#### `LanguageFiles/ru.ini` (Russian)
- Added the translation key for "Beacon:" (translated as "Маяк:")

## Files to Update in SPIFFS

For the changes to be available in the ESP32 web interface, the following files need to be uploaded to the SPIFFS memory:

### HTML Files
1. `/header.html`
2. `/settings.html`

### Language Files
1. `/LanguageFiles/en.ini`
2. `/LanguageFiles/ro.ini`
3. `/LanguageFiles/de.ini`
4. `/LanguageFiles/it.ini`
5. `/LanguageFiles/ru.ini`

## Update Instructions

To upload these files to SPIFFS, you have two options:

### Option 1: Use the Web Upload Interface
1. Access the "Upload Files" page from the ESP32 web interface
2. Select and upload each file individually, maintaining the same directory structure
3. Restart the ESP32 after uploading all files

### Option 2: Use Arduino IDE
1. Install the "ESP32 Sketch Data Upload" plugin in Arduino IDE
2. Copy the updated files to the "data" directory of the project
3. Use the "ESP32 Sketch Data Upload" function to upload all files to SPIFFS

## Verification

After uploading the files, verify that:
1. The web interface loads correctly in all available languages
2. All texts are properly translated when you change the language
3. There are no console errors related to missing translation keys

## Additional Notes

The translation system uses:
- CSS classes prefixed with `lang-*` for translating static texts
- `data-lang` and `data-lang-placeholder` attributes for translating HTML attributes
- The `language.js` file for loading and applying translations

All these mechanisms have been preserved and extended to ensure a complete and consistent multilingual experience.
