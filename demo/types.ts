export interface DemoProperty {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface DemoExample {
  title: string;
  description?: string;
  preview: string;
  code: string;
  previewClass?: string;
}

export interface DemoPropertyGroup {
  title?: string;
  labelColumn?: string;
  properties: DemoProperty[];
}

export type DemoControlType = 'boolean' | 'select' | 'text' | 'number';

export interface DemoControl {
  name: string;
  label?: string;
  type: DemoControlType;
  default?: string | boolean | number;
  options?: string[];
  /** Apply value to text content instead of an attribute */
  target?: 'attribute' | 'slot';
  /** Attribute is enabled when absent; use attr="false" to disable */
  defaultTrue?: boolean;
  description?: string;
}

export interface DemoPlayground {
  tag: string;
  slotDefault?: string;
  innerHTML?: string;
  previewClass?: string;
  /** Keep overlay inside the canvas shell instead of covering the viewport */
  contained?: boolean;
  shellClass?: string;
  /** Toggle button for modal-like components in the canvas */
  trigger?: {
    openLabel?: string;
    closeLabel?: string;
  };
  controls: DemoControl[];
  events?: string[];
}

export interface ComponentDemo {
  id: string;
  tag: string;
  name: string;
  description: string;
  icon: string;
  playground?: DemoPlayground;
  examples: DemoExample[];
  properties?: DemoProperty[];
  propertyGroups?: DemoPropertyGroup[];
}
