import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SystemsView } from './SystemsView';
import { BusinessPlan } from '../types';

// Fix for missing global types
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;

const mockPlan: BusinessPlan = {
  brandIdentity: { name: "", slogan: "", mission: "", vision: "", colors: [], fonts: [], logoConcept: "", logoSvg: "", toneOfVoice: "" },
  marketing: { targetAudience: "", keyChannels: [], strategy: "", contentIdeas: [] },
  systems: {
    sops: [{ title: "Initial SOP", steps: ["Step 1"] }],
    techStackRecommendation: [{ category: "CRM", tool: "HubSpot", reason: "Good" }]
  },
  crm: { onboardingProcess: [], mockCustomers: [] }
};

describe('SystemsView', () => {
  it('renders SOPs and Tech Stack', () => {
    render(<SystemsView plan={mockPlan} onUpdate={() => {}} />);
    expect(screen.getByText("Initial SOP")).toBeInTheDocument();
    expect(screen.getByText("HubSpot")).toBeInTheDocument();
  });

  it('adds a new SOP in edit mode', () => {
    const onUpdateMock = jest.fn();
    render(<SystemsView plan={mockPlan} onUpdate={onUpdateMock} />);
    
    fireEvent.click(screen.getByText(/Edit Systems/i));
    fireEvent.click(screen.getByText(/Add SOP/i));
    fireEvent.click(screen.getByText(/Save Changes/i));
    
    const updatedPlan = onUpdateMock.mock.calls[0][0];
    expect(updatedPlan.systems.sops).toHaveLength(2);
    expect(updatedPlan.systems.sops[1].title).toBe("New Procedure");
  });

  it('adds a new Tech Tool in edit mode', () => {
    const onUpdateMock = jest.fn();
    render(<SystemsView plan={mockPlan} onUpdate={onUpdateMock} />);
    
    fireEvent.click(screen.getByText(/Edit Systems/i));
    fireEvent.click(screen.getByText(/Add Tool/i));
    fireEvent.click(screen.getByText(/Save Changes/i));
    
    const updatedPlan = onUpdateMock.mock.calls[0][0];
    expect(updatedPlan.systems.techStackRecommendation).toHaveLength(2);
    expect(updatedPlan.systems.techStackRecommendation[1].category).toBe("New Category");
  });
});