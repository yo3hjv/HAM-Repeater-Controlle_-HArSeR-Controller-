#ifndef INI_PARSER_H
#define INI_PARSER_H

#include <SPIFFS.h>

// Forward declaration of the applySetting function
void applySetting(const String& key, const String& value);

// Function to parse and apply settings from an .ini file
bool applySettingsFromIni(const String& filename) {
  // Make sure the file exists
  if (!SPIFFS.exists(filename)) {
    Serial.println("File not found: " + filename);
    return false;
  }
  
  // Check if this is the correct callsign file
  extern String Callsign;
  bool isCorrectCallsignFile = false;
  String filenameOnly = filename.substring(filename.lastIndexOf('/') + 1);
  
  // Remove .tmp extension if present for pattern matching
  if (filenameOnly.endsWith(".tmp")) {
    filenameOnly = filenameOnly.substring(0, filenameOnly.length() - 4);
    Serial.println("Removed .tmp extension for pattern matching: " + filenameOnly);
  }
  
  // Accept the default callsign file with simplified format
  if (filenameOnly == "YO3HJV.ini") {
    isCorrectCallsignFile = true;
    Serial.println("Using default callsign file: YO3HJV.ini");
  } 
  // Accept the legacy default filename
  else if (filenameOnly == "ESP32_Repeater.ini") {
    isCorrectCallsignFile = true;
    Serial.println("Using legacy default filename: ESP32_Repeater.ini");
  } 
  // Check if the filename matches the current callsign pattern
  else if (Callsign.length() > 0) {
    String sanitizedCallsign = Callsign;
    sanitizedCallsign.replace("/", "_");
    sanitizedCallsign.replace("\\", "_");
    sanitizedCallsign.replace(":", "_");
    sanitizedCallsign.replace("*", "_");
    sanitizedCallsign.replace("?", "_");
    sanitizedCallsign.replace("\"", "_");
    sanitizedCallsign.replace("<", "_");
    sanitizedCallsign.replace(">", "_");
    sanitizedCallsign.replace("|", "_");
    String simplifiedPattern = sanitizedCallsign + ".ini";
    
    if (filenameOnly == simplifiedPattern) {
      isCorrectCallsignFile = true;
      Serial.println("Using callsign-specific file: " + filenameOnly);
    }
  }
  
  // If this is not the correct callsign file, show a warning and don't load settings
  if (!isCorrectCallsignFile) {
    // Check if we have a callsign set and the file is one of the default files
    if (Callsign.length() > 0 && (filenameOnly == "YO3HJV_ESP_Repeater.ini" || filenameOnly == "ESP32_Repeater.ini")) {
      // If callsign is set, we should only use the callsign-specific file
      String sanitizedCallsign = Callsign;
      sanitizedCallsign.replace("/", "_");
      sanitizedCallsign.replace("\\", "_");
      sanitizedCallsign.replace(":", "_");
      sanitizedCallsign.replace("*", "_");
      sanitizedCallsign.replace("?", "_");
      sanitizedCallsign.replace("\"", "_");
      sanitizedCallsign.replace("<", "_");
      sanitizedCallsign.replace(">", "_");
      sanitizedCallsign.replace("|", "_");
      String simplifiedPattern = sanitizedCallsign + ".ini";
      
      Serial.println("ERROR: Wrong file name. Callsign is set to " + Callsign + ", expected file: " + simplifiedPattern);
      return false;
    }
    
    Serial.println("WARNING: File does not match expected format: " + filenameOnly);
    return false;
  }
  
  // Open the file
  File file = SPIFFS.open(filename, "r");
  if (!file) {
    Serial.println("Failed to open file: " + filename);
    return false;
  }
  
  Serial.println("Applying settings from: " + filename);
  
  // Read the file line by line
  while (file.available()) {
    String line = file.readStringUntil('\n');
    line.trim();
    
    // Skip empty lines and comments
    if (line.length() == 0 || line.startsWith(";") || line.startsWith("#")) {
      continue;
    }
    
    // Look for key=value pairs
    int separatorPos = line.indexOf('=');
    if (separatorPos > 0) {
      String key = line.substring(0, separatorPos);
      String value = line.substring(separatorPos + 1);
      key.trim();
      value.trim();
      
      // Apply the setting based on the key
      applySetting(key, value);
    }
  }
  
  file.close();
  return true;
}

// Function to apply a specific setting
void applySetting(const String& key, const String& value) {
  Serial.println("Setting " + key + " = " + value);
  
  // Handle different settings in the same order as handleDownloadSettings()
  // General settings
  if (key == "Callsign") {
    extern String Callsign;
    Callsign = value;
  }
  else if (key == "userLockActive" || key == "UserLockActive") {
    extern bool userLockActive;
    userLockActive = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "useRssiMode" || key == "UseRssiMode") {
    extern bool useRssiMode;
    useRssiMode = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "CarrierActiveHigh") {
    extern bool CarrierActiveHigh;
    CarrierActiveHigh = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "PttActiveHigh") {
    extern bool PttActiveHigh;
    PttActiveHigh = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "RssiHthresh") {
    extern int RssiHthresh;
    RssiHthresh = value.toInt();
  }
  else if (key == "RssiLthresh") {
    extern int RssiLthresh;
    RssiLthresh = value.toInt();
  }
  else if (key == "RssiReadings") {
    extern int RssiReadings;
    RssiReadings = value.toInt();
  }
  else if (key == "AKtime") {
    extern int AKtime;
    AKtime = value.toInt();
  }
  else if (key == "HoldTime") {
    extern int HoldTime;
    HoldTime = value.toInt();
  }
  else if (key == "fragTime" || key == "FragmentTime") {
    extern int fragTime;
    fragTime = value.toInt();
  }
  else if (key == "ToTime" || key == "TimeOut") {
    extern int ToTime;
    ToTime = value.toInt();
  }
  else if (key == "RepeaterTailTime" || key == "TailTime") {
    extern int RepeaterTailTime;
    RepeaterTailTime = value.toInt();
  }
  else if (key == "calmDownTime" || key == "MinimumPauseTimer") {
    extern int calmDownTime;
    calmDownTime = value.toInt();
  }
  else if (key == "CourtesyEnable") {
    extern bool CourtesyEnable;
    CourtesyEnable = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "CourtesyInterval") {
    extern int CourtesyInterval;
    CourtesyInterval = value.toInt();
  }
  else if (key == "CourtesyToneFreq") {
    extern int CourtesyToneFreq;
    CourtesyToneFreq = value.toInt();
  }
  else if (key == "CourtesyToneDur") {
    extern int CourtesyToneDur;
    CourtesyToneDur = value.toInt();
  }
  else if (key == "PreTimeCourtesy") {
    extern int PreTimeCourtesy;
    PreTimeCourtesy = value.toInt();
  }
  else if (key == "TailToneEnable") {
    extern bool TailToneEnable;
    TailToneEnable = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "PreTimeTail") {
    extern int PreTimeTail;
    PreTimeTail = value.toInt();
  }
  else if (key == "TailToneFreq") {
    extern int TailToneFreq;
    TailToneFreq = value.toInt();
  }
  else if (key == "TailToneDur") {
    extern int TailToneDur;
    TailToneDur = value.toInt();
  }
  else if (key == "BeaconEnable") {
    extern bool BeaconEnable;
    BeaconEnable = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "BeacInterval") {
    extern int BeacInterval;
    BeacInterval = value.toInt();
  }
  else if (key == "CWspeed") {
    extern int CWspeed;
    CWspeed = value.toInt();
  }
  else if (key == "CWtone") {
    extern int CWtone;
    CWtone = value.toInt();
  }
  else if (key == "BeaconPin") {
    extern int BeaconPin;
    BeaconPin = value.toInt();
  }
  else if (key == "CourtesyPin") {
    extern int CourtesyPin;
    CourtesyPin = value.toInt();
  }
  else if (key == "TailPin") {
    extern int TailPin;
    TailPin = value.toInt();
  }
  else if (key == "HwBeacPin") {
    extern int HwBeacPin;
    HwBeacPin = value.toInt();
  }
  else if (key == "TxLedPin") {
    extern int TxLedPin;
    TxLedPin = value.toInt();
  }
  else if (key == "LcdI2cAddress") {
    extern int LcdI2cAddress;
    // Handle both decimal and hex format (0x27)
    if (value.startsWith("0x")) {
      char* endPtr;
      LcdI2cAddress = strtol(value.c_str(), &endPtr, 16);
    } else {
      LcdI2cAddress = value.toInt();
    }
  }
  
  // Debug settings
  else if (key == "DebugMain" || key == "debugMain") {
    extern bool debugMain;
    debugMain = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugCarrier" || key == "debugCarrier" || key == "debugCarrDetect") {
    extern bool debugCarrier;
    debugCarrier = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugRSSI" || key == "debugRSSI" || key == "debugRssiDetect") {
    extern bool debugRSSI;
    debugRSSI = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugBeacon" || key == "debugBeacon") {
    extern bool debugBeacon;
    debugBeacon = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugCourtesy" || key == "debugCourtesy") {
    extern bool debugCourtesy;
    debugCourtesy = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugTOT" || key == "debugTOT") {
    extern bool debugTOT;
    debugTOT = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DebugLCD" || key == "debugLCD") {
    extern bool debugLCD;
    debugLCD = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "DEBUG_LEVEL") {
    extern int DEBUG_LEVEL;
    DEBUG_LEVEL = value.toInt();
  }
  
  // Keep support for legacy or additional settings that might be in older .ini files
  else if (key == "BeaconContentActive") {
    extern String BeaconContentActive;
    BeaconContentActive = value;
  }
  else if (key == "BeaconContentLocked") {
    extern String BeaconContentLocked;
    BeaconContentLocked = value;
  }
  else if (key == "BeaconEndActive") {
    extern String BeaconEndActive;
    BeaconEndActive = value;
  }
  else if (key == "BeaconEndLocked") {
    extern String BeaconEndLocked;
    BeaconEndLocked = value;
  }
  else if (key == "BeaconContentActiveEnabled") {
    extern bool BeaconContentActiveEnabled;
    BeaconContentActiveEnabled = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "BeaconContentLockedEnabled") {
    extern bool BeaconContentLockedEnabled;
    BeaconContentLockedEnabled = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "BeaconEndActiveEnabled") {
    extern bool BeaconEndActiveEnabled;
    BeaconEndActiveEnabled = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "BeaconEndLockedEnabled") {
    extern bool BeaconEndLockedEnabled;
    BeaconEndLockedEnabled = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
  else if (key == "TailInfo") {
    extern String TailInfo;
    TailInfo = value;
  }
  else if (key == "lcdEnabled") {
    extern bool lcdEnabled;
    lcdEnabled = (value == "1" || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("yes"));
  }
}

// Function to save current settings to an .ini file
bool saveSettingsToIni(const String& filename) {
  // Open the file for writing
  File file = SPIFFS.open(filename, "w");
  if (!file) {
    Serial.println("Failed to open file for writing: " + filename);
    return false;
  }
  
  Serial.println("Saving settings to: " + filename);
  
  // Declare all variables needed for settings
  // Follow the exact order from handleDownloadSettings()
  extern String Callsign;
  extern bool userLockActive;
  extern bool useRssiMode;
  extern bool CarrierActiveHigh;
  extern bool PttActiveHigh;
  extern int RssiHthresh;
  extern int RssiLthresh;
  extern int RssiReadings;
  extern int AKtime;
  extern int HoldTime;
  extern int fragTime;
  extern int ToTime;
  extern int RepeaterTailTime;
  extern int calmDownTime;
  extern bool CourtesyEnable;
  extern int CourtesyInterval;
  extern int CourtesyToneFreq;
  extern int CourtesyToneDur;
  extern int PreTimeCourtesy;
  extern bool TailToneEnable;
  extern int PreTimeTail;
  extern int TailToneFreq;
  extern int TailToneDur;
  extern bool BeaconEnable;
  extern int BeacInterval;
  extern int CWspeed;
  extern int CWtone;
  extern int BeaconPin;
  extern int CourtesyPin;
  extern int TailPin;
  extern int HwBeacPin;
  extern int TxLedPin;
  extern int LcdI2cAddress;
  
  // Debug settings
  extern bool debugMain;
  extern bool debugCarrier;
  extern bool debugRSSI;
  extern bool debugBeacon;
  extern bool debugCourtesy;
  extern bool debugTOT;
  extern bool debugLCD;
  extern int DEBUG_LEVEL;

  // Follow the exact order from YO3HJV-new.ini template as in handleDownloadSettings()
  file.println("Callsign=" + Callsign);
  file.println("userLockActive=" + String(userLockActive ? "1" : "0"));
  file.println("useRssiMode=" + String(useRssiMode ? "1" : "0"));
  file.println("CarrierActiveHigh=" + String(CarrierActiveHigh ? "1" : "0"));
  file.println("PttActiveHigh=" + String(PttActiveHigh ? "1" : "0"));
  file.println("RssiHthresh=" + String(RssiHthresh));
  file.println("RssiLthresh=" + String(RssiLthresh));
  file.println("RssiReadings=" + String(RssiReadings));
  file.println("AKtime=" + String(AKtime));
  file.println("HoldTime=" + String(HoldTime));
  file.println("fragTime=" + String(fragTime));
  file.println("ToTime=" + String(ToTime));
  file.println("RepeaterTailTime=" + String(RepeaterTailTime));
  file.println("calmDownTime=" + String(calmDownTime));
  file.println("CourtesyEnable=" + String(CourtesyEnable ? "1" : "0"));
  file.println("CourtesyInterval=" + String(CourtesyInterval));
  file.println("CourtesyToneFreq=" + String(CourtesyToneFreq));
  file.println("CourtesyToneDur=" + String(CourtesyToneDur));
  file.println("PreTimeCourtesy=" + String(PreTimeCourtesy));
  file.println("TailToneEnable=" + String(TailToneEnable ? "1" : "0"));
  file.println("PreTimeTail=" + String(PreTimeTail));
  file.println("TailToneFreq=" + String(TailToneFreq));
  file.println("TailToneDur=" + String(TailToneDur));
  file.println("BeaconEnable=" + String(BeaconEnable ? "1" : "0"));
  file.println("BeacInterval=" + String(BeacInterval));
  file.println("CWspeed=" + String(CWspeed));
  file.println("CWtone=" + String(CWtone));
  file.println("BeaconPin=" + String(BeaconPin));
  file.println("CourtesyPin=" + String(CourtesyPin));
  file.println("TailPin=" + String(TailPin));
  file.println("HwBeacPin=" + String(HwBeacPin));
  file.println("TxLedPin=" + String(TxLedPin));
  file.println("LcdI2cAddress=0x" + String(LcdI2cAddress, HEX));
  
  // Add debug settings at the end of the file
  // These correspond to the checkboxes on the /debug page
  file.println("\r\n# Debug Settings");
  file.println("DebugMain=" + String(debugMain ? "1" : "0"));
  file.println("DebugCarrier=" + String(debugCarrier ? "1" : "0"));
  file.println("DebugRSSI=" + String(debugRSSI ? "1" : "0"));
  file.println("DebugBeacon=" + String(debugBeacon ? "1" : "0"));
  file.println("DebugCourtesy=" + String(debugCourtesy ? "1" : "0"));
  file.println("DebugTOT=" + String(debugTOT ? "1" : "0"));
  file.println("DebugLCD=" + String(debugLCD ? "1" : "0"));
  file.println("DEBUG_LEVEL=" + String(DEBUG_LEVEL));
  
  file.close();
  return true;
}

#endif // INI_PARSER_H
