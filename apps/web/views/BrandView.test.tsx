import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandView } from './BrandView';
import { BusinessPlan } from '../types';

// Fix for missing global types
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;

const mockPlan: BusinessPlan = {
  brandIdentity: {
    name: "Old Brand",
    slogan: "Old Slogan",
    mission: "Mission for Old Brand",
    vision: "Vision",
    colors: ["#ffffff"],
    fonts: ["Arial"],
    logoConcept: "Concept",
    logoSvg: "<svg></svg>",
    toneOfVoice: "Neutral"
  },
  marketing: {
    targetAudience: "Audience",
    keyChannels: [],
    strategy: "Strategy for Old Brand",
    contentIdeas: [{ title: "Post about Old Brand", description: "Desc", type: "Social" }]
  },
  systems: {
    sops: [{ title: "SOP for Old Brand", steps: ["Step 1"] }],
    techStackRecommendation: []
  },
  crm: {
    onboardingProcess: [],
    mockCustomers: []
  }
};

describe('BrandView', () => {
  it('renders brand details correctly', () => {
    render(<BrandView plan={mockPlan} onUpdate={() => {}} />);
    expect(screen.getByText("Old Brand")).toBeInTheDocument();
    expect(screen.getByText('"Old Slogan"')).toBeInTheDocument();
  });

  it('switches to edit mode', () => {
    render(<BrandView plan={mockPlan} onUpdate={() => {}} />);
    const editButton = screen.getByText(/Edit Assets/i);
    fireEvent.click(editButton);
    expect(screen.getByDisplayValue("Old Brand")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Slogan")).toBeInTheDocument();
  });

  it('propagates brand name changes to other fields on save', () => {
    const onUpdateMock = jest.fn();
    render(<BrandView plan={mockPlan} onUpdate={onUpdateMock} />);
    
    // Enter edit mode
    fireEvent.click(screen.getByText(/Edit Assets/i));
    
    // Change name
    const nameInput = screen.getByDisplayValue("Old Brand");
    fireEvent.change(nameInput, { target: { value: "New Brand" } });
    
    // Save
    fireEvent.click(screen.getByText(/Save Changes/i));
    
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    const updatedPlan = onUpdateMock.mock.calls[0][0] as BusinessPlan;
    
    // Check if name updated
    expect(updatedPlan.brandIdentity.name).toBe("New Brand");
    
    // Check propagation
    expect(updatedPlan.brandIdentity.mission).toBe("Mission for New Brand");
    expect(updatedPlan.marketing.strategy).toBe("Strategy for New Brand");
    expect(updatedPlan.marketing.contentIdeas[0].title).toBe("Post about New Brand");
    expect(updatedPlan.systems.sops[0].title).toBe("SOP for New Brand");
  });

  it('hides edit button in read-only mode', () => {
    render(<BrandView plan={mockPlan} onUpdate={() => {}} isReadOnly={true} />);
    expect(screen.queryByText(/Edit Assets/i)).not.toBeInTheDocument();
  });

  it('opens brand guide modal', () => {
     render(<BrandView plan={mockPlan} onUpdate={() => {}} />);
     fireEvent.click(screen.getByText(/View Brand Guide/i));
     expect(screen.getByText(/Official usage guidelines for Old Brand/i)).toBeInTheDocument();
  });
});