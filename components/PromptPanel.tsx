import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Sparkles, Send, Paperclip, X, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PromptPanelProps {
  initialPrompt: string;
  onPromptSubmit: (prompt: string, attachments?: File[]) => void;
}

export function PromptPanel({ initialPrompt, onPromptSubmit }: PromptPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content: initialPrompt,
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      content: `I'll create a comprehensive form based on your requirements. Here's what I'm going to build:

**Form Structure:**
• Analyzing the requirements to identify all necessary fields
• Setting up appropriate field types (text inputs, dropdowns, date pickers, etc.)
• Configuring validation rules for data integrity
• Creating a logical flow and grouping for better user experience

**Data Bindings:**
• Connecting form fields to the schema
• Setting up real-time validation
• Implementing data transformation where needed

**Digital APIs:**
• Generating mock API endpoints for form submission
• Creating endpoints for data retrieval and updates
• Setting up proper request/response structures

**Unit Tests:**
• Writing comprehensive test cases for all form fields
• Testing validation rules and error handling
• Ensuring data binding integrity

The form will be fully functional with all configurations applied. You can refine it further using prompts below or switch to Manual mode for detailed customization.`,
      timestamp: new Date(),
    },
  ]);
  
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (!currentPrompt.trim() && attachments.length === 0) {
      toast.error('Please enter a prompt or attach a file');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: currentPrompt.trim() || `[Attached ${attachments.length} file(s)]`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Call the parent callback
    onPromptSubmit(currentPrompt.trim(), attachments);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `I've updated the form based on your prompt. The changes have been applied to the canvas. You can continue refining by adding more prompts or switch to Manual mode for detailed configuration.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);

    setCurrentPrompt('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
      toast.success(`Added ${files.length} file(s)`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleMicrophoneToggle = () => {
    // Placeholder for microphone functionality
    setIsListening(!isListening);
    toast.info(isListening ? 'Listening...' : 'Stopped listening');
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-2 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-[var(--radius)] p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground border border-border'
                }`}
                style={{ fontSize: '11px', lineHeight: '1.5' }}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-border/50">
                    <svg width="12" height="12" viewBox="0 0 412 186" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M88.25 5.27319C95.982 5.27319 102.25 11.5412 102.25 19.2732C102.25 27.0052 95.982 33.2732 88.25 33.2732C86.9125 33.2732 85.5894 33.3128 84.2822 33.3904C76.5639 33.8487 69.9349 27.9633 69.4766 20.2449C69.0184 12.5266 74.9039 5.89862 82.6221 5.44019C84.4808 5.32981 86.3577 5.2732 88.25 5.27319Z" fill="#AEDDF9"/>
                      <path d="M90.2004 5.27319C117.782 5.27331 140.196 17.0467 158.237 30.7839C164.388 35.4682 165.578 44.2525 160.894 50.4041C156.21 56.5556 147.425 57.7445 141.274 53.0603C125.861 41.3238 109.328 33.2733 90.2004 33.2732C87.4766 33.2732 84.7981 33.4484 82.177 33.7869C74.5087 34.777 67.4894 29.3634 66.4993 21.6951C65.5091 14.0268 70.9228 7.00755 78.5911 6.01733C82.3979 5.52578 86.2743 5.27319 90.2004 5.27319Z" fill="#0CA8AC"/>
                      <path d="M89.4187 18.0819C90.6548 10.4495 97.8448 5.26396 105.477 6.49986C140.709 12.205 167.073 36.8618 186.251 55.6864L189.991 59.3661L190.146 59.5223H190.147L190.148 59.5243L190.181 59.5575C190.204 59.5807 190.238 59.6155 190.283 59.661C190.373 59.7527 190.507 59.8895 190.682 60.0672C191.032 60.4227 191.547 60.9439 192.202 61.6092C193.512 62.9401 195.389 64.8458 197.651 67.1434C202.177 71.739 208.248 77.9041 214.431 84.1825C219.857 89.6916 219.788 98.556 214.279 103.981C208.77 109.406 199.906 109.339 194.481 103.83C188.298 97.5513 182.226 91.3856 177.701 86.7899C175.438 84.4921 173.561 82.5867 172.251 81.2557C171.596 80.5904 171.082 80.0682 170.732 79.7127C170.557 79.5352 170.423 79.3992 170.333 79.3075C170.318 79.292 170.303 79.2774 170.291 79.2645C149.616 58.9209 128.299 38.5608 101.001 34.1405C93.3684 32.9044 88.1828 25.7143 89.4187 18.0819Z" fill="#66F0E0"/>
                      <path d="M201.637 91.1445C207.146 85.7192 216.009 85.787 221.435 91.2958C226.817 96.7615 231.859 101.881 235.555 105.634C237.402 107.51 238.914 109.045 239.964 110.111C240.488 110.644 240.898 111.059 241.176 111.342C241.315 111.483 241.421 111.59 241.492 111.663C241.501 111.672 241.51 111.681 241.519 111.689C264.971 134.767 289.179 157.671 321.599 157.671C355.883 157.671 383.798 129.757 383.798 95.4726C383.798 82.2695 380.299 70.5165 374.377 60.9296C370.313 54.3517 372.351 45.7249 378.929 41.6611C385.507 37.5973 394.133 39.6351 398.197 46.2128C406.945 60.3719 411.798 77.2499 411.798 95.4726C411.798 145.22 371.348 185.671 321.599 185.671C275.873 185.671 243.67 153.091 221.806 131.575L221.622 131.392C221.604 131.373 221.577 131.346 221.541 131.31C221.47 131.237 221.364 131.128 221.225 130.987C220.947 130.705 220.537 130.289 220.013 129.757C218.963 128.691 217.452 127.156 215.604 125.28C211.909 121.527 206.868 116.408 201.485 110.942C196.06 105.433 196.128 96.5698 201.637 91.1445Z" fill="url(#paint0_linear_1079_37)"/>
                      <path d="M383.818 95.4967C383.818 60.9187 359.92 35.5561 327.974 33.442C320.259 32.9312 314.419 26.2624 314.929 18.5474C315.44 10.8325 322.109 4.99194 329.824 5.50252C377.178 8.63651 411.818 46.8787 411.818 95.4967C411.818 112.603 407.022 128.644 398.704 142.3C394.682 148.904 386.068 150.996 379.464 146.974C372.861 142.952 370.768 134.337 374.791 127.734C380.518 118.33 383.818 107.308 383.818 95.4967Z" fill="url(#paint1_linear_1079_37)"/>
                      <path d="M295.054 22.2176C293.905 14.5716 299.172 7.44162 306.818 6.29325C314.431 5.15005 321.964 4.97303 329.294 5.70976C336.987 6.48324 342.597 13.3469 341.824 21.0399C341.051 28.7328 334.188 34.3423 326.495 33.569C321.518 33.0687 316.323 33.1807 310.979 33.9831C303.333 35.1314 296.203 29.8636 295.054 22.2176Z" fill="#66F0E0"/>
                      <path d="M221.651 59.5218C227.077 54.0126 235.941 53.9452 241.45 59.3704C246.959 64.7955 247.027 73.6591 241.603 79.1683L190.148 131.419C190.097 131.471 190.045 131.523 189.993 131.575C168.129 153.09 135.925 185.671 90.1992 185.671C40.4501 185.671 0 145.22 0 95.472C0.000126263 50.9092 29.1078 14.9272 70.7588 6.9202C78.3517 5.46056 85.6907 10.4327 87.1504 18.0257C88.6098 25.6185 83.6377 32.9567 76.0449 34.4163C48.2402 39.7614 28.0001 63.6492 28 95.472C28 129.756 55.9143 157.671 90.1992 157.671C122.605 157.671 146.806 134.786 170.249 111.719L221.651 59.5218Z" fill="url(#paint2_linear_1079_37)"/>
                      <path d="M0 95.4719C8.34426e-05 68.7706 10.4288 45.0148 28.0713 28.5227C33.7197 23.2426 42.5793 23.5413 47.8594 29.1897C53.1395 34.838 52.8408 43.6977 47.1924 48.9777C35.4511 59.9535 28.0001 76.1936 28 95.4719C28 112.808 35.1204 128.508 46.6465 139.828C52.1629 145.246 52.243 154.111 46.8252 159.627C41.4075 165.143 32.5437 165.223 27.0273 159.806C10.3796 143.456 0 120.651 0 95.4719Z" fill="#AEDDF9"/>
                      <path d="M0 95.4721C3.30382e-05 58.5213 19.9996 27.3407 50.9287 13.2309C57.9632 10.022 66.2675 13.1232 69.4766 20.1576C72.6855 27.1921 69.5842 35.4964 62.5498 38.7055C42.089 48.0397 28 68.937 28 95.4721C28 100.957 28.7114 106.262 30.04 111.306C32.0094 118.783 27.5451 126.441 20.0684 128.411C12.5914 130.38 4.93327 125.915 2.96387 118.438C1.02859 111.09 0 103.389 0 95.4721Z" fill="#637DEB"/>
                      <path d="M70.7585 6.92022C78.3515 5.46052 85.6904 10.4327 87.1501 18.0257C88.6096 25.6185 83.6375 32.9566 76.0447 34.4163C52.6446 38.9149 34.8387 56.4251 29.5847 80.4886C27.9354 88.0426 20.4746 92.8293 12.9206 91.18C5.36661 89.5307 0.579906 82.0699 2.22922 74.5159C9.80122 39.8357 36.0349 13.5958 70.7585 6.92022Z" fill="#7C54EC"/>
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
                    <span style={{ fontWeight: '500', fontSize: '10px' }}>AI</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div
                  className={`mt-1.5 pt-1.5 border-t ${
                    message.role === 'user' 
                      ? 'border-primary-foreground/20 text-primary-foreground/60' 
                      : 'border-border/30 text-muted-foreground'
                  }`}
                  style={{ fontSize: '9px' }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground border border-border rounded-[var(--radius)] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-foreground/50"
                        style={{
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px' }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background px-3 py-2">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-[var(--radius-pill)] border border-border"
              >
                <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="text-foreground" style={{ fontSize: '11px' }}>
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3 shrink-0" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container - Figma Make Style */}
        <div className="relative flex items-center gap-1.5 bg-card border border-border rounded-[var(--radius-input)] p-1.5 focus-within:border-foreground transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {/* Attachment Button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 rounded-[var(--radius-button)] hover:bg-secondary shrink-0"
            title="Attach file"
          >
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </Button>

          {/* Textarea */}
          <Textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type here..."
            className="flex-1 min-h-[28px] max-h-[100px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            style={{ fontSize: '13px', lineHeight: '1.4' }}
            rows={1}
          />

          {/* Microphone Button */}
          <Button
            onClick={handleMicrophoneToggle}
            size="sm"
            variant="ghost"
            className={`h-7 w-7 p-0 rounded-[var(--radius-button)] shrink-0 transition-colors ${
              isListening ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'hover:bg-secondary'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? (
              <MicOff className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Mic className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || (!currentPrompt.trim() && attachments.length === 0)}
            className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 shrink-0 h-7 w-7 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            title="Send"
          >
            <Send className="h-3.5 w-3.5 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}