import os

replacements = {
    # In src/components/modals/
    "src/components/modals/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
    ],
    # In src/components/ui/
    "src/components/ui/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
        ("from '../utils/", "from '../../utils/"),
        ('from "../utils/', 'from "../../utils/'),
        ("from '../data/", "from '../../data/"),
        ('from "../data/', 'from "../../data/'),
    ],
    # In src/features/ats-scanner/
    "src/features/ats-scanner/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
        ("from '../utils/", "from '../../utils/"),
        ('from "../utils/', 'from "../../utils/'),
        ("from './QuickFixModal'", "from '../../components/modals/QuickFixModal'"),
        ("from './SkillsLearningRoadmap'", "from '../career-guidance/SkillsLearningRoadmap'"),
        ("from './RecentWorkIngestionCard'", "from '../../components/ui/RecentWorkIngestionCard'"),
        ("from './CareerGuidanceSection'", "from '../career-guidance/CareerGuidanceSection'"),
        ("from './SalaryAndPerksCard'", "from '../../components/ui/SalaryAndPerksCard'"),
        ("from './FDERoleComparisonSection'", "from '../career-guidance/FDERoleComparisonSection'"),
        ("from './FDETransitionPath'", "from '../career-guidance/FDETransitionPath'"),
        ("from './SeniorYoEAndImpactDeepDive'", "from '../hr-simulation/SeniorYoEAndImpactDeepDive'"),
        ("from './CareerPulse'", "from '../career-guidance/CareerPulse'"),
        ("from './ResumeEditingTrackerDashboard'", "from '../../components/ui/ResumeEditingTrackerDashboard'"),
        ("from './ProductionReadinessDashboard'", "from '../../components/ui/ProductionReadinessDashboard'"),
    ],
    # In src/features/career-guidance/
    "src/features/career-guidance/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
        ("from './SkillLearningResourcesModal'", "from '../../components/modals/SkillLearningResourcesModal'"),
    ],
    # In src/features/hr-simulation/
    "src/features/hr-simulation/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
    ],
    # In src/features/interview-prep/
    "src/features/interview-prep/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
    ],
    # In src/features/resume-editor/
    "src/features/resume-editor/": [
        ("from '../types'", "from '../../types'"),
        ('from "../types"', 'from "../../types"'),
        ("from '../utils/", "from '../../utils/"),
        ('from "../utils/', 'from "../../utils/'),
        ("from './BulletMetadataModal'", "from '../../components/modals/BulletMetadataModal'"),
    ],
}

for folder, rules in replacements.items():
    if not os.path.exists(folder):
        continue
    for fname in os.listdir(folder):
        if fname.endswith(".tsx") or fname.endswith(".ts"):
            fpath = os.path.join(folder, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            for old, new in rules:
                content = content.replace(old, new)
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)

print("Imports updated successfully.")
