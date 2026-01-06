import { IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface tileProps {
  icon?: IconDefinition
  text?: string
  link: string
}

export const Tile = ({ icon, text, link }: tileProps) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-[rgba(255,255,255,0.15)] py-4 text-gray-900 shadow-lg backdrop-blur-xl hover:border-blue-500/60 hover:bg-[rgba(255,255,255,0.25)] hover:text-blue-600 hover:shadow-xl dark:border-gray-700/50 dark:bg-slate-950/70 dark:text-gray-100">
        {icon && <FontAwesomeIcon icon={icon} className="" size="2xl" />}
        {text && <p className="pt-2 text-center">{text}</p>}
      </div>
    </a>
  )
}
