import {
  Badge,
  IconAlertTriangle,
  IconGitBranch,
  IconGitHub,
  IconLoader,
  IconPauseCircle,
} from 'ui'

import CardButton from 'components/ui/CardButton'
import { BASE_PATH, PROJECT_STATUS } from 'lib/constants'
import { Project } from 'types'
import { IntegrationProjectConnection } from 'data/integrations/integrations.types'
import { ResourceWarning } from 'data/usage/resource-warnings-query'
import ProjectCardWarnings from './ProjectCardWarnings'

export interface ProjectCardProps {
  project: Project
  rewriteHref?: string
  githubIntegration?: IntegrationProjectConnection
  vercelIntegration?: IntegrationProjectConnection
  resourceWarnings?: ResourceWarning
}

const ProjectCard = ({
  project,
  rewriteHref,
  githubIntegration,
  vercelIntegration,
  resourceWarnings,
}: ProjectCardProps) => {
  const { name, ref: projectRef } = project
  const desc = `${project.cloud_provider} | ${project.region}`

  const isBranchingEnabled = project.preview_branch_refs.length > 0
  const isGithubIntegrated = githubIntegration !== undefined
  const isVercelIntegrated = vercelIntegration !== undefined
  const githubRepository = githubIntegration?.metadata.name ?? undefined

  // Project status should supersede its read only status
  const isHealthy = project.status === PROJECT_STATUS.ACTIVE_HEALTHY
  const isPausing =
    project.status === PROJECT_STATUS.GOING_DOWN || project.status === PROJECT_STATUS.PAUSING
  const isPaused = project.status === PROJECT_STATUS.INACTIVE
  const isRestoring = project.status === PROJECT_STATUS.RESTORING

  const checkProjectResourceWarnings = (resourceWarnings: ResourceWarning) => {
    return Object.values(resourceWarnings).some(
      (value) => typeof value === 'boolean' && value === true
    )
  }

  const projectHasResourceWarnings =
    resourceWarnings !== undefined ? checkProjectResourceWarnings(resourceWarnings) : false

  return (
    <li className="col-span-1 list-none">
      <CardButton
        linkHref={rewriteHref ? rewriteHref : `/project/${projectRef}`}
        title={
          <div className="w-full justify-between space-y-1.5 px-6">
            <p className="flex-shrink truncate">{name}</p>
            <div className="flex items-center space-x-1.5">
              {isVercelIntegrated && (
                <div className="w-fit p-1 border rounded-md flex items-center border-scale-600">
                  <img
                    src={`${BASE_PATH}/img/icons/vercel-icon.svg`}
                    alt="Vercel Icon"
                    className="w-3"
                  />
                </div>
              )}
              {isBranchingEnabled && (
                <div className="w-fit p-1 border rounded-md flex items-center border-scale-600">
                  <IconGitBranch size={12} strokeWidth={1.5} />
                </div>
              )}
              {isGithubIntegrated && (
                <>
                  <div className="w-fit p-1 border rounded-md flex items-center border-scale-600">
                    <IconGitHub size={12} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs !ml-2 text-scale-1100">{githubRepository}</p>
                </>
              )}
            </div>
          </div>
        }
        footer={
          <div className="flex items-end justify-between px-6">
            <span className="text-xs lowercase text-scale-1000">{desc}</span>

            {isHealthy && (
              <Badge color="green">
                <div className="flex items-center gap-2">
                  <span className="truncate">Active</span>
                </div>
              </Badge>
            )}

            {isRestoring && (
              <Badge color="brand">
                <div className="flex items-center gap-2">
                  <IconLoader className="animate-spin" size={14} strokeWidth={2} />
                  <span className="truncate">Restoring</span>
                </div>
              </Badge>
            )}

            {isPausing && (
              <Badge color="scale">
                <div className="flex items-center gap-2">
                  <IconLoader className="animate-spin" size={14} strokeWidth={2} />
                  <span className="truncate">Pausing</span>
                </div>
              </Badge>
            )}

            {isPaused && (
              <Badge color="scale">
                <div className="flex items-center gap-2">
                  <IconPauseCircle size={14} strokeWidth={2} />
                  <span className="truncate">Paused</span>
                </div>
              </Badge>
            )}
          </div>
        }
      >
        {resourceWarnings && projectHasResourceWarnings ? (
          <ProjectCardWarnings resourceWarnings={resourceWarnings} />
        ) : (
          <div className="py-2" />
        )}
      </CardButton>
    </li>
  )
}

export default ProjectCard
