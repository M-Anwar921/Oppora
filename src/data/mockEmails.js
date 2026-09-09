let idCounter = 1
const nextId = () => `email-${idCounter++}`

export function createEmptyEmail() {
  return { id: nextId(), sender: '', subject: '', body: '' }
}

export const demoInboxEmails = [
  {
    id: nextId(),
    sender: 'talent@abclabs.ai',
    subject: 'AI Research Internship — Applications Open',
    body: `Hi,\n\nABC Labs is opening applications for our Fall AI Research Internship. We're looking for undergraduate students with a background in Python and machine learning who are curious about applied NLP research.\n\nRequirements: CGPA 3.0+, Computer Science or related field, Python and ML fundamentals.\nDocuments: CV, academic transcript, short motivation letter.\nDeadline: September 15, 2026.\nLocation: Remote.\n\nApply at https://abclabs.example.com/careers/ai-research-intern\nQuestions: careers@abclabs.ai`,
  },
  {
    id: nextId(),
    sender: 'hr@nimbussoft.com',
    subject: 'Software Engineering Internship — Nimbus Soft',
    body: `Hello,\n\nNimbus Soft is hiring interns for our web platform team. You'll work with React and Node.js alongside senior engineers on real production features.\n\nRequirements: JavaScript, React, basic Node.js, currently enrolled undergraduate.\nDocuments: CV, portfolio or GitHub link.\nDeadline: September 20, 2026.\nLocation: Lahore, Pakistan (on-site).\n\nApply: https://nimbussoft.example.com/apply`,
  },
  {
    id: nextId(),
    sender: 'scholarships@futuretech.org',
    subject: "FutureTech Foundation Merit Scholarship 2026",
    body: `Dear Student,\n\nThe FutureTech Foundation is awarding merit-based scholarships to Computer Science undergraduates demonstrating academic excellence and financial need.\n\nRequirements: CGPA 3.5+, enrolled in an accredited CS program, financial need statement.\nDocuments: Transcript, financial statement, recommendation letter.\nDeadline: October 1, 2026.\n\nDetails: https://futuretech.example.org/scholarship`,
  },
  {
    id: nextId(),
    sender: 'events@globalaicomp.org',
    subject: 'Global AI Competition — Student Track Now Open',
    body: `Hello innovator,\n\nRegistrations are open for the Global AI Competition, Student Track. Teams of 1-4 build and submit an AI solution to an open problem statement.\n\nRequirements: Currently enrolled student, basic ML/AI knowledge, team of up to 4.\nDocuments: Team registration form, project proposal (1 page).\nDeadline: September 12, 2026.\nLocation: Remote / online submission.\n\nRegister: https://globalaicomp.example.org/register`,
  },
  {
    id: nextId(),
    sender: 'fellowships@openresearch.io',
    subject: 'Open Research Fellowship in Applied Machine Learning',
    body: `Hi there,\n\nOpen Research is offering a part-time fellowship for undergraduates interested in applied ML research, working remotely with a mentor for one semester.\n\nRequirements: CGPA 3.2+, coursework or project experience in ML, strong interest in research.\nDocuments: CV, one-page research interest statement.\nDeadline: September 25, 2026.\nLocation: Remote.\n\nApply: https://openresearch.example.io/fellowship\nContact: fellows@openresearch.io`,
  },
  {
    id: nextId(),
    sender: 'newsletter@devweekly.com',
    subject: 'Dev Weekly #142 — This week in web dev',
    body: `This week: the latest React 19 patterns, three new CSS features to try, and our favorite dev tools roundup. Plus a deep dive on edge caching strategies.\n\nRead online or unsubscribe anytime.`,
  },
  {
    id: nextId(),
    sender: 'deals@techgear.store',
    subject: '⚡ 48-Hour Flash Sale — Up to 60% Off Laptops',
    body: `Big savings on laptops, monitors, and accessories this weekend only. Free shipping on orders over $50. Shop now before the sale ends!`,
  },
  {
    id: nextId(),
    sender: 'noreply@umt.edu.pk',
    subject: 'Campus Notice: Library Timing Changes This Week',
    body: `Dear Student,\n\nPlease note that the central library will have adjusted hours (9am-6pm) this week due to maintenance work. Regular hours resume next Monday.\n\nThank you,\nCampus Facilities Office`,
  },
  {
    id: nextId(),
    sender: 'careers@remoteworksco.com',
    subject: 'Remote Data Science Internship — RemoteWorks Co.',
    body: `Hi,\n\nRemoteWorks Co. is looking for a Data Science intern to join our fully remote team, working on customer analytics pipelines.\n\nRequirements: Python, SQL, basic statistics, CGPA 3.0+.\nDocuments: CV, transcript.\nDeadline: September 30, 2026.\nLocation: Remote (international eligible).\n\nApply: https://remoteworksco.example.com/careers/ds-intern`,
  },
  {
    id: nextId(),
    sender: 'grants@sciencefund.org',
    subject: 'Undergraduate Research Opportunity — Science Fund Grant',
    body: `Dear Student,\n\nThe Science Fund is offering small research grants to undergraduates proposing independent projects in AI, robotics, or data science.\n\nRequirements: Undergraduate enrollment, one-page project proposal, faculty advisor letter.\nDocuments: Proposal, advisor letter, budget outline.\nDeadline: October 10, 2026.\nLocation: Any (grant is remote-friendly).\n\nApply: https://sciencefund.example.org/undergrad-grants`,
  },
]
