import { generateBusinessPlan } from './geminiService';
import { GoogleGenAI } from "@google/genai";

// Fix for missing global types
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;
declare const jest: any;

// Mock the GoogleGenAI SDK
jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn()
      }
    })),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      NUMBER: 'NUMBER',
      BOOLEAN: 'BOOLEAN'
    }
  };
});

describe('geminiService', () => {
  const mockGeneratedPlan = {
    brandIdentity: {
      name: "Test Biz",
      slogan: "Best Test",
      mission: "To test",
      vision: "Testing world",
      colors: ["#000000"],
      fonts: ["Arial"],
      logoConcept: "A checkmark",
      logoSvg: "<svg>...</svg>",
      toneOfVoice: "Professional"
    },
    marketing: {
      targetAudience: "Testers",
      keyChannels: [{ name: "Email", url: "" }],
      strategy: "Test everything",
      contentIdeas: [{ title: "Idea 1", description: "Desc 1", type: "Blog" }]
    },
    systems: {
      sops: [{ title: "SOP 1", steps: ["Step 1"] }],
      techStackRecommendation: [{ category: "CRM", tool: "HubSpot", reason: "Good" }]
    },
    crm: {
      onboardingProcess: [{ step: "Welcome", description: "Say hi" }],
      mockCustomers: [{ name: "John", status: "Active", email: "j@test.com" }]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully generates a business plan', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      text: JSON.stringify(mockGeneratedPlan)
    });

    (GoogleGenAI as unknown as any).mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }));

    const input = {
      niche: "Software",
      businessName: "Test Biz",
      details: "A testing company",
      country: "USA"
    };

    const result = await generateBusinessPlan(input);

    expect(result).toEqual(mockGeneratedPlan);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      model: "gemini-3-flash-preview",
      contents: expect.stringContaining("Software")
    }));
  });

  it('throws an error when API response is empty', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      text: null
    });

    (GoogleGenAI as unknown as any).mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }));

    await expect(generateBusinessPlan({
      niche: "Fail",
      businessName: "",
      details: "",
      country: ""
    })).rejects.toThrow("No response from AI");
  });

  it('throws an error when JSON parsing fails', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      text: "Invalid JSON"
    });

    (GoogleGenAI as unknown as any).mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }));

    await expect(generateBusinessPlan({
      niche: "Fail",
      businessName: "",
      details: "",
      country: ""
    })).rejects.toThrow();
  });
});