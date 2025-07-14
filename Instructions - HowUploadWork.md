# HRSR Controller Upload Functionality

## Overview
This document explains how to upload files to the HRSR Controller using the built-in web interface. The `/upload` endpoint allows users to upload various files including configuration settings, web interface files, and language files that are then stored in the controller's file system (SPIFFS).

## Files to Upload

The HRSR Controller requires several files to be uploaded to function properly. These files are organized into different directories in the SPIFFS file system:

### 1. Settings Files

**Location**: `/settings/` directory
**File Format**: `.ini` files
**Optional Files**:
- `YOUR_CALLSIGN.ini` - Main settings file (e.g., `YO3HJV.ini`). Best practice is to fine tune the settings of your repeater then save them. At the first use, you will not need this file.

> **⚠️ IMPORTANT**: The settings filename MUST match your callsign exactly as configured in the controller. Using an incorrect filename will cause the settings to be rejected.

### 2. Web Interface Files

**Location**: Root directory
**Required Files**:
- `index.html` - Main page showing status information
- `settings.html` - Configuration page for all controller settings
- `about.html` - Information about the controller
- `signal-meter.html` - RSSI signal meter page
- `style.css` - CSS styling for all pages
- `index.js` - Main JavaScript functionality
- `header.js` - Header functionality
- `language.js` - Language handling functionality
- `header.html` - Header template
- `footer.html` - Footer template
- `favicon.ico` - Browser favicon

### 3. Language Files

**Location**: `/LanguageFiles/` directory
**File Format**: `.ini` files
**Available Languages**:
- `en.ini` - English (required)
- `de.ini` - German
- `it.ini` - Italian
- `ro.ini` - Romanian
- `ru.ini` - Russian

> **Note**: At minimum, the `en.ini` file must be uploaded as it serves as the fallback language.

### 4. API Documentation

**Location**: `/api/` directory
**Files**:
- `API_exposed_variables.md` - Documentation for API variables
- `updating_preferences.md` - Documentation for updating preferences

## Upload Process

To upload files to your HRSR Controller:

1. Connect to your controller's web interface
2. Navigate to the `/upload` endpoint (e.g., `http://192.168.1.100/upload`)
3. Select the file to upload
4. Choose the correct destination directory from the dropdown menu:
   - Root directory (/) for web interface files
   - /settings for configuration files
   - /LanguageFiles for language files
   - /api for API documentation
5. Click the upload button

## Settings File Requirements

For the settings file (`YOUR_CALLSIGN.ini`):

1. The filename **MUST** match your callsign exactly as configured in the controller
2. The file must follow the standard INI format with `key=value` pairs
3. Invalid settings will be rejected and may cause the controller to revert to default settings

## File list explorer section

Let you see what files are already uploaded.

You can delete them and, for settings files (.ini), if there are more than one, you can select which to apply.


## Verification Process

When uploading files, the HRSR Controller performs several checks:

1. **For settings files**:
   - Validates the file extension (must be `.ini`)
   - Verifies the filename matches the controller's callsign
   - Validates the format and content of settings

2. **For web interface files**:
   - Checks for available space in SPIFFS
   - Verifies write permissions to the target directory

## Troubleshooting

If you encounter issues during the upload process:

1. **File rejected**: Ensure the filename matches your callsign exactly
2. **Upload fails**: Check that you have sufficient space in SPIFFS
3. **Settings not applied**: Verify the INI file format is correct
4. **Web interface not updating**: Make sure you're uploading to the correct directory
5. **Other unforseen situations**: Use SPIFFS FORMAT option at the bottom end of the page and upload the files again. The WiFi credentials for Client connection will not be deleted as they are store in a secure location which is not accessible for end user.

## Backup Recommendation

Before uploading new files, especially settings files, it's recommended to:

1. Download a backup of your current settings
2. Keep a local copy of all web interface files
3. Test changes on a development system before applying to your production controller

---



*Note: The HRSR Controller will automatically create necessary directories if they don't exist during the upload process.*
*All rights reserved, Adrian YO3HJV - 2025*
