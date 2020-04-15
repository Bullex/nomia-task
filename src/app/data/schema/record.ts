export interface Record {
  id: string;
  name: string;
  items?: Record[];
  sections?: Record[];
  sale?: number;
}
