import { MultiSelect } from '@mantine/core'
import { getListOfSkills } from '../actions/SkillActions'
import { useMsal } from '@azure/msal-react'
import { SkillPreview } from '../common/types'
import { useEffect, useState } from 'react'
import { Filter } from 'tabler-icons-react'

type IProps = {
  hackathonId: string
  onSelectedSkills: (skills: string[]) => void
}

export default function SkillSelector(props: IProps) {
  const { hackathonId } = props
  const { instance } = useMsal()
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState({
    skills: [] as SkillPreview[]
  })

  const loadAvailableSkills = () => {
    if (selectedHackathonId !== '') {
      getListOfSkills(instance).then((data) => {
        setAvailableSkills({
          ...availableSkills,
          skills: data.skills
        })
      })
    }
  }

  const handleSkillSelected = (skills: string[]) => {
    setSelectedSkills(skills)
    props.onSelectedSkills(skills)
  }

  const skills = availableSkills.skills.map((skill) => ({ 
    value: skill.id, 
    label: skill.name 
  }))

  useEffect(() => {
    loadAvailableSkills()
  }, [selectedHackathonId])

  useEffect(() => {
    handleSkillSelected(selectedSkills)
  }, [selectedSkills])

  useEffect(() => {
    setSelectedHackathonId(hackathonId)
  }, [hackathonId])

  return (
    <MultiSelect
      style={{ maxWidth: 350, maxHeight: 100 }}
      clearable
      searchable
      nothingFound='No skills found'
      data={skills}
      placeholder='Filter by skill'
      icon={<Filter />}
      maxDropdownHeight={150}
      value={selectedSkills}
      onChange={(value) => setSelectedSkills(value)}
    />
  )
}
