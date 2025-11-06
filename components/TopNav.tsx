import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sparkles, Moon, Sun, User, Settings, LogOut, Plus } from 'lucide-react';

interface TopNavProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewProject?: () => void;
  onGoHome?: () => void;
}

export function TopNav({ darkMode, onToggleDarkMode, onNewProject, onGoHome }: TopNavProps) {
  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-50" style={{ boxShadow: 'var(--elevation-sm)' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Go to home page"
        >
          <svg className="h-10 w-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#001C56"/>
            <path d="M31.9999 57.92C46.3359 57.92 57.9199 46.336 57.9199 32C57.9199 17.664 46.3359 6.07998 31.9999 6.07998C17.6639 6.07998 6.07993 17.664 6.07993 32C6.07992 46.336 17.6639 57.92 31.9999 57.92ZM31.9999 8.19198C45.1839 8.19198 55.8079 18.88 55.8079 32C55.8079 45.12 45.1839 55.808 31.9999 55.808C18.8159 55.808 8.19193 45.184 8.19193 32C8.19193 18.816 18.8159 8.19198 31.9999 8.19198Z" fill="white" fillOpacity="0.48"/>
            <path d="M32.0001 6.08002C17.6641 6.08002 6.08008 17.664 6.08008 32C6.08008 46.336 17.6641 57.92 32.0001 57.92C46.3361 57.92 57.9201 46.336 57.9201 32C57.9201 17.664 46.3361 6.08002 32.0001 6.08002ZM32.0001 55.808C18.8161 55.808 8.19208 45.12 8.19208 32C8.19208 18.88 18.8161 8.19202 32.0001 8.19202C45.1841 8.19202 55.8081 18.816 55.8081 32C55.8081 45.184 45.1841 55.808 32.0001 55.808Z" fill="white" fillOpacity="0.48"/>
            <path d="M21.248 32L24.192 31.168C27.52 30.208 30.144 27.584 31.104 24.256L31.936 21.312L32.768 24.256C33.728 27.584 36.352 30.208 39.68 31.168L42.624 32L39.68 32.832C36.48 33.856 33.856 36.48 32.832 39.808L32 42.752L31.168 39.808C30.144 36.48 27.52 33.856 24.192 32.832L21.248 32Z" fill="white"/>
            <g filter="url(#filter0_f_12458_194518)">
              <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint0_linear_12458_194518)"/>
            </g>
            <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint1_linear_12458_194518)"/>
            <g filter="url(#filter1_f_12458_194518)">
              <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint2_linear_12458_194518)"/>
            </g>
            <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint3_linear_12458_194518)"/>
            <defs>
              <filter id="filter0_f_12458_194518" x="9.87988" y="4.76001" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_12458_194518"/>
              </filter>
              <filter id="filter1_f_12458_194518" x="8.46387" y="43.1794" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_12458_194518"/>
              </filter>
              <linearGradient id="paint0_linear_12458_194518" x1="10.8232" y1="5.72879" x2="46.1092" y2="-10.3627" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#00BDFF"/>
              </linearGradient>
              <linearGradient id="paint1_linear_12458_194518" x1="51.5199" y1="14.4" x2="15.1596" y2="31.7874" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#00BDFF"/>
              </linearGradient>
              <linearGradient id="paint2_linear_12458_194518" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#00BDFF"/>
              </linearGradient>
              <linearGradient id="paint3_linear_12458_194518" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#00BDFF"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <h1 className="text-foreground font-bold">Journey 360</h1>
            <p className="text-muted-foreground text-sm">Auto-Build Deployable Journeys</p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* New Project Button */}
          {onNewProject && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNewProject}
              className="border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Button>
          )}
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="rounded-[var(--radius-button)] hover:bg-secondary"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-[var(--radius)]">
              <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground rounded-[var(--radius-sm)] focus:bg-secondary cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground rounded-[var(--radius-sm)] focus:bg-secondary cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-destructive rounded-[var(--radius-sm)] focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
