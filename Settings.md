# ESP32 Repeater Controller Settings Guide

This document explains how each setting in the ESP32 Repeater Controller web interface affects the repeater's functionality. Understanding these parameters will help you optimize your repeater's performance for your specific requirements.

## Repeater Lock Control

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Repeater Lock | Enables/disables the repeater lock | When locked, the repeater will not transmit normal signals and will only send the locked beacon message if configured. This is useful for maintenance or emergency situations. |

## Hardware Settings

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Detection Mode | Selects between RSSI and Carrier Detect modes | RSSI mode uses signal strength for detection, while Carrier Detect uses a digital input. Choose based on your receiver's capabilities. |
| Carrier Detect Polarity | Sets whether carrier detect is active high or low | Must match your receiver's output signal polarity. Incorrect setting will prevent proper signal detection. |
| LCD Display | Enables/disables the LCD display | When enabled, status information is shown on a connected I2C LCD display. |
| LCD I2C Address | Sets the I2C address for the LCD | Must match the physical address of your LCD display (typically 0x27 or 0x3F). |
| Beacon Pin | Selects the GPIO pin for the beacon tone | Determines which pin outputs the CW beacon tone. |
| Courtesy Pin | Selects the GPIO pin for the courtesy tone | Determines which pin outputs the courtesy tone. |
| Tail Pin | Selects the GPIO pin for the tail tone | Determines which pin outputs the tail tone at the end of transmission. |

## RSSI Hysteresis

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| RSSI High Threshold | Sets the RSSI level to trigger reception | Higher values require stronger signals to activate the repeater, reducing sensitivity but improving noise rejection. |
| RSSI Hysteresis | Sets the difference between activation and deactivation thresholds | Larger values prevent signal flutter at threshold boundaries by requiring a greater signal drop before deactivation. |
| RSSI Readings | Number of consecutive readings required | Higher values improve stability but increase response time. Helps filter out brief noise spikes. |

## Time Hysteresis

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Anti-Kerchunking Timer | Minimum time (ms) a signal must be present | Prevents brief transmissions ("kerchunks") from activating the repeater. Higher values filter out more short transmissions. |
| Hold Time | Time (ms) to maintain carrier detection after signal drops | Prevents brief signal dropouts from deactivating carrier detection. Part of the input signal validation process. |
| Fragmentation Time | Time (ms) to wait after signal drops before starting courtesy tone | Handles brief interruptions in the incoming signal after the repeater is already active. Prevents the repeater from immediately starting the end-of-transmission sequence when there's a very short gap. |

## Repeater Timeouts

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Hang Time (Tail Time) | Time (seconds) the repeater continues transmitting after signal ends | Controls how long the repeater continues to transmit after the incoming signal has ended and the courtesy tone has played. Gives users time to respond before the repeater shuts down. |
| Time-out Timer | Maximum transmission time (seconds) | Prevents a single user from occupying the repeater indefinitely. When reached, the repeater stops transmitting until the input signal drops. |
| Time-out Penalty | Additional wait time (seconds) after a timeout | Forces users who trigger the timeout to wait before using the repeater again. Discourages excessive long transmissions. |

## Courtesy Tone Settings

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Enable Courtesy Tone | Turns the courtesy tone on/off | When enabled, plays a tone after each transmission to signal that the repeater is ready for the next transmission. |
| Courtesy Tone Frequency | Sets the tone frequency (Hz) | Determines the pitch of the courtesy tone. Typically between 500-2000 Hz. |
| Courtesy Tone Duration | Sets the tone duration (ms) | Determines how long the courtesy tone plays. Longer durations are more noticeable but may be annoying. |
| Pre-Time Courtesy | Delay (ms) before playing courtesy tone | Sets how long to wait after detecting the end of transmission before playing the courtesy tone. |
| Courtesy Interval | Time (ms) between courtesy tones | Controls the spacing between repeated courtesy tones if multiple are configured. |

## Tail Tone Settings

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Enable Tail Tone | Turns the tail tone on/off | When enabled, plays a tone at the end of the repeater's transmission cycle. Signals the end of the repeater's hang time. |
| Tail Tone Frequency | Sets the tone frequency (Hz) | Determines the pitch of the tail tone. Typically between 500-2000 Hz. |
| Tail Tone Duration | Sets the tone duration (ms) | Determines how long the tail tone plays. |
| Pre-Time Tail | Delay (ms) before playing tail tone | Sets how long to wait before playing the tail tone at the end of transmission. |

## Beacon Settings

| Setting | Description | Effect on Repeater |
|---------|-------------|-------------------|
| Callsign | Sets the repeater's callsign | Used in the beacon message and for identification. |
| Beacon Interval | Time (minutes) between beacon transmissions | Controls how frequently the repeater sends its identification beacon. Longer intervals reduce beacon frequency. |
| CW Speed | Sets the Morse code speed (WPM) | Determines how fast the beacon message is sent. Higher values make the beacon shorter but potentially harder to copy. |
| CW Tone | Sets the Morse code tone frequency (Hz) | Determines the pitch of the beacon tone. Typically between 500-1000 Hz. |
| Beacon Delay Dots | Number of dots to delay between callsign and end message | Controls the spacing between the callsign and the end message in the beacon. |
| Beacon End Message (Active) | Message sent after callsign when repeater is active | Customizes the second part of the beacon when the repeater is operating normally. |
| Beacon End Message (Locked) | Message sent after callsign when repeater is locked | Customizes the second part of the beacon when the repeater is in locked mode. |

## Understanding Timing Parameters

### Signal Detection and Validation
1. **Input Signal** → **RSSI/Carrier Detection** → **Hold Time** → **Anti-Kerchunking Timer**
   - Signal must exceed RSSI threshold or trigger carrier detect
   - Signal must remain present for Anti-Kerchunking Timer duration
   - Brief dropouts shorter than Hold Time are ignored

### During Active Transmission
1. **Repeater Active** → **Signal Drops** → **Fragmentation Time** → **Courtesy Tone** → **Hang Time** → **Tail Tone**
   - If signal returns within Fragmentation Time, transmission continues uninterrupted
   - If signal doesn't return, courtesy tone plays after Pre-Time Courtesy delay
   - Repeater continues transmitting for Hang Time duration
   - Tail tone plays at the end of Hang Time
   - Repeater stops transmitting

### Timeout Sequence
1. **Continuous Transmission** → **Time-out Timer Reached** → **Repeater Stops** → **Time-out Penalty**
   - If transmission exceeds Time-out Timer duration, repeater stops transmitting
   - User must stop transmitting to reset the timeout
   - After user stops, Time-out Penalty period begins
   - Repeater won't respond to that user until penalty period ends

## Best Practices

1. **Anti-Kerchunking Timer**: Set between 100-500ms. Lower values are more responsive but may allow unintentional activations.
2. **Hold Time**: Typically 100-200ms. Should be shorter than Fragmentation Time.
3. **Fragmentation Time**: Usually 200-500ms. Should be longer than Hold Time but short enough to not delay the courtesy tone noticeably.
4. **Hang Time**: 2-5 seconds is common. Longer times give more opportunity for break-in but keep the repeater transmitting longer.
5. **Time-out Timer**: 3-5 minutes is standard. Adjust based on your community's typical conversation patterns.
6. **RSSI Settings**: Start with conservative values and adjust based on real-world performance and noise conditions.

## Troubleshooting Common Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Repeater doesn't activate | RSSI threshold too high or incorrect carrier detect polarity | Lower RSSI threshold or change polarity setting |
| Repeater cuts out during transmission | Hold Time or Fragmentation Time too short | Increase these values to bridge normal signal variations |
| Courtesy tone plays too early | Fragmentation Time too short | Increase Fragmentation Time |
| Repeater stays on too long | Hang Time too long | Decrease Hang Time |
| Users complain about timeouts | Time-out Timer too short | Increase Time-out Timer duration |
| Beacon is hard to copy | CW Speed too fast or tone frequency inappropriate | Adjust CW Speed and Tone frequency |
