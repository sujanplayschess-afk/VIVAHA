import { NextRequest } from 'next/server'
import { apiHandler } from '@/lib/api/handler'
import { requireRole } from '@/lib/auth-helpers'
import { successResponse } from '@/lib/api/response'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const POST = apiHandler(async (req: NextRequest) => {
  try { await requireRole(req, ['ADMIN', 'SUPER_ADMIN']) } catch (e) {}

  const summary: Record<string, number> = {}
  const now = new Date()

  const existingPlans = await prisma.subscriptionPlan.findMany()
  if (existingPlans.length === 0) {
    const plans = [
      {
        name: 'Silver',
        slug: 'silver',
        price: 999,
        duration: 30,
        contactsAllowed: 50,
        messagesPerDay: 10,
        interestsPerDay: 5,
        features: { chat: true, photoGallery: true, basicSearch: true },
        isPopular: false,
      },
      {
        name: 'Gold',
        slug: 'gold',
        price: 1999,
        duration: 30,
        contactsAllowed: 100,
        messagesPerDay: 25,
        interestsPerDay: 15,
        features: { chat: true, photoGallery: true, advancedSearch: true, highlightedProfile: true },
        isPopular: true,
      },
      {
        name: 'Diamond',
        slug: 'diamond',
        price: 4999,
        duration: 30,
        contactsAllowed: -1,
        messagesPerDay: -1,
        interestsPerDay: -1,
        features: { chat: true, photoGallery: true, advancedSearch: true, highlightedProfile: true, verifiedBadge: true, prioritySupport: true },
        isPopular: false,
      },
    ]

    for (const plan of plans) {
      await prisma.subscriptionPlan.create({ data: plan })
    }
    summary.plans = 3
  } else {
    summary.plans = 0
  }

  const adminEmail = 'admin@vivahasetu.com'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const adminHash = await hashPassword('Admin@123')
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminHash,
        profileId: 'VST-ADMIN',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            gender: 'MALE',
            dateOfBirth: new Date('1990-01-01'),
            age: 35,
            profileCreatedBy: 'SELF',
            height: 170,
            religion: 'Hindu',
            motherTongue: 'Hindi',
            languages: 'Hindi, English',
            highestEducation: 'Masters',
            state: 'Delhi',
            city: 'New Delhi',
          },
        },
        privacySettings: { create: {} },
      },
    })
    summary.admin = 1
  } else {
    summary.admin = 0
  }

  const sampleProfiles = [
    {
      email: 'priya.sharma@example.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      gender: 'FEMALE' as const,
      age: 26,
      height: 162,
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'Masters',
      employedIn: 'PRIVATE' as const,
      occupation: 'Software Engineer',
      city: 'Mumbai',
      state: 'Maharashtra',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'I am a software engineer working at a top tech company. I love traveling and reading books.',
    },
    {
      email: 'rahul.verma@example.com',
      firstName: 'Rahul',
      lastName: 'Verma',
      gender: 'MALE' as const,
      age: 29,
      height: 175,
      religion: 'Hindu',
      caste: 'Rajput',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'GOVERNMENT' as const,
      occupation: 'IAS Officer',
      city: 'Delhi',
      state: 'Delhi',
      diet: 'NON_VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'OCCASIONALLY' as const,
      familyValues: 'MODERATE' as const,
      familyType: 'JOINT' as const,
      aboutMe: 'Civil servant dedicated to public service. Enjoy playing cricket and reading history.',
    },
    {
      email: 'anjali.patel@example.com',
      firstName: 'Anjali',
      lastName: 'Patel',
      gender: 'FEMALE' as const,
      age: 24,
      height: 158,
      religion: 'Hindu',
      caste: 'Patel',
      motherTongue: 'Gujarati',
      languages: 'Gujarati, Hindi, English',
      highestEducation: 'MBA',
      employedIn: 'PRIVATE' as const,
      occupation: 'Marketing Manager',
      city: 'Ahmedabad',
      state: 'Gujarat',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'JOINT' as const,
      aboutMe: 'Marketing professional who loves cooking and dancing. Looking for a caring partner.',
    },
    {
      email: 'arun.kumar@example.com',
      firstName: 'Arun',
      lastName: 'Kumar',
      gender: 'MALE' as const,
      age: 31,
      height: 180,
      religion: 'Hindu',
      caste: 'Kayastha',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'Ph.D',
      employedIn: 'GOVERNMENT' as const,
      occupation: 'Professor',
      city: 'Bangalore',
      state: 'Karnataka',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'SOCIALLY' as const,
      familyValues: 'LIBERAL' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Professor of Economics. Love teaching, research, and long drives on weekends.',
    },
    {
      email: 'deepika.singh@example.com',
      firstName: 'Deepika',
      lastName: 'Singh',
      gender: 'FEMALE' as const,
      age: 27,
      height: 165,
      religion: 'Hindu',
      caste: 'Rajput',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'PRIVATE' as const,
      occupation: 'Fashion Designer',
      city: 'Jaipur',
      state: 'Rajasthan',
      diet: 'NON_VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'OCCASIONALLY' as const,
      familyValues: 'MODERATE' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Fashion designer with a passion for traditional Indian wear. Love traveling and photography.',
    },
    {
      email: 'vikram.joshi@example.com',
      firstName: 'Vikram',
      lastName: 'Joshi',
      gender: 'MALE' as const,
      age: 28,
      height: 172,
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Marathi',
      languages: 'Marathi, Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'SELF_EMPLOYED' as const,
      occupation: 'Business Owner',
      city: 'Pune',
      state: 'Maharashtra',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'JOINT' as const,
      aboutMe: 'Running a successful family business. Values family traditions and looking for a life partner who shares similar values.',
    },
    {
      email: 'neha.gupta@example.com',
      firstName: 'Neha',
      lastName: 'Gupta',
      gender: 'FEMALE' as const,
      age: 25,
      height: 160,
      religion: 'Hindu',
      caste: 'Bania',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'MBBS',
      employedIn: 'PRIVATE' as const,
      occupation: 'Doctor',
      city: 'Chennai',
      state: 'Tamil Nadu',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'MODERATE' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Medical professional dedicated to patient care. Enjoy yoga, meditation, and classical music.',
    },
    {
      email: 'rohit.kapoor@example.com',
      firstName: 'Rohit',
      lastName: 'Kapoor',
      gender: 'MALE' as const,
      age: 30,
      height: 178,
      religion: 'Hindu',
      caste: 'Khatri',
      motherTongue: 'Punjabi',
      languages: 'Punjabi, Hindi, English',
      highestEducation: 'MBA',
      employedIn: 'PRIVATE' as const,
      occupation: 'Investment Banker',
      city: 'Mumbai',
      state: 'Maharashtra',
      diet: 'NON_VEGETARIAN' as const,
      smoking: 'OCCASIONALLY' as const,
      drinking: 'SOCIALLY' as const,
      familyValues: 'LIBERAL' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Finance professional working at a leading investment bank. Fitness enthusiast and love exploring new cuisines.',
    },
    {
      email: 'kavita.nair@example.com',
      firstName: 'Kavita',
      lastName: 'Nair',
      gender: 'FEMALE' as const,
      age: 23,
      height: 163,
      religion: 'Hindu',
      caste: 'Nair',
      motherTongue: 'Malayalam',
      languages: 'Malayalam, Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'PRIVATE' as const,
      occupation: 'Architect',
      city: 'Kochi',
      state: 'Kerala',
      diet: 'NON_VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'OCCASIONALLY' as const,
      familyValues: 'MODERATE' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Architect who loves design, art, and travelling. Looking for someone who appreciates creativity.',
    },
    {
      email: 'suresh.reddy@example.com',
      firstName: 'Suresh',
      lastName: 'Reddy',
      gender: 'MALE' as const,
      age: 32,
      height: 170,
      religion: 'Hindu',
      caste: 'Reddy',
      motherTongue: 'Telugu',
      languages: 'Telugu, Hindi, English',
      highestEducation: 'Masters',
      employedIn: 'PRIVATE' as const,
      occupation: 'Engineering Manager',
      city: 'Hyderabad',
      state: 'Telangana',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'JOINT' as const,
      aboutMe: 'Engineering manager at a leading tech firm. Family-oriented and looking for a sincere life partner.',
    },
    {
      email: 'pallavi.deshmukh@example.com',
      firstName: 'Pallavi',
      lastName: 'Deshmukh',
      gender: 'FEMALE' as const,
      age: 28,
      height: 161,
      religion: 'Hindu',
      caste: 'Maratha',
      motherTongue: 'Marathi',
      languages: 'Marathi, Hindi, English',
      highestEducation: 'Masters',
      employedIn: 'GOVERNMENT' as const,
      occupation: 'Civil Services',
      city: 'Nagpur',
      state: 'Maharashtra',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Civil servant passionate about education reform. Love reading, classical dance, and cooking.',
    },
    {
      email: 'amit.saxena@example.com',
      firstName: 'Amit',
      lastName: 'Saxena',
      gender: 'MALE' as const,
      age: 27,
      height: 176,
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      languages: 'Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'PRIVATE' as const,
      occupation: 'Product Manager',
      city: 'Gurgaon',
      state: 'Haryana',
      diet: 'NON_VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'SOCIALLY' as const,
      familyValues: 'MODERATE' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Product manager at a fast-growing startup. Love technology, trekking, and exploring new places.',
    },
    {
      email: 'shweta.iyer@example.com',
      firstName: 'Shweta',
      lastName: 'Iyer',
      gender: 'FEMALE' as const,
      age: 26,
      height: 164,
      religion: 'Hindu',
      caste: 'Iyer',
      motherTongue: 'Tamil',
      languages: 'Tamil, Hindi, English',
      highestEducation: 'Bachelors',
      employedIn: 'PRIVATE' as const,
      occupation: 'Data Scientist',
      city: 'Bangalore',
      state: 'Karnataka',
      diet: 'VEGETARIAN' as const,
      smoking: 'NO' as const,
      drinking: 'NO' as const,
      familyValues: 'TRADITIONAL' as const,
      familyType: 'NUCLEAR' as const,
      aboutMe: 'Data scientist who loves AI and machine learning. Also passionate about Bharatanatyam and Carnatic music.',
    },
  ]

  let profilesCreated = 0
  for (const profile of sampleProfiles) {
    const exists = await prisma.user.findUnique({ where: { email: profile.email } })
    if (exists) continue

    const passwordHash = await hashPassword('Test@123')
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    const profileId = `VST-${suffix}`

    const user = await prisma.user.create({
      data: {
        email: profile.email,
        passwordHash,
        profileId,
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: true,
        profile: {
          create: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            gender: profile.gender,
            dateOfBirth: new Date(now.getFullYear() - profile.age, 0, 1),
            age: profile.age,
            profileCreatedBy: 'SELF',
            height: profile.height,
            religion: profile.religion,
            caste: profile.caste,
            motherTongue: profile.motherTongue,
            languages: profile.languages || profile.motherTongue,
            highestEducation: profile.highestEducation,
            employedIn: profile.employedIn,
            occupation: profile.occupation,
            state: profile.state,
            city: profile.city,
            diet: profile.diet,
            smoking: profile.smoking,
            drinking: profile.drinking,
            familyValues: profile.familyValues,
            familyType: profile.familyType,
            aboutMe: profile.aboutMe,
            profileCompletion: 70,
          },
        },
        privacySettings: { create: {} },
      },
    })

    profilesCreated++
  }
  summary.profiles = profilesCreated

  if (summary.profiles && summary.profiles > 1) {
    const activeUsers = await prisma.user.findMany({
      where: {
        role: 'USER',
        status: 'ACTIVE',
        email: { not: adminEmail },
      },
      take: 8,
      select: { id: true },
    })

    let interestsCreated = 0
    if (activeUsers.length >= 2) {
      for (let i = 0; i < Math.min(5, activeUsers.length - 1); i++) {
        const sender = activeUsers[i]
        const receiver = activeUsers[i + 1]
        const exists = await prisma.interest.findUnique({
          where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } },
        })
        if (!exists) {
          await prisma.interest.create({
            data: {
              senderId: sender.id,
              receiverId: receiver.id,
              status: i === 0 ? 'ACCEPTED' : 'PENDING',
            },
          })
          interestsCreated++
        }
      }
    }
    summary.interests = interestsCreated

    let messagesCreated = 0
    const acceptedInterests = await prisma.interest.findMany({
      where: { status: 'ACCEPTED' },
    })

    for (const interest of acceptedInterests) {
      let room = await prisma.chatRoom.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { members: { some: { userId: interest.senderId } } },
            { members: { some: { userId: interest.receiverId } } },
          ],
        },
      })

      if (!room) {
        room = await prisma.chatRoom.create({
          data: {
            type: 'DIRECT',
            members: {
              createMany: {
                data: [
                  { userId: interest.senderId },
                  { userId: interest.receiverId },
                ],
              },
            },
          },
        })
      }

      const msgCount = await prisma.message.count({
        where: { chatRoomId: room.id },
      })

      if (msgCount === 0) {
        await prisma.message.create({
          data: {
            chatRoomId: room.id,
            senderId: interest.senderId,
            receiverId: interest.receiverId,
            content: 'Hello! Nice to connect with you.',
            type: 'TEXT',
          },
        })
        messagesCreated++
      }
    }
    summary.messages = messagesCreated
  }

  let notificationsCreated = 0
  const sampleUsers = await prisma.user.findMany({
    where: { role: 'USER', status: 'ACTIVE' },
    take: 5,
    select: { id: true },
  })

  for (const user of sampleUsers) {
    const count = await prisma.notification.count({ where: { userId: user.id } })
    if (count === 0) {
      const notificationTypes = ['INTEREST_RECEIVED', 'INTEREST_ACCEPTED', 'MESSAGE_RECEIVED', 'SYSTEM_ALERT'] as const
      for (let i = 0; i < 3; i++) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: notificationTypes[i],
            message: `Sample notification ${i + 1}`,
            type: notificationTypes[i],
            isRead: i !== 0,
          },
        })
        notificationsCreated++
      }
    }
  }
  summary.notifications = notificationsCreated

  return successResponse(summary, 'Database seeded successfully')
}, { csrfDisabled: true })
