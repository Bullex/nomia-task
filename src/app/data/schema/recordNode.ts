export interface RecordNode {
  id: string;
  name: string;
  items?: RecordNode[];
  sections?: RecordNode[];
  sale?: number;
  expandable: boolean;
  level: number;
  isLeaf: boolean;
}
