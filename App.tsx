import React, { useState, useEffect } from "react";
// import Lottie from 'lottie-react';
import { LoginScreen } from "./components/LoginScreen";
import { MainPromptScreen } from "./components/MainPromptScreen";
import { FormEditorPage } from "./components/FormEditorPage";
import { TopNav } from "./components/TopNav";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { DeploymentDialog } from "./components/DeploymentDialog";
import { AIParser } from "./utils/aiParser";
import { TestGenerator } from "./utils/testGenerator";
import { MockApiGenerator } from "./utils/mockApi";
import { infinityAnimation } from "./utils/infinityAnimation";
import JSZip from "jszip";
import type { FormSchema, TestCase, MockApiEndpoint } from "./types/schema";

type Screen = "login" | "main" | "editor";
type InputMode = "text" | "speech" | "upload";

interface AppState {
  screen: Screen;
  inputMode: InputMode | null;
  requirements: string;
  schema: FormSchema | null;
  tests: TestCase[];
  mockApi: MockApiEndpoint[];
  isProcessing: boolean;
  isLoggedIn: boolean;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const [state, setState] = useState<AppState>({
    screen: "login",
    inputMode: null,
    requirements: "",
    schema: null,
    tests: [],
    mockApi: [],
    isProcessing: false,
    isLoggedIn: false,
  });

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [mainView, setMainView] = useState<"preview" | "code" | "flow">(
    "preview"
  );
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);

  const loadingMessages = [
    "Analyzing your requirements...",
    "Generating form schema...",
    "Creating UI components...",
    "Setting up data bindings...",
    "Building validation rules...",
    "Generating Digital APIs...",
    "Writing unit tests...",
    "Optimizing performance...",
    "Almost ready...",
  ];

  useEffect(() => {
    if (state.isProcessing) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [state.isProcessing]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Ensure CMD+A/CTRL+A works globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow select all (CMD+A / CTRL+A) to work everywhere
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        // Don't prevent default - let browser handle select all
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectMode = (mode: InputMode, prompt?: string) => {
    console.log(
      "🎯 App.tsx: handleSelectMode called with mode:",
      mode,
      "prompt:",
      prompt
    );
    setState((prev) => ({
      ...prev,
      screen: "main",
      inputMode: mode,
      requirements: prompt || "",
    }));
  };

  const handleBackToLanding = () => {
    setState((prev) => ({
      ...prev,
      screen: "login",
      inputMode: null,
    }));
  };

  const handleNewProject = () => {
    setState({
      screen: "main",
      inputMode: null,
      requirements: "",
      schema: null,
      tests: [],
      mockApi: [],
      isProcessing: false,
      isLoggedIn: true,
    });
  };

  const handleContinueWithRequirements = async (requirements: string) => {
    setState((prev) => ({
      ...prev,
      requirements,
      isProcessing: true,
    }));

    // Simulate AI processing
    setTimeout(() => {
      const schema = AIParser.parseUserStory(requirements);
      const tests = TestGenerator.generateTests(schema);
      const mockApi = MockApiGenerator.generateEndpoints(schema);

      setState((prev) => ({
        ...prev,
        screen: "editor",
        schema,
        tests,
        mockApi,
        isProcessing: false,
      }));
    }, 7000);
  };

  const handleSchemaUpdate = (schema: FormSchema) => {
    setState((prev) => ({
      ...prev,
      schema,
    }));
  };

  const handleRegenerate = async (newRequirements: string) => {
    setState((prev) => ({
      ...prev,
      requirements: newRequirements,
      isProcessing: true,
    }));

    // Simulate regeneration
    setTimeout(() => {
      const schema = AIParser.parseUserStory(newRequirements);
      const tests = TestGenerator.generateTests(schema);
      const mockApi = MockApiGenerator.generateEndpoints(schema);

      setState((prev) => ({
        ...prev,
        schema,
        tests,
        mockApi,
        isProcessing: false,
      }));
    }, 1500);
  };

  const handleLogout = () => {
    setState({
      screen: "login",
      inputMode: null,
      requirements: "",
      schema: null,
      tests: [],
      mockApi: [],
      isProcessing: false,
      isLoggedIn: false,
    });
    toast.success("Successfully logged out");
  };

  const handleDeploy = () => {
    // Deployment logic will be handled in FormEditorPage
    console.log("Deploy triggered from App");
    setDeployDialogOpen(true);
  };

  const handleDownloadForm = async () => {
    if (!state.schema) {
      toast.error("No form available to download");
      return;
    }

    try {
      toast.info("Generating form files...");

      const zip = new JSZip();

      // Generate form component code
      const formCode = generateFormCode(state.schema);
      zip.file(`${state.schema.title.replace(/\s+/g, "")}.tsx`, formCode);

      // Generate types file
      const typesCode = generateTypesCode(state.schema);
      zip.file("types.ts", typesCode);

      // Generate schema JSON
      zip.file("schema.json", JSON.stringify(state.schema, null, 2));

      // Generate tests
      if (state.tests.length > 0) {
        const testsCode = generateTestsCode(state.schema, state.tests);
        zip.file("tests.spec.ts", testsCode);
      }

      // Generate README
      const readme = generateReadme(state.schema);
      zip.file("README.md", readme);

      // Generate ZIP file
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.schema.title.replace(/\s+/g, "_")}_form.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Form downloaded successfully!");
    } catch (error) {
      console.error("Error downloading form:", error);
      toast.error("Failed to download form");
    }
  };

  const handleDownloadScreenshots = async () => {
    if (!state.schema) {
      toast.error("No form available");
      return;
    }

    // Call the function registered by FormEditorPage
    if ((window as any).__captureFormScreenshots) {
      await (window as any).__captureFormScreenshots();
    } else {
      toast.error("Screenshot feature not ready. Please try again.");
    }
  };

  // Helper function to generate form code
  const generateFormCode = (schema: FormSchema): string => {
    return `import React from 'react';
import { useForm } from 'react-hook-form';

export const ${schema.title.replace(/\s+/g, "")}Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    ${
      schema.submitUrl
        ? `
    // Submit to API
    const response = await fetch('${schema.submitUrl}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });`
        : "// Add your submit logic here"
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2>${schema.title}</h2>
      <p>${schema.description}</p>

${schema.fields
  .map(
    (field) => `      <div>
        <label htmlFor="${field.name}">${field.label}${
      field.validations?.some((v) => v.type === "required") ? " *" : ""
    }</label>
        <input
          id="${field.name}"
          type="${field.type}"
          {...register('${field.name}'${
      field.validations?.some((v) => v.type === "required")
        ? ", { required: 'This field is required' }"
        : ""
    })}
        />
        {errors.${field.name} && <span className="error">{errors.${
      field.name
    }?.message}</span>}
      </div>`
  )
  .join("\n")}

      <button type="submit">Submit</button>
    </form>
  );
};`;
  };

  // Helper function to generate types code
  const generateTypesCode = (schema: FormSchema): string => {
    return `export interface ${schema.title.replace(/\s+/g, "")}Data {
${schema.fields
  .map(
    (field) =>
      `  ${field.name}: ${field.type === "number" ? "number" : "string"};`
  )
  .join("\n")}
}

export interface ValidationRule {
  type: string;
  value?: any;
  message: string;
}

export interface FieldSchema {
  id: string;
  name: string;
  label: string;
  type: string;
  validations?: ValidationRule[];
  conditional?: {
    field: string;
    value: string;
  };
  wizardStep?: number;
}`;
  };

  // Helper function to generate tests code
  const generateTestsCode = (schema: FormSchema, tests: TestCase[]): string => {
    return `import { render, screen, fireEvent } from '@testing-library/react';
import { ${schema.title.replace(
      /\s+/g,
      ""
    )}Form } from './${schema.title.replace(/\s+/g, "")}';

describe('${schema.title}', () => {
${tests
  .map(
    (test) => `  test('${test.description}', async () => {
    render(<${schema.title.replace(/\s+/g, "")}Form />);
    // Add test implementation
  });`
  )
  .join("\n\n")}
});`;
  };

  // Helper function to generate README
  const generateReadme = (schema: FormSchema): string => {
    return `# ${schema.title}

${schema.description}

## Installation

\`\`\`bash
npm install react-hook-form
\`\`\`

## Usage

\`\`\`tsx
import { ${schema.title.replace(
      /\s+/g,
      ""
    )}Form } from './${schema.title.replace(/\s+/g, "")}';

function App() {
  return <${schema.title.replace(/\s+/g, "")}Form />;
}
\`\`\`

## Fields

${schema.fields
  .map(
    (field) =>
      `- **${field.label}** (\`${field.name}\`): ${field.type}${
        field.validations?.some((v) => v.type === "required")
          ? " - Required"
          : ""
      }`
  )
  .join("\n")}

## API Endpoint

${schema.submitUrl ? `POST ${schema.submitUrl}` : "Not configured"}

---

Generated by Journey 360 - Auto-Build Deployable Journeys
`;
  };

  return (
    <div className='h-screen overflow-hidden bg-background flex flex-col'>
      <Toaster />
      {/* Top Navigation - Show on all screens except landing */}
      {state.screen !== "login" && (
        <TopNav
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onNewProject={handleNewProject}
          onGoHome={handleBackToLanding}
          showEditorControls={state.screen === "editor"}
          mainView={mainView}
          onViewChange={setMainView}
          onDeploy={handleDeploy}
          onDownloadForm={handleDownloadForm}
          onDownloadScreenshots={handleDownloadScreenshots}
          onLogout={handleLogout}
        />
      )}

      {/* Screen Routing */}
      <div className='flex-1 flex flex-col min-h-0'>
        {state.screen === "login" && (
          <LoginScreen
            onLogin={() =>
              setState((prev) => ({
                ...prev,
                isLoggedIn: true,
                screen: "main",
              }))
            }
          />
        )}

        {state.screen === "main" && (
          <MainPromptScreen onContinue={handleContinueWithRequirements} />
        )}

        {state.screen === "editor" && state.schema && (
          <FormEditorPage
            requirements={state.requirements}
            schema={state.schema}
            tests={state.tests}
            mockApi={state.mockApi}
            onSchemaUpdate={handleSchemaUpdate}
            onRegenerate={handleRegenerate}
            mainView={mainView}
            onViewChange={setMainView}
            onDeploy={handleDeploy}
            onDownload={handleDownloadForm}
            onDownloadScreenshots={handleDownloadScreenshots}
          />
        )}
      </div>

      {/* Processing Overlay */}
      {state.isProcessing && (
        <div className='fixed inset-0 bg-background/95 flex items-center justify-center z-50'>
          <div className='p-4 text-center relative flex flex-col items-center justify-center'>
            {/* Animated Logo Loader */}
            <div className='relative mb-3 flex items-center justify-center'>
              <div className='relative h-32 w-32'>
                {/* Lottie Infinity Animation - Commented out until lottie-react is installed */}
                <div className='relative h-32 w-32 flex items-center justify-center'>
                  {/* <Lottie
                    animationData={infinityAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  /> */}
                  <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin' />
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className='relative space-y-1.5 w-full flex flex-col items-center'>
              <h3 className='text-foreground'>Processing Your Requirements</h3>

              {/* Scrolling status messages */}
              <div className='min-h-[48px] flex items-center justify-center w-full'>
                <div className='relative overflow-hidden h-12 w-full max-w-md'>
                  {loadingMessages.map((message, index) => (
                    <div
                      key={index}
                      className='absolute inset-0 flex items-center justify-center transition-all duration-500'
                      style={{
                        transform: `translateY(${
                          (index - loadingMessageIndex) * 100
                        }%)`,
                        opacity: index === loadingMessageIndex ? 1 : 0,
                      }}
                    >
                      <p
                        className='text-center px-4'
                        style={{ color: "var(--loader-subtext)" }}
                      >
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className='space-y-1.5 w-full flex flex-col items-center'>
                <div className='flex items-center justify-center gap-1'>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='h-1.5 w-1.5 rounded-full bg-primary'
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className='w-full max-w-xs mx-auto h-1 bg-secondary rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary rounded-full transition-all duration-700'
                    style={{
                      width: `${Math.min(
                        ((loadingMessageIndex + 1) / loadingMessages.length) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Dialog */}
      {deployDialogOpen && state.schema && (
        <DeploymentDialog
          open={deployDialogOpen}
          onOpenChange={setDeployDialogOpen}
          schema={state.schema}
          mockApi={state.mockApi}
        />
      )}
    </div>
  );
}
