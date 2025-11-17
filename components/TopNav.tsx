import React, { useState } from 'react';
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
import { Sparkles, Moon, Sun, User, Settings, LogOut, Plus, Rocket, ChevronDown, Download, Eye, Code2, Workflow, Camera, FileCode } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
import { ProfileDialog } from './ProfileDialog';

interface TopNavProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewProject?: () => void;
  onGoHome?: () => void;
  showEditorControls?: boolean;
  mainView?: 'preview' | 'code' | 'flow';
  onViewChange?: (view: 'preview' | 'code' | 'flow') => void;
  onDeploy?: () => void;
  onDownloadForm?: () => void;
  onDownloadScreenshots?: () => void;
  onLogout?: () => void;
}

export function TopNav({ 
  darkMode, 
  onToggleDarkMode, 
  onNewProject, 
  onGoHome,
  showEditorControls = false,
  mainView = 'preview',
  onViewChange,
  onDeploy,
  onDownloadForm,
  onDownloadScreenshots,
  onLogout,
}: TopNavProps) {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  return (
    <header className="h-12 border-b border-border bg-background sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div 
          className="flex items-center gap-2 shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 412 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M88.25 5.27319C95.982 5.27319 102.25 11.5412 102.25 19.2732C102.25 27.0052 95.982 33.2732 88.25 33.2732C86.9125 33.2732 85.5894 33.3128 84.2822 33.3904C76.5639 33.8487 69.9349 27.9633 69.4766 20.2449C69.0184 12.5266 74.9039 5.89862 82.6221 5.44019C84.4808 5.32981 86.3577 5.2732 88.25 5.27319Z" fill="#AEDDF9"/>
            <path d="M90.2004 5.27319C117.782 5.27331 140.196 17.0467 158.237 30.7839C164.388 35.4682 165.578 44.2525 160.894 50.4041C156.21 56.5556 147.425 57.7445 141.274 53.0603C125.861 41.3238 109.328 33.2733 90.2004 33.2732C87.4766 33.2732 84.7981 33.4484 82.177 33.7869C74.5087 34.777 67.4894 29.3634 66.4993 21.6951C65.5091 14.0268 70.9228 7.00755 78.5911 6.01733C82.3979 5.52578 86.2743 5.27319 90.2004 5.27319Z" fill="#0CA8AC"/>
            <path d="M89.4187 18.0819C90.6548 10.4495 97.8448 5.26396 105.477 6.49986C140.709 12.205 167.073 36.8618 186.251 55.6864L189.991 59.3661L190.146 59.5223H190.147L190.148 59.5243L190.181 59.5575C190.204 59.5807 190.238 59.6155 190.283 59.661C190.373 59.7527 190.507 59.8895 190.682 60.0672C191.032 60.4227 191.547 60.9439 192.202 61.6092C193.512 62.9401 195.389 64.8458 197.651 67.1434C202.177 71.739 208.248 77.9041 214.431 84.1825C219.857 89.6916 219.788 98.556 214.279 103.981C208.77 109.406 199.906 109.339 194.481 103.83C188.298 97.5513 182.226 91.3856 177.701 86.7899C175.438 84.4921 173.561 82.5867 172.251 81.2557C171.596 80.5904 171.082 80.0682 170.732 79.7127C170.557 79.5352 170.423 79.3992 170.333 79.3075C170.318 79.292 170.303 79.2774 170.291 79.2645C149.616 58.9209 128.299 38.5608 101.001 34.1405C93.3684 32.9044 88.1828 25.7143 89.4187 18.0819Z" fill="#66F0E0"/>
            <path d="M201.637 91.1445C207.146 85.7192 216.009 85.787 221.435 91.2958C226.817 96.7615 231.859 101.881 235.555 105.634C237.402 107.51 238.914 109.045 239.964 110.111C240.488 110.644 240.898 111.059 241.176 111.342C241.315 111.483 241.421 111.59 241.492 111.663C241.501 111.672 241.51 111.681 241.519 111.689C264.971 134.767 289.179 157.671 321.599 157.671C355.883 157.671 383.798 129.757 383.798 95.4726C383.798 82.2695 380.299 70.5165 374.377 60.9296C370.313 54.3517 372.351 45.7249 378.929 41.6611C385.507 37.5973 394.133 39.6351 398.197 46.2128C406.945 60.3719 411.798 77.2499 411.798 95.4726C411.798 145.22 371.348 185.671 321.599 185.671C275.873 185.671 243.67 153.091 221.806 131.575L221.622 131.392C221.604 131.373 221.577 131.346 221.541 131.31C221.47 131.237 221.364 131.128 221.225 130.987C220.947 130.705 220.537 130.289 220.013 129.757C218.963 128.691 217.452 127.156 215.604 125.28C211.909 121.527 206.868 116.408 201.485 110.942C196.06 105.433 196.128 96.5698 201.637 91.1445Z" fill="url(#paint0_linear_1079_37)"/>
            <path d="M383.818 95.4967C383.818 60.9187 359.92 35.5561 327.974 33.442C320.259 32.9312 314.419 26.2624 314.929 18.5474C315.44 10.8325 322.109 4.99194 329.824 5.50252C377.178 8.63651 411.818 46.8787 411.818 95.4967C411.818 112.603 407.022 128.644 398.704 142.3C394.682 148.904 386.068 150.996 379.464 146.974C372.861 142.952 370.768 134.337 374.791 127.734C380.518 118.33 383.818 107.308 383.818 95.4967Z" fill="url(#paint1_linear_1079_37)"/>
            <path d="M295.054 22.2176C293.905 14.5716 299.172 7.44162 306.818 6.29325C314.431 5.15005 321.964 4.97303 329.294 5.70976C336.987 6.48324 342.597 13.3469 341.824 21.0399C341.051 28.7328 334.188 34.3423 326.495 33.569C321.518 33.0687 316.323 33.1807 310.979 33.9831C303.333 35.1314 296.203 29.8636 295.054 22.2176Z" fill="#66F0E0"/>
            <path d="M221.651 59.5218C227.077 54.0126 235.941 53.9452 241.45 59.3704C246.959 64.7955 247.027 73.6591 241.603 79.1683L190.148 131.419C190.097 131.471 190.045 131.523 189.993 131.575C168.129 153.09 135.925 185.671 90.1992 185.671C40.4501 185.671 0 145.22 0 95.472C0.000126263 50.9092 29.1078 14.9272 70.7588 6.9202C78.3517 5.46056 85.6907 10.4327 87.1504 18.0257C88.6098 25.6185 83.6377 32.9567 76.0449 34.4163C48.2402 39.7614 28.0001 63.6492 28 95.472C28 129.756 55.9143 157.671 90.1992 157.671C122.605 157.671 146.806 134.786 170.249 111.719L221.651 59.5218Z" fill="url(#paint2_linear_1079_37)"/>
            <path d="M0 95.4719C8.34426e-05 68.7706 10.4288 45.0148 28.0713 28.5227C33.7197 23.2426 42.5793 23.5413 47.8594 29.1897C53.1395 34.838 52.8408 43.6977 47.1924 48.9777C35.4511 59.9535 28.0001 76.1936 28 95.4719C28 112.808 35.1204 128.508 46.6465 139.828C52.1629 145.246 52.243 154.111 46.8252 159.627C41.4075 165.143 32.5437 165.223 27.0273 159.806C10.3796 143.456 0 120.651 0 95.4719Z" fill="#AEDDF9"/>
            <path d="M0 95.4721C3.30382e-05 58.5213 19.9996 27.3407 50.9287 13.2309C57.9632 10.022 66.2675 13.1232 69.4766 20.1576C72.6855 27.1921 69.5842 35.4964 62.5498 38.7055C42.089 48.0397 28 68.937 28 95.4721C28 100.957 28.7114 106.262 30.04 111.306C32.0094 118.783 27.5451 126.441 20.0684 128.411C12.5914 130.38 4.93327 125.915 2.96387 118.438C1.02859 111.09 0 103.389 0 95.4721Z" fill="#637DEB"/>
            <path d="M70.7585 6.92022C78.3515 5.46052 85.6904 10.4327 87.1501 18.0257C88.6096 25.6185 83.6375 32.9566 76.0447 34.4163C52.6446 38.9149 34.8387 56.4251 29.5847 80.4886C27.9354 88.0426 20.4746 92.8293 12.9206 91.18C5.36661 89.5307 0.579905 82.0699 2.22922 74.5159C9.80122 39.8357 36.0349 13.5958 70.7585 6.92022Z" fill="#7C54EC"/>
            <path d="M83.1643 5.54517C90.8728 4.94556 97.6084 10.7087 98.2083 18.4172C98.808 26.1258 93.0448 32.8613 85.3362 33.4612C84.2712 33.5441 83.217 33.6529 82.1751 33.7874C74.5068 34.7765 67.4887 29.3619 66.4993 21.6936C65.51 14.0252 70.9246 7.00614 78.593 6.01685C80.109 5.82129 81.6335 5.6643 83.1643 5.54517Z" fill="#66F0E0"/>
            <path d="M298.458 8.87461C305.967 7.03372 313.547 11.629 315.388 19.1383C317.229 26.6478 312.634 34.2287 305.125 36.0699C280.266 42.165 260.455 61.1788 241.244 80.0836L189.875 132.25C184.449 137.759 175.585 137.827 170.076 132.402C164.567 126.977 164.498 118.112 169.923 112.603L221.377 60.3521L221.533 60.1969C239.711 42.3068 264.844 17.1162 298.458 8.87461Z" fill="url(#paint3_linear_1079_37)"/>
            <defs>
              <linearGradient id="paint0_linear_1079_37" x1="304.629" y1="53.5712" x2="304.629" y2="171.671" gradientUnits="userSpaceOnUse">
                <stop offset="0.326923" stopColor="#6BEFDF"/>
                <stop offset="0.442308" stopColor="#16E5AA"/>
                <stop offset="0.572115" stopColor="#2394DF"/>
                <stop offset="0.793269" stopColor="#34B2D4"/>
                <stop offset="1" stopColor="#45CFC9"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1079_37" x1="363.358" y1="19.4722" x2="363.358" y2="135.017" gradientUnits="userSpaceOnUse">
                <stop stopColor="#419BEA"/>
                <stop offset="1" stopColor="#61EDF5"/>
              </linearGradient>
              <linearGradient id="paint2_linear_1079_37" x1="185.899" y1="117.472" x2="24.3989" y2="149.972" gradientUnits="userSpaceOnUse">
                <stop offset="0.115083" stopColor="#7431C6"/>
                <stop offset="0.335289" stopColor="#AC80FF"/>
                <stop offset="0.513552" stopColor="#7176FA"/>
                <stop offset="0.729606" stopColor="#48B8FB"/>
                <stop offset="1" stopColor="#AEDDF9"/>
              </linearGradient>
              <linearGradient id="paint3_linear_1079_37" x1="301.899" y1="22.4723" x2="179.899" y2="122.472" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2ED7ED"/>
                <stop offset="0.202674" stopColor="#2390DD"/>
                <stop offset="0.311913" stopColor="#0AA9DA"/>
                <stop offset="0.416023" stopColor="#419BEA"/>
                <stop offset="0.516859" stopColor="#0C52E8"/>
                <stop offset="1" stopColor="#7431C6"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontWeight: '500', fontSize: '13px' }}>Journey 360</span>
        </div>

        {/* Center - View Switcher (only show in editor) */}
        {showEditorControls && onViewChange && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-secondary p-0.5 rounded-[var(--radius)]">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewChange('preview')}
              className={`h-7 px-2 rounded-[var(--radius)] transition-all ${
                mainView === 'preview'
                  ? 'bg-background shadow-[var(--elevation-sm)]'
                  : ''
              }`}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }}
            >
              <Eye className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />
              <span style={{ fontSize: '11px' }}>Preview</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewChange('code')}
              className={`h-7 px-2 rounded-[var(--radius)] transition-all ${
                mainView === 'code'
                  ? 'bg-background shadow-[var(--elevation-sm)]'
                  : 'hover:bg-background/50'
              }`}
            >
              <Code2 className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />
              <span style={{ fontSize: '11px' }}>Code</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewChange('flow')}
              className={`h-7 px-2 rounded-[var(--radius)] transition-all ${
                mainView === 'flow'
                  ? 'bg-background shadow-[var(--elevation-sm)]'
                  : 'hover:bg-background/50'
              }`}
            >
              <Workflow className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />
              <span style={{ fontSize: '11px' }}>Flow</span>
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* New Project Button - Only show in editor */}
          {showEditorControls && onNewProject && (
            <Button
              onClick={onNewProject}
              size="sm"
              variant="ghost"
              className="h-8 px-3 rounded-[var(--radius)] hover:bg-secondary"
            >
              <Plus className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />
              <span style={{ fontSize: '11px' }}>New</span>
            </Button>
          )}
          
          {/* Deploy Button with Dropdown (only show in editor) */}
          {showEditorControls && onDeploy && (
            <div className="flex items-center">
              <Button
                onClick={onDeploy}
                size="sm"
                className="bg-primary text-primary-foreground rounded-l-[var(--radius)] rounded-r-none hover:bg-primary/90 h-8 px-3 border-r border-primary-foreground/10"
              >
                <Rocket className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} />
                <span style={{ fontSize: '11px' }}>Deploy</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground rounded-r-[var(--radius)] rounded-l-none hover:bg-primary/90 h-8 px-1.5"
                  >
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border rounded-[var(--radius)]">
                  <DropdownMenuItem
                    onClick={onDownloadForm}
                    className="text-popover-foreground rounded-[var(--radius)] focus:bg-accent focus:text-accent-foreground cursor-pointer"
                    style={{ fontSize: '11px' }}
                  >
                    <FileCode className="h-3.5 w-3.5 mr-2" strokeWidth={1.5} />
                    Download Code
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDownloadScreenshots}
                    className="text-popover-foreground rounded-[var(--radius)] focus:bg-accent focus:text-accent-foreground cursor-pointer"
                    style={{ fontSize: '11px' }}
                  >
                    <Camera className="h-3.5 w-3.5 mr-2" strokeWidth={1.5} />
                    Download Screenshots
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="h-8 w-8 p-0 rounded-[var(--radius)] hover:bg-secondary"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.5} />
            )}
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-[var(--radius)] hover:bg-secondary">
                <User className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border rounded-[var(--radius)]">
              <DropdownMenuLabel className="text-popover-foreground" style={{ fontSize: '11px' }}>Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={() => setIsProfileDialogOpen(true)}
                className="text-popover-foreground rounded-[var(--radius)] focus:bg-accent focus:text-accent-foreground cursor-pointer" 
                style={{ fontSize: '11px' }}
              >
                <User className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsSettingsDialogOpen(true)}
                className="text-popover-foreground rounded-[var(--radius)] focus:bg-accent focus:text-accent-foreground cursor-pointer" 
                style={{ fontSize: '11px' }}
              >
                <Settings className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-destructive rounded-[var(--radius)] focus:bg-destructive focus:text-destructive-foreground cursor-pointer" 
                style={{ fontSize: '11px' }}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsDialogOpen} 
        onOpenChange={setIsSettingsDialogOpen}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      {/* Profile Dialog */}
      <ProfileDialog 
        open={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen}
      />
    </header>
  );
}