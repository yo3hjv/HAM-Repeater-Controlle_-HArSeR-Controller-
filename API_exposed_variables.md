# ESP32 Repeater Controller API Exposed Variables

This document lists all variables exposed through the API endpoints, showing how they are named in the backend (core code) and in the frontend (settings.html). This reference helps maintain consistency between the two.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/preferences` | GET | Retrieves all current preferences as JSON |
| `/api/preferences/update` | POST | Updates specified preferences with JSON data |
| `/api/status` | GET | Retrieves current repeater status information |

## Hardware Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `useRssiMode` | `useRssiMode` | `repeaterMode` | Boolean flag for RSSI detection mode (true = RSSI mode, false = carrier detect mode) |
| `CarrierActiveHigh` | `CarrierActiveHigh` | `repeaterMode` | Boolean flag for carrier detect polarity (true = active HIGH, false = active LOW) |
| `lcdEnabled` | `lcdEnabled` | `lcd-enabled` | Boolean flag for LCD display (true = enabled, false = disabled) |
| `LcdI2cAddress` | `LcdI2cAddress` | `lcd-address` | LCD I2C address in hex format (e.g., "0x27") |
| `BeaconPin` | `BeaconPin` | `beacon-pin` | GPIO pin for beacon tone (25, 26, or 27) |
| `CourtesyPin` | `CourtesyPin` | `courtesy-pin` | GPIO pin for courtesy tone (25, 26, or 27) |
| `TailPin` | `TailPin` | `tail-pin` | GPIO pin for tail tone (25, 26, or 27) |

## Timing Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `AKtime` | `AKtime` | `ak-time` | Anti-kerchunk time in milliseconds |
| `HoldTime` | `HoldTime` | `hold-time` | Hold time in milliseconds |
| `fragTime` | `fragTime` | `frag-time` | Fragmentation time in milliseconds |
| `ToTime` | `ToTime` | `timeout` | Timeout in seconds |
| `CourtesyInterval` | `CourtesyInterval` | `courtesy-interval` | Courtesy tone interval in milliseconds |
| `RepeaterTailTime` | `RepeaterTailTime` | `tail-time` | Repeater tail time in seconds |
| `calmDownTime` | `calmDownTime` | `calm-down-time` | Calm down time in seconds |

## RSSI Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `RssiHthresh` | `RssiHthresh` | `rssi-high` | RSSI high threshold |
| `RssiLthresh` | `RssiLthresh` | `rssi-low` | RSSI low threshold |
| `RssiReadings` | `RssiReadings` | `rssi-readings` | Number of RSSI readings to average |

## Tone Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `CourtesyToneFreq` | `CourtesyToneFreq` | `courtesy-tone-freq` | Courtesy tone frequency in Hz |
| `TailToneFreq` | `TailToneFreq` | `tail-tone-freq` | Tail tone frequency in Hz |
| `CourtesyToneDur` | `CourtesyToneDur` | `courtesy-tone-dur` | Courtesy tone duration in milliseconds |
| `TailToneDur` | `TailToneDur` | `tail-tone-dur` | Tail tone duration in milliseconds |
| `PreTimeCourtesy` | `PreTimeCourtesy` | `pre-time-courtesy` | Pre-time for courtesy tone in milliseconds |
| `PreTimeTail` | `PreTimeTail` | `pre-time-tail` | Pre-time for tail tone in milliseconds |
| `CourtesyEnable` | `CourtesyEnable` | `courtesy-enable` | Boolean flag for courtesy tone (true = enabled, false = disabled) |
| `TailToneEnable` | `TailToneEnable` | `tail-tone-enable` | Boolean flag for tail tone (true = enabled, false = disabled) |

## Beacon Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `BeacInterval` | `BeacInterval` | `beacon-interval` | Beacon interval in minutes |
| `CWspeed` | `CWspeed` | `cw-speed` | CW speed for beacon in WPM |
| `CWtone` | `CWtone` | `cw-tone` | CW tone frequency in Hz |
| `BeaconEnable` | `BeaconEnable` | `beacon-enable` | Boolean flag for beacon (true = enabled, false = disabled) |
| `BeaconDelayDots` | `BeaconDelayDots` | `beacon-delay-dots` | Number of dots to delay between callsign and end message (3-10) |
| `BeaconContentActive` | `BeaconContentActive` | `beacon-content-active` | Beacon content when repeater is active |
| `BeaconContentLocked` | `BeaconContentLocked` | `beacon-content-locked` | Beacon content when repeater is locked |
| `BeaconEndActive` | `BeaconEndActive` | `beacon-end-active` | Beacon end message when repeater is active |
| `BeaconEndLocked` | `BeaconEndLocked` | `beacon-end-locked` | Beacon end message when repeater is locked |
| `BeaconContentActiveEnabled` | `BeaconContentActiveEnabled` | `beacon-content-active-enable` | Boolean flag for active beacon content |
| `BeaconContentLockedEnabled` | `BeaconContentLockedEnabled` | `beacon-content-locked-enable` | Boolean flag for locked beacon content |
| `BeaconEndActiveEnabled` | `BeaconEndActiveEnabled` | `beacon-end-active-enable` | Boolean flag for active beacon end message |
| `BeaconEndLockedEnabled` | `BeaconEndLockedEnabled` | `beacon-end-locked-enable` | Boolean flag for locked beacon end message |

## General Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `Callsign` | `Callsign` | `callsign` | Repeater callsign |
| `TailInfo` | `TailInfo` | `tail-info` | Tail information message |
| `PttActiveHigh` | `PttActiveHigh` | `ptt-active-high` | Boolean flag for PTT polarity (true = active HIGH, false = active LOW) |
| `userLockActive` | `userLockActive` | `user-lock` | Boolean flag for user lock (true = locked, false = unlocked) |

## Debug Settings

| Backend (Core Code) | Frontend (JSON Key) | HTML Element ID | Description |
|---------------------|---------------------|-----------------|-------------|
| `DEBUG_LEVEL` | `debugLevel` | `debug-level` | Debug level (0-3) |
| `debugMain` | `debugMain` | `debug-main` | Boolean flag for main debug messages |
| `debugCarrier` | `debugCarrier` | `debug-carrier` | Boolean flag for carrier debug messages |
| `debugRSSI` | `debugRSSI` | `debug-rssi` | Boolean flag for RSSI debug messages |
| `debugBeacon` | `debugBeacon` | `debug-beacon` | Boolean flag for beacon debug messages |
| `debugCourtesy` | `debugCourtesy` | `debug-courtesy` | Boolean flag for courtesy tone debug messages |
| `debugTOT` | `debugTOT` | `debug-tot` | Boolean flag for timeout timer debug messages |
| `debugLCD` | `debugLCD` | `debug-lcd` | Boolean flag for LCD debug messages |

## Notes on API Usage

1. When sending updates via the `/api/preferences/update` endpoint, use the exact JSON key names listed in the "Frontend (JSON Key)" column.
2. The backend code validates incoming values before applying them.
3. When settings are changed, they are immediately saved to preferences and applied.
4. The current values of all preferences can be retrieved from the `/api/preferences` endpoint.
5. For boolean values, use `true` or `false` in JSON (not strings like "true" or "false").
6. For the LCD I2C address, both hex format (e.g., "0x27") and decimal values are accepted.

## Example JSON for Updating Settings

```json
{
  "useRssiMode": true,
  "lcdEnabled": true,
  "LcdI2cAddress": "0x27",
  "BeaconPin": 25,
  "CourtesyPin": 26,
  "TailPin": 27,
  "BeaconDelayDots": 5,
  "Callsign": "YO3HJV",
  "BeaconEndActive": "73",
  "BeaconEndActiveEnabled": true
}
```

## API Response Format

Responses from the API endpoints are in JSON format with the following structure:

```json
{
  "success": true|false,
  "message": "Success or error message"
}
```

In case of validation errors, the response will include details about which values were out of range:

```json
{
  "success": false,
  "message": "Out Of Range: RssiHthresh must be between 0 and 4095; RssiLthresh must be between 0 and 4095;"
}
```
