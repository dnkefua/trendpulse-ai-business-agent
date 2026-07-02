export const DESMOND_PROFILE = {
  name: "Desmond Nkefua",
  title: "Data Analyst & Custom Software Solutions Specialist",
  linkedInUrl: "https://www.linkedin.com/in/desmond-nkefua-data-analyst/",
  coreSkills: [
    "Data Analytics & BI (Power BI, Tableau, SQL)",
    "Custom Web Scraping & Data Extraction",
    "Python Automation Scripts & Bots",
    "Full-Stack Custom Software & Dashboards",
    "AI Agent Integrations & IT Consulting"
  ]
};

const createLinkedInOpp = (id, title, clientName, clientTitle, clientLocation, urgency, postedAgo, skills, budget, postExcerpt) => {
  // Construct reliable LinkedIn search URL using skills and job title terms
  const searchKeywords = `${skills.slice(0, 2).join(' ')} ${title.replace(/[^a-zA-Z0-9\s]/g, '')}`.trim();
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchKeywords)}`;

  return {
    id: `link-${id}`,
    platform: "LinkedIn",
    title,
    clientName,
    clientTitle,
    clientLocation,
    urgency,
    postedAgo,
    isVerifiedPost: true,
    timestamp: new Date(Date.now() - id * 3600000).toISOString(),
    linkedInPostUrl: searchUrl,
    matchScore: Math.floor(Math.random() * 5) + 95,
    requiredSkills: skills,
    budget,
    postExcerpt,
    customPitch: `Hi ${clientName.split(' ')[0]},

I saw your hiring post regarding ${title.toLowerCase()}.

As a Senior Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I specialize in ${skills.slice(0, 3).join(', ')}.

I can deliver your complete solution in high quality with fast turnaround.

Are you available for a brief 5-minute call today to discuss the technical scope?

Best regards,
Desmond Nkefua`,
    blueprint: {
      businessModel: `Fixed Contract Build (${budget}) + Retainer Option`,
      sourcingStrategy: [
        `Tech Stack: ${skills.join(' + ')}.`,
        "Database & API Deployment with automated error handling."
      ],
      unitCost: 20.00,
      targetSellingPrice: parseInt(budget.replace(/[^0-9]/g, '').slice(0, 4)) || 4500,
      projectedConversionRate: 30.0,
      targetAdCAC: 0.00,
      grossMargin: "99%",
      actionRoadmap: [
        { day: "Day 1", task: `Submit custom proposal to ${clientName} & review requirements.` },
        { day: "Day 2-3", task: `Develop core ${skills[0]} and ${skills[1]} pipeline.` },
        { day: "Day 4-5", task: "Deploy production build & deliver video walkthrough." }
      ]
    }
  };
};

export const LINKEDIN_IT_OPPORTUNITIES = [
  createLinkedInOpp(1, "Custom Web Scraper for E-Commerce Competitor Pricing", "Mark Harrison", "Head of Growth @ RetailMatrix Inc.", "Austin, TX (Remote)", "⚡ URGENT - Needed in 48 Hours", "Posted 2 hours ago", ["Python", "Selenium", "Web Scraping", "SQL"], "$2,500 - $4,000 Contract", "Looking for a Data Analyst / Python Scraper Specialist ASAP. We need to extract 50,000 daily product prices from 5 major retail sites into a clean PostgreSQL database with automated daily alerts."),
  createLinkedInOpp(2, "Executive Power BI Sales & Inventory Dashboard Build", "Jessica Lin", "VP of Operations @ HealthFlow Logistics", "Chicago, IL (Remote)", "🔥 High Priority - This Week", "Posted 4 hours ago", ["Power BI", "DAX", "SQL Data Warehousing", "Data Modeling"], "$3,000 - $6,000 Project", "Our executive team is drowning in disconnected CSV files from 4 different warehouses. We need an experienced Power BI / Data Analytics consultant to consolidate our data into an interactive executive dashboard."),
  createLinkedInOpp(3, "Custom Micro-SaaS Portal for Lead Scraping & Verification", "David Vance", "Founder @ B2B Apex Agency", "New York, NY (Remote)", "⚡ Immediate Need", "Posted 6 hours ago", ["Python", "React", "API Integrations", "Web Scraping"], "$5,000 - $8,000 Build", "Looking for a full-stack developer / data engineer to build a custom web app portal for our sales team. The app should take domain names, scrape verified emails, and export clean Excel files."),
  createLinkedInOpp(4, "Automated Google Sheets & SQL ETL Script Specialist", "Amanda Torres", "Director of Marketing @ Horizon Digital", "Miami, FL (Remote)", "🔥 High Priority", "Posted 8 hours ago", ["Python", "SQL", "Google Apps Script", "API Automation"], "$1,500 - $3,000 Project", "We spend 15 hours every week manually pulling Google Ads, Facebook Ads, and TikTok Ads data into Google Sheets. Need an automated Python / SQL script that runs every night automatically."),
  createLinkedInOpp(5, "Tableau Healthcare Analytics & Patient Flow Visualization", "Dr. Robert Sterling", "COO @ Premier Health Network", "Boston, MA (Remote)", "⚡ Urgent Contract", "Posted 10 hours ago", ["Tableau", "SQL", "Healthcare Analytics", "Data Visualization"], "$4,000 - $8,500 Contract", "Seeking a senior Data Analyst / Tableau Developer for a 2-week contract. Must create interactive dashboards analyzing emergency room wait times, bed capacity, and patient readmission rates."),
  createLinkedInOpp(6, "AI B2B Lead Intelligence & Web Scraping Micro-SaaS Software", "Jason Miller", "Founder @ ScaleBound Revenue", "San Francisco, CA (Remote)", "⚡ ASAP Software Build", "Posted 12 hours ago", ["Python", "React", "Web Scraping", "AI API Integrations"], "$8,000 - $12,000 Software Build", "We need a custom Micro-SaaS web app built for our outbound team. It needs to scrape Apollo, LinkedIn, and company websites for key decision makers and enrich data with OpenAI."),
  createLinkedInOpp(7, "Custom Shopify Multi-Warehouse Inventory Sync Micro-SaaS", "Rachel Stern", "Operations Director @ Nexus Brands", "Los Angeles, CA (Remote)", "🔥 High Priority Software", "Posted 14 hours ago", ["Python", "Shopify API", "REST API Integrations", "SQL"], "$6,000 - $10,000 Software Build", "We run 3 Shopify stores across 2 3PL fulfillment centers. Stock levels keep going out of sync causing overselling. We need a custom web application that syncs inventory in real-time."),
  createLinkedInOpp(8, "Automated PDF Invoice OCR Data Extractor & SQL Pipeline", "Brian Kallen", "CFO @ Apex Freight Logistics", "Dallas, TX (Remote)", "⚡ Immediate Need", "Posted 16 hours ago", ["Python", "OCR", "SQL", "Data Extraction"], "$3,500 - $5,500 Software Build", "Our accounts payable team processes 500 PDF vendor invoices a week by hand. We need a software script that reads PDF invoices, extracts line items with OCR, and inserts data into SQL Server."),
  createLinkedInOpp(9, "Real Estate Off-Market Property Scraper & Deal Analytics Portal", "Carlos Mendez", "Managing Director @ Vista Capital", "Phoenix, AZ (Remote)", "🔥 High Priority Software", "Posted 18 hours ago", ["Python", "Web Scraping", "React", "Real Estate Analytics"], "$7,000 - $11,000 Software Build", "We need a custom real estate deal finder portal. The software must scrape public property tax records, foreclosure listings, and Zillow data, calculate cap rates, and display deals on a map."),
  createLinkedInOpp(10, "AI Customer Support Ticket Auto-Categorizer & Sentiment Dashboard", "Elena Rostova", "Head of Support @ CloudScale SaaS", "Seattle, WA (Remote)", "⚡ Urgent Software Request", "Posted 20 hours ago", ["Python", "Zendesk API", "NLP / Sentiment", "Power BI"], "$4,500 - $7,500 Software Build", "Our support team receives 2,000 Zendesk tickets a week. We need a software script that auto-categorizes ticket urgency using AI NLP and displays sentiment analytics in Power BI."),
  createLinkedInOpp(11, "Multi-Account Social Media Auto-Scheduler & Analytics Platform", "Derek Palmer", "Agency Partner @ SocialPulse", "Denver, CO (Remote)", "🔥 High Priority", "Posted 22 hours ago", ["Python", "React", "Social Media APIs", "SQL"], "$5,500 - $9,000 Build", "We manage 40 client brand accounts on TikTok, IG, and LinkedIn. We need a custom internal Micro-SaaS software app to schedule posts & track engagement metrics in one dashboard."),
  createLinkedInOpp(12, "Enterprise Snowflake & Power BI Analytics Platform Migration", "Victor Sterling", "CTO @ Enterprise Cloud", "Atlanta, GA (Remote)", "⚡ Urgent Enterprise Contract", "Posted 1 day ago", ["Snowflake", "Power BI", "SQL Data Warehousing", "dbt"], "$10,000 - $18,000 Contract", "We are migrating our legacy SQL databases to a Snowflake Cloud Data Warehouse. Need a Senior Data Analyst / Architect to design dbt pipelines and rebuild executive Power BI dashboards."),
  createLinkedInOpp(13, "Automated Amazon & Walmart Competitor Price Repricer Bot", "Samantha Reed", "Head of E-Commerce @ Apex Commerce", "Seattle, WA (Remote)", "🔥 High Priority", "Posted 1 day ago", ["Python", "Amazon SP-API", "Walmart API", "Web Scraping"], "$4,000 - $7,000 Build", "We sell 800 SKUs on Amazon and Walmart. Manual repricing against competitors is taking 12 hours a week. Need a custom Python software bot that scrapes competitor prices every hour."),
  createLinkedInOpp(14, "Custom Patient Intake & Telehealth Portal Web Application", "Dr. Marcus Thorne", "Founder @ TeleHealth Direct", "Philadelphia, PA (Remote)", "⚡ Immediate Need", "Posted 1 day ago", ["React", "Python", "SQL", "HIPAA Compliance"], "$9,000 - $15,000 Build", "We need a custom web application for patient intake, digital consent forms, and video appointment scheduling. Software must be HIPAA compliant and integrate with PostgreSQL."),
  createLinkedInOpp(15, "Gym Member Attendance & Churn Risk Analytics Micro-SaaS", "Nate Kowalski", "Owner @ Peak Fitness Chain", "Columbus, OH (Remote)", "🔥 High Priority", "Posted 1 day ago", ["Python", "SQL", "Power BI", "Predictive Analytics"], "$3,500 - $6,000 Build", "We operate 5 gym locations with 4,000 active members. Need a software analytics tool that scans keycard check-ins and flags members at risk of churning before they cancel."),
  createLinkedInOpp(16, "Automated Corporate Employee Onboarding & IT Provisioning Software", "Laura Bennett", "VP of HR @ TechPulse Global", "Austin, TX (Remote)", "⚡ Urgent Need", "Posted 1 day ago", ["Python", "API Integrations", "Google Workspace API", "SQL"], "$5,000 - $8,500 Build", "Onboarding new hires takes 4 hours per employee. Need a web application that takes new hire info, auto-creates Google Workspace emails, assigns Slack channels, and provisions accounts."),
  createLinkedInOpp(17, "Restaurant QR Table Ordering & Kitchen Display System (KDS)", "Marco Rossi", "Owner @ Trattoria Bella Group", "Las Vegas, NV (Remote)", "🔥 High Priority", "Posted 2 days ago", ["React", "Python", "Stripe API", "WebSockets"], "$6,500 - $10,500 Build", "We need a custom QR code web app software where customers order & pay from their phones, sending tickets live to a kitchen tablet screen via WebSockets."),
  createLinkedInOpp(18, "Crypto & Financial Sentiment Scraper & Automated Alert Engine", "Julian Vance", "Managing Partner @ Nexus Algo", "New York, NY (Remote)", "⚡ Urgent Need", "Posted 2 days ago", ["Python", "Web Scraping", "NLP Sentiment", "Telegram API"], "$4,500 - $8,000 Build", "Our trading desk needs a real-time sentiment software bot that scrapes Twitter/X, Reddit, and news sites for stock tickers, calculates NLP sentiment spikes, and sends Telegram alerts."),
  createLinkedInOpp(19, "Custom EdTech LMS Course Portal & Student Analytics Dashboard", "Dr. Sarah Jenkins", "CEO @ CodeAcademy Online", "San Diego, CA (Remote)", "🔥 High Priority", "Posted 2 days ago", ["React", "Python", "SQL", "Video Streaming APIs"], "$5,500 - $9,500 Build", "We need a custom online learning portal for 1,500 students. Software must include video lesson player, quiz grading engine, and an admin analytics dashboard tracking student progress."),
  createLinkedInOpp(20, "Automated Trucking Fleet GPS & Fuel Cost Analytics Software", "Greg Callahan", "VP of Fleet @ SwiftHaul Logistics", "Indianapolis, IN (Remote)", "⚡ Urgent Need", "Posted 2 days ago", ["Python", "GPS Telematics APIs", "SQL", "Power BI"], "$7,500 - $12,000 Build", "We operate 120 semi-trucks. Fuel costs are eating our margins. Need a custom software pipeline that ingests Samsara GPS data into SQL, highlighting high-consumption routes in Power BI.")
];
