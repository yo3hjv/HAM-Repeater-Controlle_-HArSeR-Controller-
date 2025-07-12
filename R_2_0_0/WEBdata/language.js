/**
 * ESP32 Repeater Controller - Language Support
 * Handles loading and applying language translations
 */

// Default language
let currentLanguage = 'en';

// Store loaded language data
let languageData = {};

// Debug mode - set to true to log missing translations
const debugTranslations = false;

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
  // Try to load saved language preference from localStorage
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
  }
  
  // Load the language file
  loadLanguage(currentLanguage);
  
  // Highlight the current language button
  updateLanguageButtons();
});

// Function to set language
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  loadLanguage(lang);
  updateLanguageButtons();
}

// Function to load language file
function loadLanguage(lang) {
  fetch(`/settings/${lang}.ini`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Language file not found');
      }
      return response.text();
    })
    .then(data => {
      // Parse INI format
      languageData = parseIniData(data);
      // Apply translations
      applyTranslations();
      // Check for missing translations if not English and debug mode is on
      if (debugTranslations && lang !== 'en') {
        checkMissingTranslations();
      }
    })
    .catch(error => {
      console.error('Error loading language file:', error);
      // If failed, try to load English as fallback
      if (lang !== 'en') {
        console.log('Falling back to English');
        loadLanguage('en');
      }
    });
}

// Function to parse INI data
function parseIniData(iniContent) {
  const result = {};
  const lines = iniContent.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith(';') || line.trim() === '') {
      continue;
    }
    
    // Check if it's a section header
    const sectionMatch = line.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      result[currentSection] = {};
      continue;
    }
    
    // Parse key-value pairs
    const keyValueMatch = line.match(/^(.+?)=(.*)$/);
    if (keyValueMatch && currentSection) {
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      result[currentSection][key] = value;
    } else if (keyValueMatch) {
      // For keys not in a section
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();
      result[key] = value;
    }
  }
  
  return result;
}

// Function to apply translations to the page
function applyTranslations() {
  // Apply to elements with lang-* classes
  document.querySelectorAll('[class*="lang-"]').forEach(element => {
    // Extract the key from the class name
    const classes = element.className.split(' ');
    for (const cls of classes) {
      if (cls.startsWith('lang-')) {
        const key = cls.substring(5); // Remove 'lang-' prefix
        
        // Look for translation in the UI section first, then navigation, then general
        let translation = '';
        if (languageData.UI && languageData.UI[key]) {
          translation = languageData.UI[key];
        } else if (languageData.navigation && languageData.navigation[key]) {
          translation = languageData.navigation[key];
        } else if (languageData.status && languageData.status[key]) {
          translation = languageData.status[key];
        } else if (languageData[key]) {
          translation = languageData[key];
        }
        
        // Apply translation if found
        if (translation) {
          element.textContent = translation;
        }
      }
    }
  });
  
  // Apply to elements with data-lang attribute
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    
    // Look for translation in the UI section first, then navigation, then status, then general
    let translation = '';
    if (languageData.UI && languageData.UI[key]) {
      translation = languageData.UI[key];
    } else if (languageData.navigation && languageData.navigation[key]) {
      translation = languageData.navigation[key];
    } else if (languageData.status && languageData.status[key]) {
      translation = languageData.status[key];
    } else if (languageData[key]) {
      translation = languageData[key];
    }
    
    // Apply translation if found
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Apply to elements with data-lang-placeholder attribute (for inputs)
  document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
    const key = element.getAttribute('data-lang-placeholder');
    
    // Check if we have a translation for this key
    let translation = '';
    for (const section in languageData) {
      if (languageData[section][key]) {
        translation = languageData[section][key];
        break;
      }
    }
    
    // Apply translation if found
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Apply to title tags
  if (languageData.UI && languageData.UI.pageTitle) {
    document.title = languageData.UI.pageTitle;
  }
  
  // Replace special placeholders
  document.querySelectorAll('.lang-callsign').forEach(element => {
    if (languageData.System && languageData.System.callsign) {
      element.textContent = languageData.System.callsign;
    }
  });
}

// Update language button highlighting
function updateLanguageButtons() {
  document.querySelectorAll('.language-btn').forEach(button => {
    // Remove active class from all buttons
    button.classList.remove('active');
    
    // Add active class to current language button
    const lang = button.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (lang === currentLanguage) {
      button.classList.add('active');
    }
  });
}

// Function to translate a specific text key
// Can be used in JavaScript for dynamic content
function translateText(key, defaultText = '') {
  // Look for translation in all sections
  let translation = '';
  if (languageData.UI && languageData.UI[key]) {
    translation = languageData.UI[key];
  } else if (languageData.navigation && languageData.navigation[key]) {
    translation = languageData.navigation[key];
  } else if (languageData.status && languageData.status[key]) {
    translation = languageData.status[key];
  } else if (languageData[key]) {
    translation = languageData[key];
  }
  
  // Return translation if found, otherwise return default text
  return translation || defaultText;
}

// Function to check for missing translations compared to English
function checkMissingTranslations() {
  // Skip if current language is English
  if (currentLanguage === 'en') return;
  
  // Fetch English as reference
  fetch(`/settings/en.ini`)
    .then(response => {
      if (!response.ok) {
        throw new Error('English language file not found');
      }
      return response.text();
    })
    .then(data => {
      // Parse English INI data
      const englishData = parseIniData(data);
      const missingKeys = [];
      
      // Compare sections and keys
      for (const section in englishData) {
        if (typeof englishData[section] === 'object') {
          // Check if section exists
          if (!languageData[section]) {
            console.warn(`Missing section in ${currentLanguage}: ${section}`);
            continue;
          }
          
          // Check keys in section
          for (const key in englishData[section]) {
            if (!languageData[section][key]) {
              missingKeys.push(`${section}.${key}`);
            }
          }
        } else if (!languageData[section]) {
          // Check top-level keys
          missingKeys.push(section);
        }
      }
      
      // Log missing keys if any
      if (missingKeys.length > 0) {
        console.warn(`Missing translations in ${currentLanguage}:`, missingKeys);
      }
    })
    .catch(error => {
      console.error('Error checking missing translations:', error);
    });
}
