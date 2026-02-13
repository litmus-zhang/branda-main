import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { generateBusinessPlan } from './services/geminiService';

// Fix for missing global types
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;
declare const jest: any;

// Mock the service
jest.mock('./services/geminiService');

const mockPlan = {
  brandIdentity: { name: "Generated Brand", slogan: "", mission: "", vision: "", colors: [], fonts: [], logoConcept: "", logoSvg: "", toneOfVoice: "" },
  marketing: { targetAudience: "", keyChannels: [], strategy: "", contentIdeas: [] },
  systems: { sops: [], techStackRecommendation: [] },
  crm: { onboardingProcess: [], mockCustomers: [] }
};

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders Landing Page initially', () => {
    render(<App />);
    expect(screen.getByText(/Launch your dream business/i)).toBeInTheDocument();
  });

  it('generates a plan and shows auth modal when not logged in', async () => {
    (generateBusinessPlan as any).mockResolvedValue(mockPlan);

    render(<App />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Coffee Shop/i), { target: { value: 'Tech Startup' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. USA/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your unique value/i), { target: { value: 'AI stuff' } });

    // Submit
    fireEvent.click(screen.getByText(/Generate My Business/i));

    // Wait for loader
    expect(screen.getByText(/Building your Empire/i)).toBeInTheDocument();

    // Wait for Auth Modal
    await waitFor(() => {
      expect(screen.getByText(/Save your Workspace/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Generated Brand")).toBeInTheDocument();
  });

  it('logs in and displays dashboard after generation', async () => {
    (generateBusinessPlan as any).mockResolvedValue(mockPlan);
    render(<App />);

    // ... (Fill form logic repeated or helper function used)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Coffee Shop/i), { target: { value: 'Tech Startup' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. USA/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your unique value/i), { target: { value: 'AI stuff' } });
    fireEvent.click(screen.getByText(/Generate My Business/i));

    await waitFor(() => screen.getByText(/Save your Workspace/i));

    // Fill Auth
    fireEvent.change(screen.getByPlaceholderText(/Elon Musk/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/elon@example.com/i), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByText(/Claim Workspace/i));

    // Check Dashboard
    await waitFor(() => {
        expect(screen.getByText("Generated Brand")).toBeInTheDocument();
        expect(screen.getByText("Free Plan")).toBeInTheDocument();
    });
  });

  it('loads existing user and workspace from localStorage', () => {
    const user = { name: "Existing User", email: "existing@test.com" };
    const workspace = {
        id: "1",
        name: "Existing Brand",
        plan: mockPlan,
        integrations: [],
        collaborators: [{ email: "existing@test.com", role: "owner", status: "active" }],
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('branda_user', JSON.stringify(user));
    localStorage.setItem('branda_workspaces', JSON.stringify([workspace]));

    render(<App />);
    expect(screen.getByText("Existing Brand")).toBeInTheDocument();
    expect(screen.getByText("Existing User")).toBeInTheDocument();
  });
});