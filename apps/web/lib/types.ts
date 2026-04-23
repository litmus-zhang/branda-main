export interface BusinessPlan {
  brandIdentity: {
    name: string;
    slogan: string;
    mission: string;
    vision: string;
    colors: string[]; // hex codes
    fonts: string[];
    logoConcept: string;
    logoSvg: string; // New field for the actual SVG code
    toneOfVoice: string;
    usageGuidelines?: string; // New field for brand guide text
    socialAssets?: {
      profileImage?: string;
      bannerImage?: string;
      thumbnailImage?: string;
    };
  };
  marketing: {
    targetAudience: string;
    keyChannels: { name: string; url: string }[];
    strategy: string;
    contentIdeas: { title: string; description: string; type: string }[];
  };
  systems: {
    sops: { title: string; steps: string[] }[];
    techStackRecommendation: { category: string; tool: string; reason: string }[];
  };
  crm: {
    onboardingProcess: { step: string; description: string }[];
    mockCustomers: { name: string; status: 'Lead' | 'Active' | 'Churned'; email: string }[];
  };
  funding?: {
    ventureFunds: { name: string; focus: string; website: string }[];
    grants: { name: string; amount: string; deadline: string; website: string }[];
  };
  id?: string
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected';
  iconUrl?: string;
  description?: string;
  type?: 'standard' | 'mcp' | 'webhook' | 'api';
  config?: {
    baseUrl?: string;
    apiKey?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    mcpServerUrl?: string;
  };
}

export interface Collaborator {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active';
  invitedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: BusinessPlan;
  integrations: Integration[];
  collaborators: Collaborator[];
  createdAt: string;
  tier: 'Free' | 'Starter' | 'Growth' | 'Enterprise';
}

export type ViewType = 'brand' | 'marketing' | 'systems' | 'crm' | 'integrations' | 'team' | 'brainstorming' | 'funding';