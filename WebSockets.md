# ESP32 Repeater Controller WebSocket Implementation

## Overview

This document describes the WebSocket implementation for the ESP32 Repeater Controller, which enables real-time data updates to the frontend without requiring frequent page refreshes or API polling.

## Purpose

The primary purpose of the WebSocket implementation is to provide real-time RSSI (Received Signal Strength Indicator) values to the frontend. Additionally, it provides other status information that benefits from real-time updates, such as carrier detection status, PTT status, and repeater state.

## Technical Details

### Backend Implementation

- **Library**: Uses the ArduinoWebsockets library by Gil Maimon
- **Port**: WebSocket server runs on port 81 (separate from the main web server on port 80)
- **Update Interval**: Configurable via the `wsUpdateInterval` variable (default: 200ms)
- **Enable/Disable**: Can be enabled/disabled via the `wsEnabled` flag

### Data Format

The WebSocket server sends JSON data with the following structure:

```json
{
  "rssi": 123,                  // RSSI value (primary purpose)
  "carrier": true|false,        // Carrier detection status
  "ptt": true|false,            // PTT status (active/inactive)
  "repeaterState": "STAND BY"   // Current repeater state
}
```

The `repeaterState` field can have the following values:
- `"STAND BY"`: Repeater is idle
- `"RECEIVING"`: Repeater is receiving a signal
- `"REPEATING"`: Repeater is actively repeating
- `"COURTESY"`: Repeater is playing courtesy tone
- `"BEACON"`: Repeater is sending a beacon
- `"TAIL"`: Repeater is in tail mode
- `"TIMEOUT"`: Repeater has timed out
- `"CALM DOWN"`: Repeater is in calm down period
- `"USER LOCKED"`: Repeater is locked by user
- `"FRAGMENT"`: Repeater detected a signal fragment

### API Endpoint

The WebSocket connection information can be retrieved from the following API endpoint:

```
GET /api/websocket-info
```

Response:
```json
{
  "enabled": true|false,        // Whether WebSockets are enabled
  "port": 81,                   // WebSocket server port
  "updateInterval": 200         // Update interval in milliseconds
}
```

## Frontend Integration

To connect to the WebSocket server from the frontend:

```javascript
// Get WebSocket connection info
fetch('/api/websocket-info')
  .then(response => response.json())
  .then(info => {
    if (info.enabled) {
      // Create WebSocket connection
      const ws = new WebSocket(`ws://${window.location.hostname}:${info.port}`);
      
      // Connection opened
      ws.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
      });
      
      // Listen for messages
      ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        
        // Update RSSI display
        if (document.getElementById('rssi-value')) {
          document.getElementById('rssi-value').textContent = data.rssi;
        }
        
        // Update other status elements as needed
        // ...
      });
      
      // Connection closed
      ws.addEventListener('close', (event) => {
        console.log('Disconnected from WebSocket server');
        // Implement reconnection logic if needed
      });
    }
  })
  .catch(error => {
    console.error('Error fetching WebSocket info:', error);
  });
```

## Future Enhancements

Potential future enhancements for the WebSocket implementation:

1. Bidirectional communication for remote control features
2. Additional real-time metrics (temperature, voltage, etc.)
3. WebSocket authentication for secure remote control
4. Configurable update rates for different data types
5. Client-specific data filtering

## Troubleshooting

Common issues and solutions:

- **Connection Refused**: Ensure the WebSocket server is enabled and running on port 81
- **High CPU Usage**: Increase the update interval to reduce the frequency of updates
- **Memory Issues**: Reduce the amount of data sent in each update
- **Disconnections**: Implement reconnection logic on the client side
