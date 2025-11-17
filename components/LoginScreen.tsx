import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('demo@journey360.ai');
  const [password, setPassword] = useState('demo123');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#C5D5F7] via-[#D4E0F9] to-[#E8EEFB] flex items-center justify-center">
      {/* Center Card */}
      <div className="px-6">
        <div className="w-full max-w-md bg-card rounded-[var(--radius-card)] p-6 shadow-sm border border-border">
          {/* Journey 360 Logo */}
          <div className="flex justify-center mt-[-24px] mr-[0px] ml-[0px] mb-[-28px]">
            <svg width="809" height="108" viewBox="0 0 809 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-52">
              <path d="M49.7229 9.08631C50.6511 9.03119 51.5892 9.00305 52.5362 9.00305" stroke="#AEDDF9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M47.9238 9.37186C49.8083 9.12853 51.7298 9.00305 53.6794 9.00305C67.3734 9.00305 78.7913 14.8149 88.5991 22.2832" stroke="#0CA8AC" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M61.325 9.617C80.3536 12.6982 94.6668 26.7834 106.434 38.3625C106.434 38.3625 113.422 45.4596 120.673 52.8224" stroke="#66F0E0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M124.78 56.993C131.092 63.4023 136.603 68.9996 136.603 68.9996C149.896 82.0803 166.439 98.3608 189.359 98.3608C213.995 98.3608 234.038 78.3178 234.038 53.6819C234.038 44.4687 231.589 36.0752 227.288 29.1135" stroke="url(#paint0_linear_1119_50)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M227.558 76.8689C231.676 70.1084 234.049 62.174 234.049 53.696C234.049 29.3053 216.888 10.6584 193.639 9.11981" stroke="url(#paint1_linear_1119_50)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M193.05 9.21785C189.442 8.85519 185.711 8.93991 181.912 9.51031" stroke="#66F0E0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M136.604 38.3625L106.435 68.9996C93.1421 82.0803 76.599 98.3608 53.6788 98.3608C29.0424 98.3608 9 78.3178 9 53.6819C9 31.2877 23.4675 13.7355 43.83 9.82104" stroke="url(#paint2_linear_1119_50)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22.3903 85.5468C14.1305 77.4347 9 66.1464 9 53.6819C9 40.2019 14.2419 28.4762 22.8565 20.4233" stroke="#AEDDF9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.467 65.057C9.51012 61.424 9 57.611 9 53.6819C9 35.0696 18.9937 19.8018 34.0598 12.9286" stroke="#637DEB" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.1182 43.1453C13.8784 25.9232 26.7897 13.0969 43.83 9.82104" stroke="#7C54EC" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M47.9238 9.37189C48.6738 9.27514 49.4296 9.19716 50.1906 9.13794" stroke="#66F0E0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M177.745 10.8788C160.593 15.0841 147.412 28.0552 136.444 38.8492L106.274 69.4863" stroke="url(#paint3_linear_1119_50)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M763.021 45.6564C763.021 27.531 767.901 13.5884 785.678 13.5884C803.455 13.5884 808.335 27.531 808.335 45.6564C808.335 64.1304 803.455 78.073 785.678 78.073C767.901 78.073 763.021 64.1304 763.021 45.6564ZM798.575 45.6564C798.575 33.8052 797.268 22.6511 785.678 22.6511C774.088 22.6511 772.781 33.8052 772.781 45.6564C772.781 58.1176 774.088 69.0103 785.678 69.0103C797.268 69.0103 798.575 58.1176 798.575 45.6564Z" fill="black"/>
              <path d="M750.421 29.4481H741.271C740.051 24.3068 737.001 21.4311 730.727 21.4311C721.752 21.4311 717.133 27.531 716.872 44.175C720.009 38.9465 726.283 36.158 732.906 36.158C744.321 36.158 752.425 43.8264 752.425 57.0719C752.425 69.0974 745.193 78.2472 731.599 78.2472C713.125 78.2472 708.332 65.2632 708.332 45.0464C708.332 25.1782 714.955 13.1527 730.814 13.1527C743.188 13.1527 749.375 20.9954 750.421 29.4481ZM730.727 44.5236C724.192 44.5236 718.004 48.4449 718.004 56.8976C718.004 64.7403 722.623 69.9688 731.076 69.9688C738.396 69.9688 742.927 65.0018 742.927 57.5076C742.927 49.9263 739.093 44.5236 730.727 44.5236Z" fill="black"/>
              <path d="M655.197 30.4068C655.894 19.427 664.434 13.2399 676.024 13.2399C688.66 13.2399 695.544 20.5598 695.544 29.7968C695.544 37.3781 690.751 42.5194 685.784 44.1751V44.5237C692.407 46.5279 696.677 52.0178 696.677 60.8191C696.677 70.9275 689.531 78.5959 676.286 78.5959C664.26 78.5959 654.936 72.3217 654.326 59.8605H663.911C664.347 65.7861 668.704 70.3175 676.198 70.3175C683.605 70.3175 687.265 65.7861 687.265 59.8605C687.265 51.495 681.863 48.6193 671.493 48.6193H669.227V40.428H671.58C680.555 40.3409 686.045 37.7266 686.045 30.9296C686.045 25.4397 682.473 21.7798 675.676 21.7798C668.704 21.7798 665.48 25.9626 664.87 30.4068H655.197Z" fill="black"/>
              <path d="M602.233 66.8317L616.263 30.2324H626.546L597.092 100.817H586.809L596.569 77.4629L577.659 30.2324H588.726L602.233 66.8317Z" fill="black"/>
              <path d="M549.758 37.8137C543.048 37.8137 537.645 42.3451 536.599 49.9264H563.177C563.003 42.5194 557.165 37.8137 549.758 37.8137ZM572.24 63.9561C569.539 72.3217 561.957 79.0316 550.193 79.0316C536.425 79.0316 526.229 69.2717 526.229 54.1963C526.229 39.1209 535.989 29.4482 550.193 29.4482C563.875 29.4482 573.547 38.9466 573.547 53.0635C573.547 54.7191 573.46 56.2877 573.199 57.9434H536.512C537.209 65.8732 542.873 70.666 550.193 70.666C556.293 70.666 559.692 67.7032 561.522 63.9561H572.24Z" fill="black"/>
              <path d="M507.023 78.2473V51.4078C507.023 42.6065 502.23 38.0752 494.997 38.0752C487.677 38.0752 482.885 42.6065 482.885 51.4078V78.2473H472.95V30.2325H482.885V35.7223C486.109 31.801 491.424 29.4482 497.176 29.4482C508.417 29.4482 516.87 36.5066 516.87 49.9264V78.2473H507.023Z" fill="black"/>
              <path d="M449.44 52.9763V78.2473H439.506V30.2325H449.44V37.2038C452.229 32.411 457.022 29.4482 463.819 29.4482V39.7308H461.292C453.972 39.7308 449.44 42.7808 449.44 52.9763Z" fill="black"/>
              <path d="M426.399 30.2324V78.2472H416.465V72.4959C413.328 76.5915 407.925 78.9443 402.261 78.9443C391.02 78.9443 382.48 71.8859 382.48 58.4661V30.2324H392.327V56.9847C392.327 65.786 397.12 70.3173 404.353 70.3173C411.673 70.3173 416.465 65.786 416.465 56.9847V30.2324H426.399Z" fill="black"/>
              <path d="M373.095 54.1963C373.095 69.2717 361.941 79.0316 348.173 79.0316C334.491 79.0316 324.122 69.2717 324.122 54.1963C324.122 39.1209 334.927 29.4482 348.608 29.4482C362.289 29.4482 373.095 39.1209 373.095 54.1963ZM334.23 54.1963C334.23 65.089 340.678 70.4046 348.173 70.4046C355.58 70.4046 362.899 65.089 362.899 54.1963C362.899 43.3036 355.841 38.0752 348.434 38.0752C340.94 38.0752 334.23 43.3036 334.23 54.1963Z" fill="black"/>
              <path d="M301.164 61.3419V17.6841H311.185V61.3419C311.185 72.3217 303.778 78.8573 293.321 78.8573C282.865 78.8573 275.458 72.3217 275.458 61.3419H285.479C285.566 66.3961 288.006 70.056 293.321 70.056C298.637 70.056 301.164 66.3961 301.164 61.3419Z" fill="black"/>
              <defs>
                <linearGradient id="paint0_linear_1119_50" x1="179.409" y1="29.1135" x2="179.409" y2="98.3608" gradientUnits="userSpaceOnUse">
                  <stop offset="0.326923" stopColor="#6BEFDF"/>
                  <stop offset="0.442308" stopColor="#16E5AA"/>
                  <stop offset="0.572115" stopColor="#2394DF"/>
                  <stop offset="0.793269" stopColor="#34B2D4"/>
                  <stop offset="1" stopColor="#45CFC9"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1119_50" x1="213.844" y1="9.11981" x2="213.844" y2="76.8689" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#419BEA"/>
                  <stop offset="1" stopColor="#61EDF5"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1119_50" x1="109.792" y1="66.5815" x2="15.0973" y2="85.6377" gradientUnits="userSpaceOnUse">
                  <stop offset="0.115083" stopColor="#7431C6"/>
                  <stop offset="0.335289" stopColor="#AC80FF"/>
                  <stop offset="0.513552" stopColor="#7176FA"/>
                  <stop offset="0.729606" stopColor="#48B8FB"/>
                  <stop offset="1" stopColor="#AEDDF9"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1119_50" x1="177.808" y1="10.8788" x2="106.274" y2="69.5133" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2ED7ED"/>
                  <stop offset="0.202674" stopColor="#2390DD"/>
                  <stop offset="0.311913" stopColor="#0AA9DA"/>
                  <stop offset="0.416023" stopColor="#419BEA"/>
                  <stop offset="0.516859" stopColor="#0C52E8"/>
                  <stop offset="1" stopColor="#7431C6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Subtitle Badge */}
          <div className="flex justify-center mt-3 mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] border border-[#419BEA]/30" style={{ background: 'linear-gradient(135deg, #2390DD 0%, #419BEA 50%, #0C52E8 100%)' }}>
              <span className="text-white" style={{ fontSize: '11px', fontWeight: '500' }}>
                AI-Driven Product Acceleration Platform
              </span>
            </div>
          </div>
          
          {/* Heading */}
          <h1 className="text-foreground text-center mb-2 text-[22px] font-bold">
            Generate complete, deployable journeys from a single prompt
          </h1>
          
          {/* Subtext */}
          <p className="text-muted-foreground text-center mb-5 text-[16px]">
            Forms, rules, and tests included
          </p>

          {/* Email and Password Form */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-foreground block">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sooyaa334455@gmail.com"
                className="h-12 bg-background border border-border rounded-[var(--radius-input)] focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground block">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-background border border-border rounded-[var(--radius-input)] focus:border-primary transition-all"
                required
              />
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 transition-all mt-4"
            >
              Continue
            </Button>
          </form>

          {/* Terms and Privacy */}
          <p className="text-center text-muted-foreground mt-4">
            <button className="text-accent hover:underline" type="button">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}