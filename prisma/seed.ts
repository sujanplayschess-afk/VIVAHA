import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter })

async function main() {
  const plans = [
    {
      name: 'Free', slug: 'free', price: 0, duration: 0,
      contactsAllowed: 0, messagesPerDay: 5, interestsPerDay: 5,
      features: ["Basic Search", "Profile Creation", "Interest Sending (Limited)"],
      isPopular: false, isActive: true,
    },
    {
      name: 'Silver', slug: 'silver', price: 1999, duration: 30,
      contactsAllowed: 10, messagesPerDay: 50, interestsPerDay: 50,
      features: ["Highlight Profile", "View Contacts", "Chat with Matches"],
      isPopular: false, isActive: true,
    },
    {
      name: 'Gold', slug: 'gold', price: 3499, duration: 90,
      contactsAllowed: 50, messagesPerDay: 100, interestsPerDay: 100,
      features: ["Priority Profile", "Unlimited Chat", "View Horoscope"],
      isPopular: true, isActive: true,
    },
    {
      name: 'Diamond', slug: 'diamond', price: 5999, duration: 180,
      contactsAllowed: 150, messagesPerDay: 500, interestsPerDay: 500,
      features: ["All Gold Features", "Personal Relationship Manager", "Verification Badge"],
      isPopular: false, isActive: true,
    },
  ]

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan as any,
      create: plan as any,
    })
  }

  const adminPassword = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@vivahasetu.com' },
    update: {},
    create: {
      profileId: 'VST-000001',
      email: 'admin@vivahasetu.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  console.log('Seed data created successfully!')
  console.log('Admin: admin@vivahasetu.com / Admin@123')
}

main().catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
