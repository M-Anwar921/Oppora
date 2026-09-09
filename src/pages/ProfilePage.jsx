import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Wrench, Heart, Target, MapPin, Wallet, Briefcase, CheckCircle2 } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import {
  SKILL_SUGGESTIONS,
  INTEREST_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  computeProfileCompleteness,
} from '../data/mockProfile'
import PageHeader from '../components/common/PageHeader'
import ProfileCompletenessBar from '../components/profile/ProfileCompletenessBar'
import FormSection from '../components/profile/FormSection'
import AcademicForm from '../components/profile/AcademicForm'
import SkillsSelector from '../components/profile/SkillsSelector'
import ChipMultiSelect from '../components/profile/ChipMultiSelect'
import FinancialNeedSelector from '../components/profile/FinancialNeedSelector'
import PastExperienceEditor from '../components/profile/PastExperienceEditor'

export default function ProfilePage() {
  const { profile, persistProfile } = useAppData()
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setForm(profile), [profile])

  const liveCompleteness = computeProfileCompleteness(form)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await persistProfile(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Build your opportunity profile so every match, score, and ranking is personalized to you."
      />

      <div className="mb-6">
        <ProfileCompletenessBar percent={liveCompleteness} />
      </div>

      <div className="space-y-5">
        <FormSection icon={GraduationCap} title="Academic information" description="Your degree, program, and standing.">
          <AcademicForm value={form} onChange={(patch) => setForm({ ...form, ...patch })} />
        </FormSection>

        <FormSection icon={Wrench} title="Skills" description="Add the skills you'd want opportunities matched against.">
          <SkillsSelector
            value={form.skills}
            onChange={(skills) => setForm({ ...form, skills })}
            suggestions={SKILL_SUGGESTIONS}
          />
        </FormSection>

        <FormSection icon={Heart} title="Interests" description="Select the areas you're most drawn to.">
          <ChipMultiSelect
            options={INTEREST_OPTIONS}
            value={form.interests}
            onChange={(interests) => setForm({ ...form, interests })}
          />
        </FormSection>

        <FormSection icon={Target} title="Preferred opportunities" description="What kinds of opportunities should we prioritize?">
          <ChipMultiSelect
            options={OPPORTUNITY_TYPE_OPTIONS}
            value={form.preferredOpportunityTypes}
            onChange={(preferredOpportunityTypes) => setForm({ ...form, preferredOpportunityTypes })}
            columns="grid"
          />
        </FormSection>

        <FormSection icon={MapPin} title="Location preferences" description="Where are you open to opportunities based?">
          <ChipMultiSelect
            options={LOCATION_OPTIONS}
            value={form.locationPreference}
            onChange={(locationPreference) => setForm({ ...form, locationPreference })}
          />
        </FormSection>

        <FormSection icon={Wallet} title="Financial need" description="Helps us surface need-based scholarships and grants when relevant.">
          <FinancialNeedSelector
            value={form.financialNeed}
            onChange={(financialNeed) => setForm({ ...form, financialNeed })}
          />
        </FormSection>

        <FormSection icon={Briefcase} title="Past experience" description="Projects, roles, or activities worth matching against.">
          <PastExperienceEditor
            value={form.pastExperience}
            onChange={(pastExperience) => setForm({ ...form, pastExperience })}
          />
        </FormSection>
      </div>

      <div className="sticky bottom-4 lg:bottom-6 mt-8 flex justify-end">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-indigo hover:bg-accent-indigo/90 disabled:opacity-60 text-white text-[14px] font-medium shadow-glow transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} /> Profile saved
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {saving ? 'Saving…' : 'Save Opportunity Profile'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
