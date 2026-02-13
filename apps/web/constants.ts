import { Integration } from './types';

// Mock list of available integrations
export const MOCK_INTEGRATIONS: (Omit<Integration, 'status'> & { description: string, icon: string })[] = [
    // Communication
    {
        id: 'slack',
        name: 'Slack',
        category: 'Communication',
        description: 'Collaborate with your team in real-time channels.',
        icon: '💬'
    },
    {
        id: 'zoom',
        name: 'Zoom',
        category: 'Communication',
        description: 'Video conferencing and web conferencing service.',
        icon: '🎥'
    },
    {
        id: 'teams',
        name: 'Microsoft Teams',
        category: 'Communication',
        description: 'Business communication platform by Microsoft.',
        icon: 'T'
    },
    
    // Finance
    {
        id: 'stripe',
        name: 'Stripe',
        category: 'Finance',
        description: 'Accept payments online and manage subscriptions.',
        icon: '💳'
    },
    {
        id: 'quickbooks',
        name: 'QuickBooks',
        category: 'Finance',
        description: 'Accounting software for small businesses.',
        icon: '📗'
    },
    {
        id: 'xero',
        name: 'Xero',
        category: 'Finance',
        description: 'Online accounting software for small businesses.',
        icon: '🟦'
    },

    // CRM
    {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'CRM',
        description: 'Manage your contacts and sales pipeline effectively.',
        icon: '🟠'
    },
    {
        id: 'salesforce',
        name: 'Salesforce',
        category: 'CRM',
        description: 'Cloud-based software designed to help businesses connect with customers.',
        icon: '☁️'
    },

    // Productivity
    {
        id: 'google-workspace',
        name: 'Google Workspace',
        category: 'Productivity',
        description: 'Email, calendar, docs, and drive for your business.',
        icon: '📁'
    },
    {
        id: 'notion',
        name: 'Notion',
        category: 'Productivity',
        description: 'All-in-one workspace for notes, tasks, and wikis.',
        icon: '📝'
    },
    {
        id: 'trello',
        name: 'Trello',
        category: 'Productivity',
        description: 'Collaborative tool that organizes your projects into boards.',
        icon: '📋'
    },

    // E-commerce
    {
        id: 'shopify',
        name: 'Shopify',
        category: 'E-commerce',
        description: 'Start, run, and grow your e-commerce business.',
        icon: '🛍️'
    },
    {
        id: 'woocommerce',
        name: 'WooCommerce',
        category: 'E-commerce',
        description: 'Customizable, open-source eCommerce platform built on WordPress.',
        icon: '🛒'
    },

    // Marketing
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        category: 'Marketing',
        description: 'Email marketing and automation platform.',
        icon: '🐵'
    },
    {
        id: 'canva',
        name: 'Canva',
        category: 'Marketing',
        description: 'Graphic design platform that allows users to create social media graphics.',
        icon: '🎨'
    },

    // HR
    {
        id: 'gusto',
        name: 'Gusto',
        category: 'HR',
        description: 'Modern HR platform for payroll, benefits, and more.',
        icon: '👥'
    },
    {
        id: 'bamboohr',
        name: 'BambooHR',
        category: 'HR',
        description: 'HR software that collects and organizes all the information throughout the employee life cycle.',
        icon: '🐼'
    },

    // Automation
    {
        id: 'zapier',
        name: 'Zapier',
        category: 'Automation',
        description: 'Connect your apps and automate workflows.',
        icon: '⚡'
    }
];