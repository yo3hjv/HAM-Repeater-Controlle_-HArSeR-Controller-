/**
 * ESP32 Repeater Controller - Index Page Functionality
 * Handles fetching and displaying repeater status information
 */

// Store repeater status information
let repeaterStatus = {
  repeaterState: 'Stand By',
  currentMode: 'Carrier',
  operationState: 'Stand By',
  totStatus: 'Normal',
  totTime: '',
  beaconStatus: 'Idle',
  rssiValue: '0 raw',
  carrierDetect: false,
  pttStatus: false,
  courtesyEnabled: true,
  tailToneEnabled: true,
  beaconMessage: '',
  beaconInterval: 0,
  beaconIntervalFormatted: '00:00'
};

// WebSocket connection
let ws = null;
let wsConnected = false;
let wsReconnectInterval = null;

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing repeater status');
  
  // Initial update
  fetchRepeaterStatus();
  
  // Set up periodic refresh in milliseconds (default: 5000 msec)
  setInterval(fetchRepeaterStatus, 5000);
  
  // Initialize WebSocket connection for real-time RSSI updates
  initWebSocket();
});

// Function to update preferences via API (same pattern as settings.html)
function updateRepeaterPreferences(jsonData) {
  // Log the data being sent
  console.log('Sending data to API:', jsonData);
  
  // Send the data to the API endpoint
  fetch('/api/preferences/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('API response:', data);
    // Refresh repeater status to show updated values
    fetchRepeaterStatus();
  })
  .catch(error => {
    console.error('Error updating preferences:', error);
  });
}

// Function to fetch repeater status from the server
function fetchRepeaterStatus() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Fetching repeater status...`);
  
  // Add cache-busting parameter to prevent caching
  fetch('/api/repeater-status?_=' + Date.now())
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch repeater status');
      }
      return response.json();
    })
    .then(data => {
      console.log('Received repeater status:', data);
      
      // Store the data
      repeaterStatus = data;
      
      // Now fetch preferences to get additional data
      return fetch('/api/preferences?_=' + Date.now());
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
    })
    .then(preferences => {
      console.log('Received preferences:', preferences);
      
      // Update repeaterStatus with additional data
      repeaterStatus.courtesyEnabled = preferences.CourtesyEnable === true || preferences.CourtesyEnable === 'true';
      // Ensure we're using the correct variable name and properly converting to boolean
      console.log('TailToneEnable value:', preferences.TailToneEnable, typeof preferences.TailToneEnable);
      repeaterStatus.tailToneEnabled = preferences.TailToneEnable === true || preferences.TailToneEnable === 'true';
      
      // Make sure userLockActive is properly updated from preferences
      console.log('userLockActive value:', preferences.userLockActive, typeof preferences.userLockActive);
      repeaterStatus.userLockActive = preferences.userLockActive === true || preferences.userLockActive === 'true';
      
      // Create combined beacon message based on repeater state
      const callsign = preferences.Callsign || '';
      let endMessage = '';
      
      // Determine which end message to use based on user lock state
      if (repeaterStatus.userLockActive) {
        // For locked state, use BeaconEndMessageLocked if enabled
        console.log('Locked state, BeaconEndMessageLocked:', preferences.BeaconEndMessageLocked);
        endMessage = preferences.BeaconEndMessageLocked || '';
      } else {
        // For active state, use BeaconEndMessageActive if enabled
        console.log('Active state, BeaconEndMessageActive:', preferences.BeaconEndMessageActive);
        endMessage = preferences.BeaconEndMessageActive || '';
      }
      
      // Combine callsign and end message
      repeaterStatus.beaconMessage = callsign + (endMessage ? ' ' + endMessage : '');
      
      // Format beacon interval as MMM:ss (minutes:seconds)
      const beaconInterval = parseInt(preferences.BeacInterval) || 0;
      const minutes = Math.floor(beaconInterval);
      const seconds = Math.round((beaconInterval - minutes) * 60);
      repeaterStatus.beaconIntervalFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Update the status elements
      updateRepeaterStatus();
    })
    .catch(error => {
      console.error('Error fetching repeater status:', error);
      // Just log the error, don't use simulated data
      // The UI will continue to show the last known good state
    });
}

// Update repeater status elements
function updateRepeaterStatus() {
  console.log('Updating repeater status UI with:', repeaterStatus);
  
  // Update main repeater state text
  const repeaterStateText = document.getElementById('repeater-state');
  if (repeaterStateText) {
    repeaterStateText.textContent = repeaterStatus.repeaterState;
    console.log('Updated repeater state text to:', repeaterStatus.repeaterState);
  } else {
    console.error('Could not find repeater-state element');
  }
  
  // Update repeater state indicator
  const repeaterStateIndicator = document.getElementById('repeater-state-indicator');
  if (repeaterStateIndicator) {
    // Remove all status classes
    repeaterStateIndicator.classList.remove('status-active', 'status-standby', 'status-error', 'status-beacon', 'status-inactive');
    
    // Add appropriate class based on state
    if (repeaterStatus.repeaterState === 'Repeating') {
      repeaterStateIndicator.classList.add('status-active');
    } else if (repeaterStatus.repeaterState === 'Locked') {
      repeaterStateIndicator.classList.add('status-error');
    } else if (repeaterStatus.repeaterState === 'Active') {
      repeaterStateIndicator.classList.add('status-beacon');
    } else {
      repeaterStateIndicator.classList.add('status-standby');
    }
  } else {
    console.error('Could not find repeater-state-indicator element');
  }
  
  // Update RSSI value
  const rssiValueElement = document.getElementById('rssi-value');
  if (rssiValueElement) {
    rssiValueElement.textContent = repeaterStatus.rssiValue;
    
    // Add a small RSSI meter visualization
    const rssiValue = parseInt(repeaterStatus.rssiValue);
    if (!isNaN(rssiValue)) {
      // Create or update RSSI meter
      let rssiMeter = document.getElementById('rssi-meter');
      if (!rssiMeter) {
        rssiMeter = document.createElement('div');
        rssiMeter.id = 'rssi-meter';
        rssiMeter.style.marginTop = '5px';
        rssiMeter.style.height = '10px';
        rssiMeter.style.width = '100%';
        rssiMeter.style.backgroundColor = '#e0e0e0';
        rssiMeter.style.position = 'relative';
        rssiMeter.style.borderRadius = '5px';
        rssiMeter.style.overflow = 'hidden';
        
        const rssiBar = document.createElement('div');
        rssiBar.id = 'rssi-bar';
        rssiBar.style.height = '100%';
        rssiBar.style.backgroundColor = '#4CAF50';
        rssiBar.style.width = '0%';
        rssiBar.style.position = 'absolute';
        rssiBar.style.left = '0';
        rssiBar.style.top = '0';
        rssiBar.style.transition = 'width 0.3s ease-in-out';
        
        rssiMeter.appendChild(rssiBar);
        rssiValueElement.parentNode.appendChild(rssiMeter);
      }
      
      // Update the RSSI bar width based on value (assuming 0-4095 range for ESP32 ADC)
      const rssiBar = document.getElementById('rssi-bar');
      if (rssiBar) {
        const percentage = Math.min(100, Math.max(0, (rssiValue / 4095) * 100));
        rssiBar.style.width = percentage + '%';
        
        // Change color based on signal strength
        if (percentage > 70) {
          rssiBar.style.backgroundColor = '#4CAF50'; // Green for strong signal
        } else if (percentage > 30) {
          rssiBar.style.backgroundColor = '#FFC107'; // Yellow for medium signal
        } else {
          rssiBar.style.backgroundColor = '#F44336'; // Red for weak signal
        }
      }
    }
  }
  
  // Update carrier detect status
  const carrierStatusElement = document.getElementById('carrier-status');
  const carrierIndicator = document.getElementById('carrier-indicator');
  if (carrierStatusElement && carrierIndicator) {
    // Update text
    carrierStatusElement.textContent = repeaterStatus.carrierDetect ? 'Active' : 'Inactive';
    carrierStatusElement.className = repeaterStatus.carrierDetect ? 'lang-active' : 'lang-inactive';
    
    // Update indicator
    carrierIndicator.classList.remove('status-active', 'status-inactive');
    carrierIndicator.classList.add(repeaterStatus.carrierDetect ? 'status-active' : 'status-inactive');
  }
  
  // Update PTT status
  const pttStatusElement = document.getElementById('ptt-status');
  const pttIndicator = document.getElementById('ptt-indicator');
  if (pttStatusElement && pttIndicator) {
    // Update text
    pttStatusElement.textContent = repeaterStatus.pttStatus ? 'Active' : 'Inactive';
    pttStatusElement.className = repeaterStatus.pttStatus ? 'lang-active' : 'lang-inactive';
    
    // Update indicator
    pttIndicator.classList.remove('status-active', 'status-inactive');
    pttIndicator.classList.add(repeaterStatus.pttStatus ? 'status-active' : 'status-inactive');
  }
  
  // Update current mode
  const currentModeElement = document.getElementById('current-mode');
  if (currentModeElement) {
    currentModeElement.textContent = repeaterStatus.currentMode;
  }
  
  // Update operation state
  const operationStateText = document.getElementById('operation-state-text');
  if (operationStateText) {
    operationStateText.textContent = repeaterStatus.operationState;
  }
  
  // Update operation state indicator
  const operationStateIndicator = document.getElementById('operation-state-indicator');
  if (operationStateIndicator) {
    // Remove all status classes
    operationStateIndicator.classList.remove('status-active', 'status-standby', 'status-error', 'status-beacon', 'status-inactive');
    
    // Add appropriate class based on state
    if (repeaterStatus.operationState === 'Repeating') {
      operationStateIndicator.classList.add('status-active');
    } else if (repeaterStatus.operationState === 'ToT Reached') {
      operationStateIndicator.classList.add('status-error');
    } else if (repeaterStatus.operationState === 'Sending Beacon') {
      operationStateIndicator.classList.add('status-beacon');
    } else {
      operationStateIndicator.classList.add('status-standby');
    }
  }
  
  // Update ToT status
  const totStatusText = document.getElementById('tot-status-text');
  if (totStatusText) {
    // Use translateText function if available, otherwise use the raw status
    if (typeof translateText === 'function') {
      totStatusText.textContent = translateText(repeaterStatus.totStatus.toLowerCase(), repeaterStatus.totStatus);
      // Update the class to match the current status for proper translation
      totStatusText.className = 'lang-' + repeaterStatus.totStatus.toLowerCase();
    } else {
      totStatusText.textContent = repeaterStatus.totStatus;
    }
  }
  
  // Update ToT indicator
  const totIndicator = document.getElementById('tot-indicator');
  if (totIndicator) {
    // Remove all status classes
    totIndicator.classList.remove('status-active', 'status-standby', 'status-error', 'status-beacon', 'status-inactive');
    
    // Add appropriate class based on ToT status
    if (repeaterStatus.totStatus === 'Reached') {
      totIndicator.classList.add('status-error');
    } else {
      totIndicator.classList.add('status-standby');
    }
  }
  
  // Update ToT time
  const totTimeElement = document.getElementById('tot-time');
  if (totTimeElement) {
    totTimeElement.textContent = repeaterStatus.totTime || '';
  }
  
  // Update beacon status
  const beaconStatusText = document.getElementById('beacon-status-text');
  if (beaconStatusText) {
    beaconStatusText.textContent = repeaterStatus.beaconStatus;
  }
  
  // Update beacon indicator
  const beaconIndicator = document.getElementById('beacon-indicator');
  if (beaconIndicator) {
    // Remove all status classes
    beaconIndicator.classList.remove('status-active', 'status-standby', 'status-error', 'status-beacon', 'status-inactive');
    
    // Add appropriate class based on beacon status
    if (repeaterStatus.beaconStatus === 'Sending') {
      beaconIndicator.classList.add('status-beacon');
    } else {
      beaconIndicator.classList.add('status-inactive');
    }
  }
  
  // Update courtesy tone status
  const courtesyStateText = document.getElementById('courtesy-state-text');
  const courtesyIndicator = document.getElementById('courtesy-indicator');
  if (courtesyStateText && courtesyIndicator) {
    // Update text
    courtesyStateText.textContent = repeaterStatus.courtesyEnabled ? 'Enabled' : 'Disabled';
    
    // Update indicator
    courtesyIndicator.classList.remove('status-active', 'status-inactive');
    courtesyIndicator.classList.add(repeaterStatus.courtesyEnabled ? 'status-active' : 'status-inactive');
  }
  
  // Update tail tone status
  const tailStateText = document.getElementById('tail-state-text');
  const tailIndicator = document.getElementById('tail-indicator');
  if (tailStateText && tailIndicator) {
    // Log the current value for debugging
    console.log('Tail Tone Enabled:', repeaterStatus.tailToneEnabled, typeof repeaterStatus.tailToneEnabled);
    
    // Update text
    tailStateText.textContent = repeaterStatus.tailToneEnabled ? 'Enabled' : 'Disabled';
    
    // Update indicator
    tailIndicator.classList.remove('status-active', 'status-inactive');
    tailIndicator.classList.add(repeaterStatus.tailToneEnabled ? 'status-active' : 'status-inactive');
  }
  
  // Update beacon message
  const beaconMessageElement = document.getElementById('beacon-message');
  if (beaconMessageElement) {
    // Display the appropriate beacon message based on repeater state
    // If userLockActive is true, show "[Callsign] + [Locked Message]", otherwise "[Callsign] + [Active Message]"
    beaconMessageElement.textContent = repeaterStatus.beaconMessage || '{CALLSIGN}';
  }
  
  // Update beacon interval
  const beaconIntervalElement = document.getElementById('beacon-interval-formatted');
  if (beaconIntervalElement) {
    beaconIntervalElement.textContent = repeaterStatus.beaconIntervalFormatted || '00:00';
  }
}

// Initialize WebSocket connection for real-time updates
function initWebSocket() {
  // Close any existing connection
  if (ws) {
    ws.close();
  }
  
  // Clear any existing reconnect interval
  if (wsReconnectInterval) {
    clearInterval(wsReconnectInterval);
    wsReconnectInterval = null;
  }
  
  // Determine WebSocket URL (use current hostname with WebSocket port 81)
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const wsUrl = protocol + window.location.hostname + ':81';
  
  console.log('Connecting to WebSocket server at:', wsUrl);
  
  try {
    ws = new WebSocket(wsUrl);
    
    ws.onopen = function() {
      console.log('WebSocket connection established');
      wsConnected = true;
      
      // Add a small indicator to show WebSocket is connected
      let wsIndicator = document.getElementById('ws-indicator');
      if (!wsIndicator) {
        wsIndicator = document.createElement('div');
        wsIndicator.id = 'ws-indicator';
        wsIndicator.style.position = 'fixed';
        wsIndicator.style.bottom = '10px';
        wsIndicator.style.right = '10px';
        wsIndicator.style.width = '10px';
        wsIndicator.style.height = '10px';
        wsIndicator.style.borderRadius = '50%';
        wsIndicator.style.backgroundColor = '#4CAF50';
        wsIndicator.title = 'WebSocket Connected';
        document.body.appendChild(wsIndicator);
      } else {
        wsIndicator.style.backgroundColor = '#4CAF50';
        wsIndicator.title = 'WebSocket Connected';
      }
    };
    
    ws.onclose = function() {
      console.log('WebSocket connection closed');
      wsConnected = false;
      
      // Update indicator to show disconnected state
      const wsIndicator = document.getElementById('ws-indicator');
      if (wsIndicator) {
        wsIndicator.style.backgroundColor = '#F44336';
        wsIndicator.title = 'WebSocket Disconnected - Reconnecting...';
      }
      
      // Set up reconnect interval if not already set
      if (!wsReconnectInterval) {
        wsReconnectInterval = setInterval(function() {
          console.log('Attempting to reconnect WebSocket...');
          initWebSocket();
        }, 5000); // Try to reconnect every 5 seconds
      }
    };
    
    ws.onerror = function(error) {
      console.error('WebSocket error:', error);
      // The onclose handler will be called after this
    };
    
    ws.onmessage = function(event) {
      console.log('WebSocket message received:', event.data);
      
      try {
        // Parse the JSON data
        const wsData = JSON.parse(event.data);
        console.log('Parsed RSSI value:', wsData.rssi);
        console.log('Parsed repeater state:', wsData.repeaterState);
        
        // Update RSSI value with real-time data
        if (wsData.rssi !== undefined) {
          repeaterStatus.rssiValue = wsData.rssi + ' raw';
          
          // Update RSSI display immediately
          const rssiValueElement = document.getElementById('rssi-value');
          if (rssiValueElement) {
            rssiValueElement.textContent = repeaterStatus.rssiValue;
            
            // Update RSSI meter
            const rssiBar = document.getElementById('rssi-bar');
            if (rssiBar) {
              const percentage = Math.min(100, Math.max(0, (wsData.rssi / 4095) * 100));
              rssiBar.style.width = percentage + '%';
              
              // Change color based on signal strength
              if (percentage > 70) {
                rssiBar.style.backgroundColor = '#4CAF50'; // Green for strong signal
              } else if (percentage > 30) {
                rssiBar.style.backgroundColor = '#FFC107'; // Yellow for medium signal
              } else {
                rssiBar.style.backgroundColor = '#F44336'; // Red for weak signal
              }
            }
          }
        }
        
        // Update courtesy and tail tone status
        if (wsData.courtesyEnabled !== undefined) {
          repeaterStatus.courtesyEnabled = wsData.courtesyEnabled === 'true' || wsData.courtesyEnabled === true;
          
          // Update courtesy display immediately
          const courtesyStateText = document.getElementById('courtesy-state-text');
          const courtesyIndicator = document.getElementById('courtesy-indicator');
          
          if (courtesyStateText && courtesyIndicator) {
            courtesyStateText.textContent = repeaterStatus.courtesyEnabled ? 'Enabled' : 'Disabled';
            courtesyIndicator.classList.remove('status-active', 'status-inactive');
            courtesyIndicator.classList.add(repeaterStatus.courtesyEnabled ? 'status-active' : 'status-inactive');
          }
        }
        
        // WebSocket doesn't handle Tail Tone updates - using Ajax instead
        
        // Update beacon message
        if (wsData.beaconMessage !== undefined) {
          repeaterStatus.beaconMessage = wsData.beaconMessage;
          
          // Update beacon message display immediately
          const beaconMessageElement = document.getElementById('beacon-message');
          if (beaconMessageElement) {
            beaconMessageElement.textContent = repeaterStatus.beaconMessage;
          }
        }
        
        // WebSocket doesn't handle Beacon Interval updates - using Ajax instead
        
        // Update carrier detect status with real-time data
        if (wsData.carrier !== undefined) {
          repeaterStatus.carrierDetect = wsData.carrier === 'true' || wsData.carrier === true;
          
          // Update carrier display immediately
          const carrierStatusElement = document.getElementById('carrier-status');
          const carrierIndicator = document.getElementById('carrier-indicator');
          
          if (carrierStatusElement && carrierIndicator) {
            if (repeaterStatus.carrierDetect) {
              carrierStatusElement.textContent = 'Active';
              carrierStatusElement.className = 'lang-active';
              carrierIndicator.classList.remove('status-inactive');
              carrierIndicator.classList.add('status-active');
            } else {
              carrierStatusElement.textContent = 'Inactive';
              carrierStatusElement.className = 'lang-inactive';
              carrierIndicator.classList.remove('status-active');
              carrierIndicator.classList.add('status-inactive');
            }
          }
        }
        
        // Update PTT status with real-time data
        if (wsData.ptt !== undefined) {
          repeaterStatus.pttStatus = wsData.ptt === 'true' || wsData.ptt === true;
          
          // Update PTT display immediately
          const pttStatusElement = document.getElementById('ptt-status');
          const pttIndicator = document.getElementById('ptt-indicator');
          
          if (pttStatusElement && pttIndicator) {
            if (repeaterStatus.pttStatus) {
              pttStatusElement.textContent = 'Active';
              pttStatusElement.className = 'lang-active';
              pttIndicator.classList.remove('status-inactive');
              pttIndicator.classList.add('status-active');
            } else {
              pttStatusElement.textContent = 'Inactive';
              pttStatusElement.className = 'lang-inactive';
              pttIndicator.classList.remove('status-active');
              pttIndicator.classList.add('status-inactive');
            }
          }
        }
        
        // Update repeater state with real-time data
        if (wsData.repeaterState !== undefined) {
          repeaterStatus.repeaterState = wsData.repeaterState;
          
          // Update repeater state display immediately
          const repeaterStateText = document.getElementById('repeater-state');
          const repeaterStateIndicator = document.getElementById('repeater-state-indicator');
          
          if (repeaterStateText) {
            repeaterStateText.textContent = repeaterStatus.repeaterState;
          }
          
          if (repeaterStateIndicator) {
            // Remove all status classes
            repeaterStateIndicator.classList.remove('status-active', 'status-standby', 'status-error', 'status-beacon', 'status-inactive');
            
            // Add appropriate class based on state
            if (repeaterStatus.repeaterState === 'REPEATING') {
              repeaterStateIndicator.classList.add('status-active');
            } else if (repeaterStatus.repeaterState === 'LOCKED') {
              repeaterStateIndicator.classList.add('status-error');
            } else if (repeaterStatus.repeaterState === 'RECEIVING') {
              repeaterStateIndicator.classList.add('status-beacon');
            } else {
              repeaterStateIndicator.classList.add('status-standby');
            }
          }
        }
        
        // Update beacon countdown timer with real-time data
        if (wsData.beaconCountdownFormatted !== undefined) {
          console.log('Attempting to update countdown timer with:', wsData.beaconCountdownFormatted);
          
          // Make sure we're using the global window object explicitly
          try {
            if (typeof window.updateHeaderCountdown === 'function') {
              // Call the global function with the countdown data
              window.updateHeaderCountdown(
                wsData.beaconCountdownFormatted,
                wsData.repeaterState === 'BEACON'
              );
            } else {
              console.error('updateHeaderCountdown function not found in window');
            }
          } catch (error) {
            console.error('Error calling updateHeaderCountdown:', error);
          }
        } else {
          console.warn('No beaconCountdownFormatted in WebSocket data');
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
        console.error('Raw data that caused error:', event.data);
      }
    };
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    
    // Set up reconnect interval if not already set
    if (!wsReconnectInterval) {
      wsReconnectInterval = setInterval(function() {
        console.log('Attempting to reconnect WebSocket...');
        initWebSocket();
      }, 5000); // Try to reconnect every 5 seconds
    }
  }
}
