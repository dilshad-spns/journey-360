import React, { useMemo, useState } from 'react';
import { FormSchema, FieldSchema } from '../types/schema';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ArrowRight,
  ArrowDown,
  GitBranch,
  PlayCircle,
  Send,
  FileText,
  Mail,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  List,
  Upload,
  Phone,
  Link as LinkIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Diamond,
  Sparkles
} from 'lucide-react';

interface FlowChartProps {
  schema: FormSchema;
  themeColors?: string[];
}

export const FlowChart: React.FC<FlowChartProps> = ({ schema, themeColors }) => {
  const [zoom, setZoom] = useState(1);

  // Group fields by wizard step
  const stepGroups = useMemo(() => {
    const groups: Map<number, FieldSchema[]> = new Map();
    
    schema.fields.forEach(field => {
      const step = field.wizardStep ?? 0;
      if (!groups.has(step)) {
        groups.set(step, []);
      }
      groups.get(step)!.push(field);
    });
    
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [schema.fields]);

  // Find conditional fields
  const conditionalFields = useMemo(() => {
    return schema.fields.filter(field => field.conditional);
  }, [schema.fields]);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'select':
      case 'radio':
        return <List className="w-4 h-4" />;
      case 'checkbox':
        return <ToggleLeft className="w-4 h-4" />;
      case 'textarea':
        return <FileText className="w-4 h-4" />;
      case 'file':
        return <Upload className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'url':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.25, prev - 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  return (
    <div className="flex flex-col bg-background h-full">
      {/* Header with Zoom Controls */}
      <div 
        className="flex-shrink-0 px-6 py-3 border-b bg-card flex items-center justify-between" 
        style={{ borderColor: 'var(--border)' }}
      >
        {/* AI Generated Flow Tag */}
        <div className="flex items-center gap-2">
          <div 
            className="px-2 py-1 border bg-primary/10 flex items-center gap-1.5"
            style={{ borderRadius: 'var(--radius)', borderColor: 'var(--primary)' }}
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium" style={{ fontSize: '11px' }}>AI Generated Flow</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1.5 border bg-card hover:bg-secondary transition-colors flex items-center gap-1.5"
            style={{ borderRadius: 'var(--radius)', borderColor: 'var(--border)' }}
            title="Zoom Out"
            disabled={zoom <= 0.25}
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">−</span>
          </button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1.5 border bg-card hover:bg-secondary transition-colors flex items-center gap-1.5"
            style={{ borderRadius: 'var(--radius)', borderColor: 'var(--border)' }}
            title="Zoom In"
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">+</span>
          </button>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1.5 border bg-card hover:bg-secondary transition-colors flex items-center gap-1.5"
            style={{ borderRadius: 'var(--radius)', borderColor: 'var(--border)' }}
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Reset</span>
          </button>
        </div>
      </div>

      {/* Scrollable Flow Area */}
      <div className="flex-1 overflow-auto bg-muted/20 flex justify-center items-start">
        <div 
          className="inline-flex flex-col items-center gap-3 p-8 transition-transform duration-200"
          style={{ 
            transformOrigin: 'top center', 
            transform: `scale(${zoom})`,
            minWidth: 'max-content'
          }}
        >
          {/* Start Node */}
          <div 
            className="px-8 py-4 border-2 bg-card shadow-sm flex items-center justify-center gap-2"
            style={{ 
              borderColor: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)',
              borderRadius: 'var(--radius-pill)',
              minWidth: '160px'
            }}
          >
            <PlayCircle 
              className="w-5 h-5" 
              style={{ color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)' }}
            />
            <div>
              <p className="text-foreground">Start</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-border" />
          </div>

          {/* Process each step group */}
          {stepGroups.map(([stepNum, fields], stepIndex) => (
            <React.Fragment key={stepNum}>
              {/* Step Group Container */}
              <div className="flex flex-col items-center gap-3">
                {fields.map((field, fieldIndex) => {
                  const isConditional = !!field.conditional;
                  const isRequired = field.validations?.some(v => v.type === 'required');

                  return (
                    <React.Fragment key={field.id}>
                      {/* Show decision diamond for conditional fields */}
                      {isConditional ? (
                        <>
                          {/* Decision Diamond */}
                          <div className="relative flex items-center justify-center">
                            <div 
                              className="w-40 h-40 bg-card border-2 shadow-sm transform rotate-45 flex items-center justify-center"
                              style={{ 
                                borderColor: themeColors?.[1] ? 'var(--theme-accent)' : 'var(--accent)'
                              }}
                            >
                              <div className="transform -rotate-45 text-center px-2">
                                <p className="text-xs text-foreground mb-1">Condition</p>
                                <p className="text-xs text-muted-foreground" style={{ fontSize: '10px' }}>
                                  {field.conditional?.field}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Connector */}
                          <div className="flex flex-col items-center">
                            <ArrowDown className="w-6 h-6 text-border" />
                          </div>

                          {/* Field Rectangle after decision */}
                          <div 
                            className="px-6 py-4 border-2 bg-card shadow-sm w-[280px]"
                            style={{ 
                              borderRadius: 'var(--radius)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                                  style={{ 
                                    backgroundColor: 'var(--secondary)',
                                    color: 'var(--muted-foreground)'
                                  }}
                                >
                                  {getFieldIcon(field.type)}
                                </div>
                                <div>
                                  <p className="text-sm text-foreground">{field.label}</p>
                                  <p className="text-xs text-muted-foreground">{field.type}</p>
                                </div>
                              </div>
                              {isRequired && (
                                <div className="px-1.5 py-0.5 bg-destructive/10 rounded" style={{ borderRadius: 'var(--radius)' }}>
                                  <span className="text-xs text-destructive">Required</span>
                                </div>
                              )}
                            </div>
                            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                              <p className="text-xs text-muted-foreground font-mono">{field.name}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Regular Field Rectangle */
                        <div 
                          className="px-4 py-3.5 border bg-card w-[280px] transition-all hover:shadow-md"
                          style={{ 
                            borderRadius: 'var(--radius-card)',
                            borderColor: 'var(--border)',
                            boxShadow: 'var(--elevation-sm)'
                          }}
                        >
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div 
                                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                                style={{ 
                                  borderRadius: 'var(--radius)',
                                  backgroundColor: 'var(--primary)',
                                  color: 'var(--primary-foreground)'
                                }}
                              >
                                {getFieldIcon(field.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground mb-0.5 truncate" style={{ fontSize: '13px' }}>{field.label}</p>
                                <p className="text-muted-foreground capitalize truncate" style={{ fontSize: '11px' }}>{field.type}</p>
                              </div>
                            </div>
                            {isRequired && (
                              <div 
                                className="px-2 py-1 bg-destructive/10 flex-shrink-0" 
                                style={{ borderRadius: 'var(--radius-pill)' }}
                              >
                                <span className="text-destructive" style={{ fontSize: '10px' }}>Required</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-muted-foreground font-mono truncate" style={{ fontSize: '11px' }}>{field.name}</p>
                          </div>
                        </div>
                      )}

                      {/* Connector to next field if not last in group */}
                      {fieldIndex < fields.length - 1 && (
                        <div className="flex flex-col items-center">
                          <ArrowDown className="w-6 h-6 text-border" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Connector to next step if not last step */}
              {stepIndex < stepGroups.length - 1 && (
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-6 h-6 text-border" />
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Connector */}
          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-border" />
          </div>

          {/* Submit Rectangle */}
          <div 
            className="px-6 py-4 border-2 bg-card shadow-sm w-[280px]"
            style={{ 
              borderColor: 'var(--success)',
              borderRadius: 'var(--radius)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-success" />
              <p className="text-foreground">Submit Form</p>
            </div>
            {schema.submitUrl && (
              <p className="text-xs text-muted-foreground">
                POST {schema.submitUrl}
              </p>
            )}
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-border" />
          </div>

          {/* End Node */}
          <div 
            className="px-8 py-4 border-2 shadow-sm"
            style={{ 
              borderColor: 'var(--success)',
              backgroundColor: 'var(--success)',
              borderRadius: 'var(--radius-pill)',
              minWidth: '160px'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <p className="text-white">End</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div 
        className="flex-shrink-0 px-6 py-3 border-t bg-card/50 flex items-center justify-between" 
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)' }} />
            <span className="text-muted-foreground">{stepGroups.length} Steps</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{schema.fields.length} Fields</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-destructive" />
            <span className="text-muted-foreground">
              {schema.fields.filter(f => f.validations?.some(v => v.type === 'required')).length} Required
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch 
              className="w-3 h-3" 
              style={{ color: themeColors?.[1] ? 'var(--theme-accent)' : 'var(--accent)' }}
            />
            <span className="text-muted-foreground">{conditionalFields.length} Conditional</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Scroll vertically • Use zoom controls to adjust view
        </p>
      </div>
    </div>
  );
};