// Simple script to add sample data for testing
// Run with: npx ts-node src/seed-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  console.log('🌱 Seeding sample data...');

  try {
    // Create sample companies
    const techCorp = await prisma.company.create({
      data: {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        website: 'https://techcorp.com',
        customFields: { employees: 250, founded: 2015 },
      },
    });

    const cloudCo = await prisma.company.create({
      data: {
        name: 'CloudCo',
        industry: 'Cloud Computing',
        website: 'https://cloudco.io',
        customFields: { employees: 150, founded: 2018 },
      },
    });

    const retailPlus = await prisma.company.create({
      data: {
        name: 'RetailPlus',
        industry: 'Retail',
        website: 'https://retailplus.com',
        customFields: { employees: 500, founded: 2010 },
      },
    });

    // Create sample contacts
    const johnDoe = await prisma.contact.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techcorp.com',
        phone: '+1-555-0123',
        role: 'CTO',
        companyId: techCorp.id,
      },
    });

    const janeSmith = await prisma.contact.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@cloudco.io',
        phone: '+1-555-0456',
        role: 'CEO',
        companyId: cloudCo.id,
      },
    });

    const bobWilson = await prisma.contact.create({
      data: {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@retailplus.com',
        phone: '+1-555-0789',
        role: 'VP Sales',
        companyId: retailPlus.id,
      },
    });

    // Create sample opportunities
    await prisma.opportunity.create({
      data: {
        title: 'Cloud Migration Project',
        amount: 150000,
        status: 'proposal',
        closeDate: new Date('2025-08-15'),
        companyId: techCorp.id,
        contactId: johnDoe.id,
        customFields: { priority: 'high', source: 'website' },
      },
    });

    await prisma.opportunity.create({
      data: {
        title: 'AI Platform Implementation',
        amount: 250000,
        status: 'negotiation',
        closeDate: new Date('2025-09-30'),
        companyId: cloudCo.id,
        contactId: janeSmith.id,
        customFields: { priority: 'high', source: 'referral' },
      },
    });

    await prisma.opportunity.create({
      data: {
        title: 'E-commerce Platform Upgrade',
        amount: 75000,
        status: 'closed-won',
        closeDate: new Date('2025-06-30'),
        companyId: retailPlus.id,
        contactId: bobWilson.id,
        customFields: { priority: 'medium', source: 'cold_call' },
      },
    });

    // Create sample activities
    await prisma.activity.create({
      data: {
        type: 'call',
        details: 'Initial discovery call about cloud migration needs',
        companyId: techCorp.id,
        contactId: johnDoe.id,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'email',
        details: 'Sent proposal for AI platform implementation',
        companyId: cloudCo.id,
        contactId: janeSmith.id,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'meeting',
        details: 'Contract signing meeting for e-commerce upgrade',
        companyId: retailPlus.id,
        contactId: bobWilson.id,
      },
    });

    console.log('✅ Sample data seeded successfully!');
    console.log('Companies:', 3);
    console.log('Contacts:', 3);
    console.log('Opportunities:', 3);
    console.log('Activities:', 3);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly
if (require.main === module) {
  seedData();
}
