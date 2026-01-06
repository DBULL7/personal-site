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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/10 py-4 text-gray-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-[20px] backdrop-saturate-[180%] hover:border-blue-500/60 hover:bg-white/20 hover:text-blue-600 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] dark:border-gray-700/50 dark:bg-slate-950/70 dark:text-gray-100 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        {icon && <FontAwesomeIcon icon={icon} className="" size="2xl" />}
        {text && <p className="pt-2 text-center">{text}</p>}
      </div>
    </a>
  )
}
