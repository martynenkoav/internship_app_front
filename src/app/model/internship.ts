import {Company} from "./company";

export class Internship {
  id: number;
  description: string;
  name: string;
  company_id: number;
  company: Company;
  url: string;
  responses: number;
  tags: string[] = [];
}
