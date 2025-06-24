
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Check } from 'lucide-react';

export const LanguageToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = [
    { id: 'english', name: 'English', flag: '🇬🇧', greeting: 'Hello!' },
    { id: 'yoruba', name: 'Yoruba', flag: '🇳🇬', greeting: 'Bawo!' },
    { id: 'hausa', name: 'Hausa', flag: '🇳🇬', greeting: 'Sannu!' },
    { id: 'igbo', name: 'Igbo', flag: '🇳🇬', greeting: 'Ndewo!' },
    { id: 'pidgin', name: 'Pidgin', flag: '🇳🇬', greeting: 'How far!' },
  ];

  const currentLanguage = languages.find(lang => lang.id === selectedLanguage);

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    setIsOpen(false);
    console.log(`Language changed to: ${languageId}`);
    // Language change logic will be implemented here
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-green-500 to-red-500 hover:from-green-600 hover:to-red-600 text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        <Globe className="w-4 h-4 animate-spin-slow" />
        <span className="hidden md:inline">{currentLanguage?.flag}</span>
        <span className="hidden lg:inline">{currentLanguage?.name}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Language Menu */}
          <Card className="absolute top-full right-0 mt-2 w-64 z-50 shadow-2xl border-2 border-gradient-to-r from-green-200 to-red-200 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Choose Your Language</h3>
                <p className="text-sm text-gray-600">Select your preferred language</p>
              </div>
              
              <div className="space-y-2">
                {languages.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                      selectedLanguage === language.id
                        ? 'bg-gradient-to-r from-green-100 to-red-100 border-2 border-green-300 shadow-lg'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-2xl">{language.flag}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-800">{language.name}</div>
                      <div className="text-sm text-gray-600">{language.greeting}</div>
                    </div>
                    {selectedLanguage === language.id && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  More languages coming soon! 🌍
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
