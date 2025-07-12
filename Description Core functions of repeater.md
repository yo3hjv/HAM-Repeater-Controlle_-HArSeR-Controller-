### Beacon timer resetting only on automatic transmission not on manual send!
## For Pre release candidate R.2.0.0.


## THE COMPLETE SIGNAL FLOW - SIGNAL DETECTION AND REPEATER OPERATION SEQUENCE

### Initial Signal Detection
When a signal is detected on the input (either through RSSI measurement or logic input), the repeater begins monitoring the signal.

### Anti-Kerchunking Period
The repeater waits for the "Anti-Kerchunking Time" to ensure the signal is legitimate and not just a brief noise spike or accidental key-up.
If the signal disappears during this period, the process resets and no repeater activation occurs.

### Repeater Activation
After the Anti-Kerchunking Time elapses with continuous signal presence, the repeater activates its transmitter.
The PTT (Push-To-Talk) output is activated, and the repeater begins retransmitting the input signal.

### Signal Loss Detection
When the input signal disappears, the repeater doesn't immediately deactivate.
The repeater first waits for the "Hold Time" (Typically A-K Time + 50-75 msec.) to see if the signal quickly returns.
This prevents the repeater from deactivating during very brief pauses in transmission.

### Fragment Time Processing
If the signal remains absent after the Hold Time, the repeater enters the Fragment Time phase.
During the "Fragment Time" (default: 600ms), the repeater continues to monitor for signal return.
If the signal returns during this period, the repeater continues normal operation.
This prevents the repeater from deactivating during normal speech pauses.

### Courtesy Tone Sequence
If no signal returns during the entire Fragment Time, the repeater prepares to deactivate.
The repeater will play the "Courtesy Tone" after a very brief "Courtesy Interval" to indicate the channel is clear for another transmission.

### Tail Time
After the courtesy tone, the repeater enters the "Repeater Tail Time".
The transmitter remains active during this period, allowing users to hear the courtesy tone and providing a brief window for someone to respond.

### Final Deactivation
At the end of the Tail Time, the repeater plays Tail Tone.
The transmitter is then deactivated, and the repeater returns to standby mode.
The system resets and begins monitoring for new input signals.

### Timeout Protection and "Calm-Down"
When a signal is received and the repeater starts transmitting, a Time Out Timer (Repeater TOT) starts.
If a transmission continues beyond Time Out Timer, the timeout protection activates.
The repeater plays Tail Tone and deactivates the transmitter.
The system then waits for the input signal to completely end and a mandatory pause is enforced.
This mandatory pause is defined by the "Minimum Pause After Timeout".
During this pause period, the repeater will not activate even if a new signal is detected.
This prevents the same user from immediately reactivating the repeater after a timeout.

### Beacon Operation
If no activity occurs on the repeater for the "Beacon Interval", the repeater automatically transmits its Callsign followed by Tail Info (both set by user).
The beacon is transmitted at the configured CW speed and tone frequency.
After sending the beacon, the repeater returns to standby mode and continues monitoring for input signals.


This signal flow creates a smooth and reliable repeater operation that handles normal conversation patterns while providing protection against excessive use and meeting identification requirements.

The Beacon can be activated manually from the web page of the repeater controller or by hardware momentary press switch.

###All parameters are user defined in the controller's administration webpage.
