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
      <div className="flex flex-col items-center justify-center rounded-lg border border-white/20 bg-white/30 py-4 text-gray-900 shadow-lg backdrop-blur-xl backdrop-saturate-150 hover:border-blue-600 hover:text-blue-600 hover:shadow-xl dark:border-white/10 dark:bg-black/30 dark:text-gray-100">
        {icon && <FontAwesomeIcon icon={icon} className="" size="2xl" />}
        {text && <p className="pt-2 text-center">{text}</p>}
      </div>
    </a>
  )
}
