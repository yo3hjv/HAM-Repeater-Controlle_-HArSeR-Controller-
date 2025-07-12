# HAM Smart Repeater Controller

## Overview

ESP32-based intelligent repeater controller for amateur radio applications with multilingual web interface support.

## Installation Instructions

### Required Tools

- [ESP32 Flash Download Tool](https://www.espressif.com/en/support/download/other-tools) from Espressif
- Download the content of R_2.0.0 as zip or file by file, with the same structure
- Flash the Firmware (see below).

### Firmware Files

Flash/Upload the following binary files to the specified addresses:

| File | Address | Description |
|------|---------|-------------|
| `HRSC_r2.0.0.bootloader` | `0x1000` | Bootloader |
| `HRSC_r2.0.0.partitions` | `0x8000` | Partition table |
| `HRSC_r2.0.0.bin` | `0x10000` | Main application |

### Flash Settings

Configure the ESP32 Flash Download Tool with these settings:

- **SPI Speed**: 80 MHz
- **SPI Mode**: DIO
- **DNotChgBin**: Checked
- **COM Port**: Select your ESP32 device
- **Baud Rate**: 921600

### After Installation

1. The device will create a WiFi access point named "ESP32 Repeater"
2. Connect to this network and navigate to `192.168.4.1` in your browser
3. Configure your WiFi settings through the web interface
4. After connecting to your network, access the repeater controller at `http://repeater.local`

## Features

- RSSI or digital carrier detection modes
- Configurable anti-kerchunking and timeout timers
- Customizable courtesy and tail tones
- CW beacon with configurable messages
- Mobile-friendly responsive design
- Comprehensive settings for repeater operation
- Multilingual web interface (English, Romanian, Russian, Italian, German) **(UNDER DEVELOPMENT)**

## Documentation

See the `MD files` directory for detailed documentation:
- `Settings.md` - Comprehensive explanation of all repeater settings
- Additional documentation files

## License

Copyright © Adrian YO3HJV
