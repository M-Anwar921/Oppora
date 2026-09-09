export const SKILL_SUGGESTIONS = [
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'FastAPI',
  'MongoDB',
  'SQL',
  'Java',
  'C++',
  'TensorFlow',
  'Git',
]

export const INTEREST_OPTIONS = [
  'Generative AI',
  'Agentic AI',
  'Web Development',
  'Research',
  'Cybersecurity',
  'Data Science',
  'Software Engineering',
  'Robotics',
  'Product Design',
]

export const OPPORTUNITY_TYPE_OPTIONS = [
  'Internship',
  'Scholarship',
  'Fellowship',
  'Competition',
  'Research',
  'Job',
  'Grant',
  'Admission',
]

export const LOCATION_OPTIONS = ['Pakistan', 'Remote', 'International']

export const mockProfile = {
  degree: 'BS',
  program: 'Computer Science',
  semester: 6,
  cgpa: 3.62,
  skills: ['Python', 'React', 'Machine Learning', 'JavaScript', 'FastAPI'],
  interests: ['Generative AI', 'Research', 'Software Engineering'],
  preferredOpportunityTypes: ['Internship', 'Competition', 'Fellowship'],
  financialNeed: 'prefer-not-to-specify',
  locationPreference: ['Pakistan', 'Remote'],
  pastExperience: [
    { id: 'exp-1', label: 'AI Projects', detail: 'Built two ML portfolio projects with classical models and ANNs' },
    { id: 'exp-2', label: 'Web Development', detail: 'Full-stack MERN apps built solo and in hackathons' },
    { id: 'exp-3', label: 'Hackathons', detail: 'Competed in multiple national hackathons' },
  ],
}

export function computeProfileCompleteness(profile) {
  const checks = [
    !!profile.degree,
    !!profile.program,
    !!profile.semester,
    !!profile.cgpa,
    profile.skills?.length > 0,
    profile.interests?.length > 0,
    profile.preferredOpportunityTypes?.length > 0,
    profile.locationPreference?.length > 0,
    !!profile.financialNeed,
    profile.pastExperience?.length > 0,
  ]
  const passed = checks.filter(Boolean).length
  return Math.round((passed / checks.length) * 100)
}
