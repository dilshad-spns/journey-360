import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldCheck,
  GitBranch,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { FormSchema, FieldSchema, ValidationRule } from '../types/schema';

export interface CustomValidationRule {
  id: string;
  name: string;
  description: string;
  field1: string;
  field2?: string;
  operator: 'greater_than' | 'less_than' | 'equal_to' | 'not_equal_to' | 'contains' | 'not_contains' | 'before' | 'after';
  errorMessage: string;
}

export interface FieldDependency {
  id: string;
  name: string;
  description: string;
  sourceField: string;
  sourceValue: string;
  targetField: string;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'unrequire';
}

interface RulesValidationManagerProps {
  schema: FormSchema;
  onSchemaUpdate: (schema: FormSchema) => void;
}

export function RulesValidationManager({ schema, onSchemaUpdate }: RulesValidationManagerProps) {
  const [customRules, setCustomRules] = useState<CustomValidationRule[]>([]);
  const [dependencies, setDependencies] = useState<FieldDependency[]>([]);
  const [editingRule, setEditingRule] = useState<CustomValidationRule | null>(null);
  const [editingDependency, setEditingDependency] = useState<FieldDependency | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [isAddingDependency, setIsAddingDependency] = useState(false);

  // New rule form state
  const [newRule, setNewRule] = useState<Partial<CustomValidationRule>>({
    name: '',
    description: '',
    field1: '',
    field2: undefined,
    operator: 'greater_than',
    errorMessage: '',
  });

  // New dependency form state
  const [newDependency, setNewDependency] = useState<Partial<FieldDependency>>({
    name: '',
    description: '',
    sourceField: '',
    sourceValue: '',
    targetField: '',
    action: 'show',
  });

  const handleAddRule = () => {
    if (!newRule.name || !newRule.field1 || !newRule.errorMessage) {
      return;
    }

    const rule: CustomValidationRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name!,
      description: newRule.description || '',
      field1: newRule.field1!,
      field2: newRule.field2,
      operator: newRule.operator!,
      errorMessage: newRule.errorMessage!,
    };

    setCustomRules([...customRules, rule]);
    setIsAddingRule(false);
    setNewRule({
      name: '',
      description: '',
      field1: '',
      field2: undefined,
      operator: 'greater_than',
      errorMessage: '',
    });
  };

  const handleAddDependency = () => {
    if (!newDependency.name || !newDependency.sourceField || !newDependency.targetField || !newDependency.sourceValue) {
      return;
    }

    const dependency: FieldDependency = {
      id: `dep_${Date.now()}`,
      name: newDependency.name!,
      description: newDependency.description || '',
      sourceField: newDependency.sourceField!,
      sourceValue: newDependency.sourceValue!,
      targetField: newDependency.targetField!,
      action: newDependency.action!,
    };

    setDependencies([...dependencies, dependency]);
    setIsAddingDependency(false);
    setNewDependency({
      name: '',
      description: '',
      sourceField: '',
      sourceValue: '',
      targetField: '',
      action: 'show',
    });
  };

  const handleDeleteRule = (id: string) => {
    setCustomRules(customRules.filter(r => r.id !== id));
  };

  const handleDeleteDependency = (id: string) => {
    setDependencies(dependencies.filter(d => d.id !== id));
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      greater_than: 'Greater Than',
      less_than: 'Less Than',
      equal_to: 'Equal To',
      not_equal_to: 'Not Equal To',
      contains: 'Contains',
      not_contains: 'Does Not Contain',
      before: 'Before',
      after: 'After',
    };
    return labels[operator] || operator;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      show: 'Show',
      hide: 'Hide',
      enable: 'Enable',
      disable: 'Disable',
      require: 'Make Required',
      unrequire: 'Make Optional',
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'show':
        return <Eye className="h-3 w-3" />;
      case 'hide':
        return <EyeOff className="h-3 w-3" />;
      case 'enable':
        return <Unlock className="h-3 w-3" />;
      case 'disable':
        return <Lock className="h-3 w-3" />;
      case 'require':
        return <AlertCircle className="h-3 w-3" />;
      case 'unrequire':
        return <Check className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="pb-6">
      <Tabs defaultValue="validation">
        <TabsList className="grid w-full grid-cols-2 bg-muted rounded-[var(--radius-card)] p-1">
          <TabsTrigger 
            value="validation" 
            className="rounded-[var(--radius-button)] data-[state=active]:bg-card data-[state=active]:shadow-[var(--elevation-sm)]"
          >
            <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Validation Rules</span>
          </TabsTrigger>
          <TabsTrigger 
            value="dependencies"
            className="rounded-[var(--radius-button)] data-[state=active]:bg-card data-[state=active]:shadow-[var(--elevation-sm)]"
          >
            <GitBranch className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Field Dependencies</span>
          </TabsTrigger>
        </TabsList>

        {/* Validation Rules Tab */}
        <TabsContent value="validation" className="mt-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h4 className="text-foreground mb-1">Custom Validation Rules</h4>
              <p className="text-muted-foreground">Define cross-field validation logic</p>
            </div>
            <Button
              onClick={() => setIsAddingRule(true)}
              size="sm"
              className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 shadow-[var(--elevation-sm)] flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Add Rule</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="space-y-4">
              {/* Add New Rule Form */}
              {isAddingRule && (
                <Card className="p-5 bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--elevation-sm)]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-foreground truncate">New Validation Rule</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingRule(false)}
                        className="rounded-[var(--radius-button)] flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rule Name</Label>
                        <Input
                          placeholder="e.g., Travel Date Validation"
                          value={newRule.name}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                          className="bg-input-background border-border rounded-[var(--radius-input)] w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          placeholder="Brief description of the rule"
                          value={newRule.description}
                          onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                          className="bg-input-background border-border rounded-[var(--radius-input)] w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Field</Label>
                          <Select
                            value={newRule.field1}
                            onValueChange={(value) => setNewRule({ ...newRule, field1: value })}
                          >
                            <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {schema.fields.map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Operator</Label>
                          <Select
                            value={newRule.operator}
                            onValueChange={(value: any) => setNewRule({ ...newRule, operator: value })}
                          >
                            <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="equal_to">Equal To</SelectItem>
                              <SelectItem value="not_equal_to">Not Equal To</SelectItem>
                              <SelectItem value="before">Before (Date)</SelectItem>
                              <SelectItem value="after">After (Date)</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="not_contains">Does Not Contain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Second Field (Optional)</Label>
                        <Select
                          value={newRule.field2 || '__none__'}
                          onValueChange={(value) => setNewRule({ ...newRule, field2: value === '__none__' ? undefined : value })}
                        >
                          <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                            <SelectValue placeholder="Select field or leave empty for value comparison" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">None (Value Comparison)</SelectItem>
                            {schema.fields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Error Message</Label>
                        <Textarea
                          placeholder="e.g., Travel start date cannot be greater than end date"
                          value={newRule.errorMessage}
                          onChange={(e) => setNewRule({ ...newRule, errorMessage: e.target.value })}
                          className="bg-input-background border-border rounded-[var(--radius-input)] min-h-[80px] resize-none w-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingRule(false)}
                        className="border-border rounded-[var(--radius-button)] w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddRule}
                        disabled={!newRule.name || !newRule.field1 || !newRule.errorMessage}
                        className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 w-full sm:w-auto"
                      >
                        <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Existing Rules List */}
              {customRules.length === 0 && !isAddingRule && (
                <Card className="p-8 text-center bg-card border border-dashed border-border rounded-[var(--radius-card)]">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-foreground mb-2">No validation rules yet</h4>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create custom rules to validate data across multiple fields
                  </p>
                  <Button
                    onClick={() => setIsAddingRule(true)}
                    size="sm"
                    variant="outline"
                    className="border-border rounded-[var(--radius-button)]"
                  >
                    <Plus className="h-4 w-4 mr-1 flex-shrink-0" />
                    Add Your First Rule
                  </Button>
                </Card>
              )}

              {customRules.map((rule) => (
                <Card key={rule.id} className="p-5 bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                        <h4 className="text-foreground truncate">{rule.name}</h4>
                      </div>
                      {rule.description && (
                        <p className="text-muted-foreground break-words">{rule.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-border rounded-[var(--radius-pill)] max-w-full">
                          <span className="truncate">{schema.fields.find(f => f.id === rule.field1)?.label || rule.field1}</span>
                        </Badge>
                        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary rounded-[var(--radius-pill)] flex-shrink-0">
                          {getOperatorLabel(rule.operator)}
                        </Badge>
                        {rule.field2 && (
                          <Badge variant="outline" className="border-border rounded-[var(--radius-pill)] max-w-full">
                            <span className="truncate">{schema.fields.find(f => f.id === rule.field2)?.label || rule.field2}</span>
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-[var(--radius-card)]">
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <p className="text-destructive break-words flex-1">{rule.errorMessage}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="rounded-[var(--radius-button)] hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Field Dependencies Tab */}
        <TabsContent value="dependencies" className="mt-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h4 className="text-foreground mb-1">Field Dependencies</h4>
              <p className="text-muted-foreground">Control field behavior based on other field values</p>
            </div>
            <Button
              onClick={() => setIsAddingDependency(true)}
              size="sm"
              className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 shadow-[var(--elevation-sm)] flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Add Dependency</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="space-y-4">
              {/* Add New Dependency Form */}
              {isAddingDependency && (
                <Card className="p-5 bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--elevation-sm)]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-foreground truncate">New Field Dependency</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingDependency(false)}
                        className="rounded-[var(--radius-button)] flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Dependency Name</Label>
                        <Input
                          placeholder="e.g., Show International Fields"
                          value={newDependency.name}
                          onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                          className="bg-input-background border-border rounded-[var(--radius-input)] w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          placeholder="Brief description"
                          value={newDependency.description}
                          onChange={(e) => setNewDependency({ ...newDependency, description: e.target.value })}
                          className="bg-input-background border-border rounded-[var(--radius-input)] w-full"
                        />
                      </div>

                      <Separator className="bg-border my-2" />

                      <div className="space-y-3">
                        <Label className="text-muted-foreground">When this condition is met:</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Source Field</Label>
                            <Select
                              value={newDependency.sourceField}
                              onValueChange={(value) => setNewDependency({ ...newDependency, sourceField: value })}
                            >
                              <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {schema.fields.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Has Value</Label>
                            <Input
                              placeholder="Enter value"
                              value={newDependency.sourceValue}
                              onChange={(e) => setNewDependency({ ...newDependency, sourceValue: e.target.value })}
                              className="bg-input-background border-border rounded-[var(--radius-input)] w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-border my-2" />

                      <div className="space-y-3">
                        <Label className="text-muted-foreground">Then perform this action:</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Action</Label>
                            <Select
                              value={newDependency.action}
                              onValueChange={(value: any) => setNewDependency({ ...newDependency, action: value })}
                            >
                              <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="show">Show Field</SelectItem>
                                <SelectItem value="hide">Hide Field</SelectItem>
                                <SelectItem value="enable">Enable Field</SelectItem>
                                <SelectItem value="disable">Disable Field</SelectItem>
                                <SelectItem value="require">Make Required</SelectItem>
                                <SelectItem value="unrequire">Make Optional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Target Field</Label>
                            <Select
                              value={newDependency.targetField}
                              onValueChange={(value) => setNewDependency({ ...newDependency, targetField: value })}
                            >
                              <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] w-full">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {schema.fields.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingDependency(false)}
                        className="border-border rounded-[var(--radius-button)] w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddDependency}
                        disabled={!newDependency.name || !newDependency.sourceField || !newDependency.targetField || !newDependency.sourceValue}
                        className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 w-full sm:w-auto"
                      >
                        <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                        Add Dependency
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Existing Dependencies List */}
              {dependencies.length === 0 && !isAddingDependency && (
                <Card className="p-8 text-center bg-card border border-dashed border-border rounded-[var(--radius-card)]">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-foreground mb-2">No field dependencies yet</h4>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create dependencies to show, hide, enable, or disable fields based on other field values
                  </p>
                  <Button
                    onClick={() => setIsAddingDependency(true)}
                    size="sm"
                    variant="outline"
                    className="border-border rounded-[var(--radius-button)]"
                  >
                    <Plus className="h-4 w-4 mr-1 flex-shrink-0" />
                    Add Your First Dependency
                  </Button>
                </Card>
              )}

              {dependencies.map((dependency) => (
                <Card key={dependency.id} className="p-5 bg-card border border-border rounded-[var(--radius-card)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-accent flex-shrink-0" />
                        <h4 className="text-foreground truncate">{dependency.name}</h4>
                      </div>
                      {dependency.description && (
                        <p className="text-muted-foreground break-words">{dependency.description}</p>
                      )}
                      
                      <div className="space-y-2 p-3 bg-muted/50 rounded-[var(--radius-card)] border border-border overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground flex-shrink-0">When</span>
                          <Badge variant="outline" className="border-accent/30 bg-accent/5 text-accent rounded-[var(--radius-pill)] max-w-full">
                            <span className="truncate">{schema.fields.find(f => f.id === dependency.sourceField)?.label || dependency.sourceField}</span>
                          </Badge>
                          <span className="text-muted-foreground flex-shrink-0">equals</span>
                          <Badge variant="outline" className="border-border rounded-[var(--radius-pill)] max-w-full">
                            <span className="truncate">{dependency.sourceValue}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground flex-shrink-0">Then</span>
                          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary rounded-[var(--radius-pill)] flex items-center gap-1 flex-shrink-0">
                            {getActionIcon(dependency.action)}
                            <span className="truncate">{getActionLabel(dependency.action)}</span>
                          </Badge>
                          <Badge variant="outline" className="border-accent/30 bg-accent/5 text-accent rounded-[var(--radius-pill)] max-w-full">
                            <span className="truncate">{schema.fields.find(f => f.id === dependency.targetField)?.label || dependency.targetField}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDependency(dependency.id)}
                        className="rounded-[var(--radius-button)] hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
