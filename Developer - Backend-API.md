# HRSR Controller Backend API Documentation

## Overview

This document provides comprehensive information for developers who want to build their own frontend for the HRSR Controller. It details the available API endpoints, exposed variables, command structures, and the role of each component in the system.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/preferences` | GET | Retrieves all current preferences as JSON |
| `/api/preferences/update` | POST | Updates specified preferences with JSON data |
| `/api/repeater-status` | GET | Retrieves current repeater status information |
| `/api/rssi` | GET | Retrieves only the current RSSI value (for high-frequency polling) |

## WebSocket Interface

The HRSR Controller provides a WebSocket interface for real-time updates:

| Event Type | Description |
|------------|-------------|
| `status` | Provides comprehensive status updates about the repeater |
| `rssi` | Provides only RSSI value updates at a higher frequency |

### WebSocket Connection

```javascript
// Example WebSocket connection
const ws = new WebSocket(`ws://${window.location.hostname}/ws`);

ws.onopen = () => {
  console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // Handle different message types
  if (data.type === 'status') {
    // Handle status update
    updateRepeaterStatus(data);
  } else if (data.type === 'rssi') {
    // Handle RSSI update
    updateRssiValue(data.value);
  }
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
  // Implement reconnection logic
};
```

## Exposed Variables

### Repeater Status Variables

These variables are available through the `/api/repeater-status` endpoint and WebSocket `status` events:

| Variable Name | Type | Description |
|---------------|------|-------------|
| `repeaterState` | String | Current state of the repeater ("Stand By", "Repeating", "Locked", "Active") |
| `currentMode` | String | Current detection mode ("RSSI" or "Logic Carrier") |
| `operationState` | String | Detailed operation state ("Stand By", "Repeating", "ToT Reached", "Sending Beacon") |
| `totStatus` | String | Time-out timer status ("Normal", "Reached") |
| `toTime` | Number | Current timeout value in seconds |
| `beaconStatus` | String | Beacon status ("Idle", "Sending") |
| `rssiValue` | String | Current RSSI value (e.g., "1500 raw") |
| `rssiLthresh` | Number | RSSI low threshold value |
| `rssiHthresh` | Number | RSSI high threshold value |
| `carrierDetect` | Boolean | Whether carrier is currently detected |
| `pttStatus` | Boolean | Whether PTT is currently active |
| `calmDownTime` | Number | Current calm-down time value in seconds |
| `userLockActive` | Boolean | Whether the repeater is currently locked by user |

### Preference Variables

These variables are available through the `/api/preferences` endpoint and can be updated via `/api/preferences/update`:

#### Hardware Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `useRssiMode` | Boolean | true/false | Whether RSSI detection mode is enabled |
| `CarrierActiveHigh` | Boolean | true/false | Carrier detect polarity (true = active HIGH, false = active LOW) |
| `lcdEnabled` | Boolean | true/false | Whether LCD display is enabled |
| `LcdI2cAddress` | String | "0x00"-"0xFF" | LCD I2C address in hex format |
| `BeaconPin` | Number | 25, 26, 27 | GPIO pin for beacon tone |
| `CourtesyPin` | Number | 25, 26, 27 | GPIO pin for courtesy tone |
| `TailPin` | Number | 25, 26, 27 | GPIO pin for tail tone |
| `PttActiveHigh` | Boolean | true/false | PTT polarity (true = active HIGH, false = active LOW) |

#### Timing Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `AKtime` | Number | 0-10000 | Anti-kerchunk time in milliseconds |
| `HoldTime` | Number | 0-10000 | Hold time in milliseconds |
| `fragTime` | Number | 0-10000 | Fragmentation time in milliseconds |
| `ToTime` | Number | 0-600 | Timeout in seconds |
| `CourtesyInterval` | Number | 0-10000 | Courtesy tone interval in milliseconds |
| `RepeaterTailTime` | Number | 0-60 | Repeater tail time in seconds |
| `calmDownTime` | Number | 0-600 | Calm down time in seconds |

#### RSSI Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `RssiHthresh` | Number | 0-4095 | RSSI high threshold |
| `RssiLthresh` | Number | 0-4095 | RSSI low threshold |
| `RssiReadings` | Number | 1-100 | Number of RSSI readings to average |

#### Tone Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `CourtesyToneFreq` | Number | 100-2000 | Courtesy tone frequency in Hz |
| `TailToneFreq` | Number | 100-2000 | Tail tone frequency in Hz |
| `CourtesyToneDur` | Number | 10-1000 | Courtesy tone duration in milliseconds |
| `TailToneDur` | Number | 10-1000 | Tail tone duration in milliseconds |
| `PreTimeCourtesy` | Number | 0-1000 | Pre-time for courtesy tone in milliseconds |
| `PreTimeTail` | Number | 0-1000 | Pre-time for tail tone in milliseconds |
| `CourtesyEnable` | Boolean | true/false | Whether courtesy tone is enabled |
| `TailToneEnable` | Boolean | true/false | Whether tail tone is enabled |

#### Beacon Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `BeacInterval` | Number | 0-60 | Beacon interval in minutes |
| `CWspeed` | Number | 5-30 | CW speed for beacon in WPM |
| `CWtone` | Number | 100-2000 | CW tone frequency in Hz |
| `BeaconEnable` | Boolean | true/false | Whether beacon is enabled |
| `BeaconDelayDots` | Number | 3-10 | Number of dots to delay between callsign and end message |
| `BeaconContentActive` | String | Max 10 chars | Beacon content when repeater is active |
| `BeaconContentLocked` | String | Max 10 chars | Beacon content when repeater is locked |
| `BeaconEndActive` | String | Max 10 chars | Beacon end message when repeater is active |
| `BeaconEndLocked` | String | Max 10 chars | Beacon end message when repeater is locked |
| `BeaconContentActiveEnabled` | Boolean | true/false | Whether active beacon content is enabled |
| `BeaconContentLockedEnabled` | Boolean | true/false | Whether locked beacon content is enabled |
| `BeaconEndActiveEnabled` | Boolean | true/false | Whether active beacon end message is enabled |
| `BeaconEndLockedEnabled` | Boolean | true/false | Whether locked beacon end message is enabled |

#### General Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `Callsign` | String | Valid callsign | Repeater callsign |
| `TailInfo` | String | Any string | Tail information message |
| `userLockActive` | Boolean | true/false | Whether repeater is locked by user |

#### Debug Settings

| Variable Name | Type | Valid Range | Description |
|---------------|------|-------------|-------------|
| `debugLevel` | Number | 0-3 | Debug level |
| `debugMain` | Boolean | true/false | Whether main debug messages are enabled |
| `debugCarrier` | Boolean | true/false | Whether carrier debug messages are enabled |
| `debugRSSI` | Boolean | true/false | Whether RSSI debug messages are enabled |
| `debugBeacon` | Boolean | true/false | Whether beacon debug messages are enabled |
| `debugCourtesy` | Boolean | true/false | Whether courtesy tone debug messages are enabled |
| `debugTOT` | Boolean | true/false | Whether timeout timer debug messages are enabled |
| `debugLCD` | Boolean | true/false | Whether LCD debug messages are enabled |

## Updating Preferences

To update preferences, send a POST request to `/api/preferences/update` with a JSON object containing the variables to update:

```javascript
// Example function to update preferences
function updatePreferences(preferencesObject) {
  return fetch('/api/preferences/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencesObject)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Preferences updated successfully');
      return true;
    } else {
      console.error('Error updating preferences:', data.message);
      return false;
    }
  })
  .catch(error => {
    console.error('Failed to update preferences:', error);
    return false;
  });
}

// Example usage
updatePreferences({
  useRssiMode: true,
  RssiHthresh: 1800,
  RssiLthresh: 1400,
  BeaconEnable: true,
  BeacInterval: 15
});
```

### Response Format

All API responses follow this JSON format:

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

## Special Cases

### Detection Mode Settings

The detection mode combines two variables: `useRssiMode` and `CarrierActiveHigh`:

1. RSSI Mode: Set `useRssiMode` to `true` (the value of `CarrierActiveHigh` doesn't matter)
2. Carrier Detect active LOW: Set `useRssiMode` to `false` and `CarrierActiveHigh` to `false`
3. Carrier Detect active HIGH: Set `useRssiMode` to `false` and `CarrierActiveHigh` to `true`

### Beacon Messages

The beacon system supports different messages based on repeater state:

1. When repeater is active (normal operation): Uses `BeaconEndActive`
2. When repeater is locked (`userLockActive=true`): Uses `BeaconEndLocked`

Each message type has an associated enable flag (e.g., `BeaconEndActiveEnabled`).

## Best Practices for Frontend Development

1. **Use WebSockets for Real-time Updates**: For responsive UIs, connect to the WebSocket endpoint for real-time status updates rather than polling the API.

2. **Optimize RSSI Updates**: If you need high-frequency RSSI updates, use the dedicated `/api/rssi` endpoint or the WebSocket `rssi` event type.

3. **Validate Input Values**: Always validate input values on the client side before sending them to the API to prevent validation errors.

4. **Handle Connection Issues**: Implement reconnection logic for WebSocket connections to maintain real-time updates during network interruptions.

5. **Use Proper Boolean Values**: When sending boolean values to the API, use actual boolean values (`true`/`false`), not strings (`"true"`/`"false"`).

6. **Batch Updates**: When updating multiple preferences, batch them into a single API call rather than making multiple calls.

## Example: Creating a Custom Signal Meter

```javascript
// Example code for a custom signal meter using WebSockets
function initializeSignalMeter() {
  const signalMeter = document.getElementById('signal-meter');
  const rssiValue = document.getElementById('rssi-value');
  const lowThreshold = document.getElementById('low-threshold');
  const highThreshold = document.getElementById('high-threshold');
  
  // Initialize WebSocket connection
  const ws = new WebSocket(`ws://${window.location.hostname}/ws`);
  
  ws.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'rssi') {
      // Update signal meter with RSSI value
      const rssi = parseInt(data.value);
      const percentage = Math.min(100, Math.max(0, (rssi / 4095) * 100));
      
      // Update meter display
      signalMeter.style.width = `${percentage}%`;
      rssiValue.textContent = rssi;
      
      // Change color based on thresholds
      if (rssi > data.rssiHthresh) {
        signalMeter.className = 'signal-high';
      } else if (rssi > data.rssiLthresh) {
        signalMeter.className = 'signal-medium';
      } else {
        signalMeter.className = 'signal-low';
      }
    } else if (data.type === 'status') {
      // Update threshold markers
      lowThreshold.style.left = `${(data.rssiLthresh / 4095) * 100}%`;
      highThreshold.style.left = `${(data.rssiHthresh / 4095) * 100}%`;
    }
  };
  
  ws.onclose = () => {
    console.log('WebSocket connection closed');
    // Reconnect after 2 seconds
    setTimeout(initializeSignalMeter, 2000);
  };
}
```

## Conclusion

This documentation provides a comprehensive reference for developers who want to build custom frontends for the HRSR Controller. By understanding the available API endpoints, exposed variables, and best practices, you can create powerful and responsive user interfaces that interact seamlessly with the controller's backend.

For additional information, refer to the API documentation files in the `/api/` directory of the HRSR Controller's SPIFFS filesystem.

*** Copyright: Adrian YO3HJV - 2025 ***
