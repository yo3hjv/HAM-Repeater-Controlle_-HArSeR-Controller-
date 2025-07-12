/**
 * ESP32 Repeater Controller - Header Information
 * Handles fetching and displaying dynamic system information in the header
 */

// WebSocket connection for real-time updates
let headerWs = null;
let headerWsConnected = false;
let headerWsReconnectInterval = null;

// Store last values to detect changes
let lastCountdownValue = '';
let pulseActive = false;

// Global variable to make the function accessible from anywhere
window.updateHeaderCountdown = function(formattedTime, isBeaconActive) {
  console.log('updateHeaderCountdown called with:', formattedTime, isBeaconActive);
  
  // Use setTimeout to ensure DOM is ready
  setTimeout(function() {
    const countdownValue = document.getElementById('countdown-value');
    const beaconCountdown = document.getElementById('beacon-countdown');
    
    console.log('Elements found:', !!countdownValue, !!beaconCountdown);
    
    if (countdownValue && beaconCountdown) {
      // Update the countdown text
      countdownValue.textContent = formattedTime || '--:--';
      
      // Show/hide based on whether there's a countdown
      if (formattedTime && formattedTime !== '--:--') {
        beaconCountdown.style.display = 'block';
        
        // Highlight during active beacon
        if (isBeaconActive) {
          beaconCountdown.style.backgroundColor = 'rgba(255, 193, 7, 0.7)';
        } else {
          beaconCountdown.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        }
        
        // Add a visual pulse when WebSocket data is received, even if the formatted time hasn't changed
        if (formattedTime === lastCountdownValue) {
          // Same value as before, but we still want to show it's updating
          if (!pulseActive) {
            pulseActive = true;
            countdownValue.style.opacity = '0.5';
            setTimeout(function() {
              countdownValue.style.opacity = '1';
              pulseActive = false;
            }, 200); // Pulse duration in milliseconds
          }
        } else {
          // Value has changed, update the stored value
          lastCountdownValue = formattedTime;
          countdownValue.style.opacity = '1';
        }
      } else {
        beaconCountdown.style.display = 'none';
      }
    } else {
      console.error('Countdown elements not found in the DOM');
    }
  }, 0);
};

// Store system information
let systemInfo = {
  callsign: '',
  version: '',
  status: '',
  statusClass: ''
};

// Initialize WebSocket connection for real-time updates
function initHeaderWebSocket() {
  // Close any existing connection
  if (headerWs) {
    headerWs.close();
  }
  
  // Clear any existing reconnect interval
  if (headerWsReconnectInterval) {
    clearInterval(headerWsReconnectInterval);
    headerWsReconnectInterval = null;
  }
  
  // Determine WebSocket URL (use current hostname with WebSocket port 81)
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const wsUrl = protocol + window.location.hostname + ':81';
  
  console.log('Header: Connecting to WebSocket server at:', wsUrl);
  
  try {
    headerWs = new WebSocket(wsUrl);
    
    headerWs.onopen = function() {
      console.log('Header: WebSocket connection established');
      headerWsConnected = true;
      
      // Add a small indicator to show WebSocket is connected
      let wsIndicator = document.getElementById('header-ws-indicator');
      if (!wsIndicator) {
        wsIndicator = document.createElement('div');
        wsIndicator.id = 'header-ws-indicator';
        wsIndicator.style.position = 'fixed';
        wsIndicator.style.bottom = '10px';
        wsIndicator.style.left = '10px';
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
    
    headerWs.onclose = function() {
      console.log('Header: WebSocket connection closed');
      headerWsConnected = false;
      
      // Update indicator to show disconnected state
      const wsIndicator = document.getElementById('header-ws-indicator');
      if (wsIndicator) {
        wsIndicator.style.backgroundColor = '#F44336';
        wsIndicator.title = 'WebSocket Disconnected - Reconnecting...';
      }
      
      // Set up reconnect interval if not already set
      if (!headerWsReconnectInterval) {
        headerWsReconnectInterval = setInterval(function() {
          console.log('Header: Attempting to reconnect WebSocket...');
          initHeaderWebSocket();
        }, 5000); // Try to reconnect every 5 seconds
      }
    };
    
    headerWs.onerror = function(error) {
      console.error('Header: WebSocket error:', error);
      // The onclose handler will be called after this
    };
    
    headerWs.onmessage = function(event) {
      console.log('Header: WebSocket message received:', event.data);
      
      try {
        // Parse the JSON data
        const wsData = JSON.parse(event.data);
        
        // Update beacon countdown timer with real-time data
        if (wsData.beaconCountdownFormatted !== undefined) {
          console.log('Header: Attempting to update countdown timer with:', wsData.beaconCountdownFormatted);
          
          // Call the updateHeaderCountdown function with the countdown data
          window.updateHeaderCountdown(
            wsData.beaconCountdownFormatted,
            wsData.repeaterState === 'BEACON'
          );
        }
      } catch (error) {
        console.error('Header: Error parsing WebSocket data:', error);
        console.error('Raw data that caused error:', event.data);
      }
    };
  } catch (error) {
    console.error('Header: Error creating WebSocket connection:', error);
    
    // Set up reconnect interval if not already set
    if (!headerWsReconnectInterval) {
      headerWsReconnectInterval = setInterval(function() {
        console.log('Header: Attempting to reconnect WebSocket...');
        initHeaderWebSocket();
      }, 5000); // Try to reconnect every 5 seconds
    }
  }
}

// Initialize system info when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fetch system information
  fetchSystemInfo();
  
  // Set up periodic refresh in milliseconds (default:500 msec)
  setInterval(fetchSystemInfo, 5000);
  
  // Initialize WebSocket connection for real-time updates
  initHeaderWebSocket();
});

// Function to fetch system information from the server
function fetchSystemInfo() {
  fetch('/api/system-info')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch system info');
      }
      return response.json();
    })
    .then(data => {
      // Store the data
      systemInfo = data;
      
      // Update the header elements
      updateHeaderInfo();
    })
    .catch(error => {
      console.error('Error fetching system info:', error);
      
      // If we can't get data from API, try to use default values
      // from language file for callsign
      updateHeaderWithDefaults();
    });
}

// Update header with system information
function updateHeaderInfo() {
  // Update callsign
  const callsignElements = document.querySelectorAll('.lang-callsign');
  callsignElements.forEach(element => {
    element.textContent = systemInfo.callsign || 'YO3HJV';
  });
  
  // Update version
  const versionElements = document.querySelectorAll('.version-display');
  versionElements.forEach(element => {
    element.textContent = systemInfo.version || '2.0.0';
  });
  
  // Update status if available
  if (systemInfo.status && systemInfo.statusClass) {
    const statusRibbon = document.querySelector('.status-ribbon');
    if (statusRibbon) {
      statusRibbon.className = `status-ribbon ${systemInfo.statusClass}`;
      
      const statusText = statusRibbon.querySelector('.lang-status');
      if (statusText) {
        statusText.textContent = systemInfo.status;
      }
    }
  }
}

// Fallback function when API is not available
function updateHeaderWithDefaults() {
  // For callsign, try to use the value from language file
  const callsignElements = document.querySelectorAll('.lang-callsign');
  callsignElements.forEach(element => {
    // If language.js has already set this, don't override
    if (element.textContent === '{CALLSIGN}') {
      element.textContent = 'YO3HJV';
    }
  });
  
  // For version, use a default
  const versionElements = document.querySelectorAll('.version-display');
  versionElements.forEach(element => {
    element.textContent = '2.0.0';
  });
}
