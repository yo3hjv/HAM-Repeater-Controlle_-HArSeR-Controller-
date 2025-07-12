# ESP32 Repeater Controller - Persistent Settings

This document provides a brief overview of all settings stored in the ESP32's non-volatile preferences storage. These settings persist across power cycles and reboots.

## Preferences Namespace

All settings are stored under the `repeater` namespace.

## Debug Settings

| Key | Type | Description |
|-----|------|-------------|
| `debug_level` | Int | Debug verbosity level (0=None, 1=Error, 2=Info, 3=Verbose) |
| `debugMain` | Bool | Enable debug output for main repeater operations |
| `debugCarr` | Bool | Enable debug output for carrier detection |
| `debugRssi` | Bool | Enable debug output for RSSI detection |
| `debugBeacon` | Bool | Enable debug output for beacon operations |
| `debugCourtesy` | Bool | Enable debug output for courtesy tone |
| `debugTOT` | Bool | Enable debug output for timeout timer |
| `debugLCD` | Bool | Enable debug output for LCD updates |
| `debugPrefs` | Bool | Enable debug output for preferences saving/loading |

## Timing Settings

| Key | Type | Description |
|-----|------|-------------|
| `AKtime` | Int | Anti-Kerchunking time in milliseconds |
| `HoldTime` | Int | Hold time in milliseconds |
| `fragTime` | Int | Fragmentation time in milliseconds |
| `ToTime` | Int | Timeout time in seconds |
| `CourtesyInt` | Int | Courtesy tone interval in milliseconds |
| `TailTime` | Int | Repeater tail time in seconds |
| `calmDownTime` | Int | Calm-down time after timeout in seconds |
| `PreTimeCourtesy` | Int | Delay before courtesy tone in milliseconds |
| `PreTimeTail` | Int | Delay before tail tone in milliseconds |

## RSSI Settings

| Key | Type | Description |
|-----|------|-------------|
| `RssiHthresh` | Int | RSSI high threshold for signal detection |
| `RssiLthresh` | Int | RSSI low threshold (hysteresis) |
| `RssiRead` | Int | Number of RSSI readings to average |

## Beacon Settings

| Key | Type | Description |
|-----|------|-------------|
| `BeacInt` | Int | Beacon interval in minutes (0 = disabled) |
| `CWspeed` | Int | CW speed in words per minute |
| `CWtone` | Int | CW tone frequency in Hz |
| `BeaconDelayDots` | Int | Delay between callsign and end message in dot units |
| `BeaconEndMsgActive` | String | End message text when repeater is active |
| `BeaconEndMsgLocked` | String | End message text when repeater is locked |
| `BeaconEndMsgActiveEn` | Bool | Enable end message when repeater is active |
| `BeaconEndMsgLockedEn` | Bool | Enable end message when repeater is locked |

## Tone Settings

| Key | Type | Description |
|-----|------|-------------|
| `CToneFreq` | Int | Courtesy tone frequency in Hz |
| `TailToneFreq` | Int | Tail tone frequency in Hz |
| `CToneDur` | Int | Courtesy tone duration in milliseconds |
| `TailToneDur` | Int | Tail tone duration in milliseconds |

## Hardware Settings

| Key | Type | Description |
|-----|------|-------------|
| `useRssiMode` | Bool | Use RSSI for signal detection (true) or carrier detect (false) |
| `CarrActHigh` | Bool | Carrier detect is active high (true) or active low (false) |
| `PttActHigh` | Bool | PTT is active high (true) or active low (false) |
| `LcdI2cAddr` | Int | I2C address of LCD display (typically 0x27) |
| `lcdEnabled` | Bool | Enable LCD display |

## General Settings

| Key | Type | Description |
|-----|------|-------------|
| `Callsign` | String | Repeater callsign |
| `TailInfo` | String | Information sent during tail |
| `userLockActive` | Bool | Repeater lock status (true = locked) |

## Notes

1. All settings are loaded at startup from preferences
2. Settings are saved whenever changed via the web interface
3. Settings can be exported as an INI file via the Download Settings button
4. Default values are used if a preference is not found in storage
