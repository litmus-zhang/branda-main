interface OpportunityData {
  applicationCount: number;
  application_link: string;
  createdAt: string;
  deadline: string;
  description: string;
  id: string;
  name: string;
  requirements: string[];
  status: string;
  tags: string[];
  updatedAt: string;
}
interface ApplicationData {
  id: string;
  application_name: string;
  description: string;
  user_id: string;
  opportunity: OpportunityData;
  status: string;
  credentials: CredentialData[];
  createdAt: string;
  updatedAt: string;
}
interface CopilotData {
  id: string;
  name: string;
  fields: string[];
  review_type: string;
  study_type: string;
  status: string;
  similarity_level: number;
  nationality: string;
  study_country: string[];
  credentials: CredentialData[];
  owner_id: string;
  createdAt: string;
  updatedAt: string;
}
interface OpportunitySourceData {
  createdAt: string;
  id: string;
  link: string;
  name: string;
  status: string;
  type: string;
  updatedAt: string;
}
interface CredentialData {
  id: string;
  key: string;
  filename: string;
  mime_type: string;
  size: number;
  owner_id: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMetaProps {
  page: number;
  total: number;
  // prev: number;
  // next: number;
  pageSize: number;
}

interface GraphStats {

  date: string
  active: string
  new: string

}

interface ApplicationStats {
  total: number;
  new: number;
  active: number;
  acceptanceRate: number;
  graphData: GraphStats[]
}
interface DashboardData {
  applications: ApplicationStats;
}
export type {
  ApplicationData,
  OpportunityData,
  CopilotData,
  CredentialData,
  OpportunitySourceData,
  PaginationMetaProps,
  DashboardData,
  ApplicationStats
}