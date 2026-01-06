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
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white py-4 text-gray-900 hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:bg-slate-950 dark:text-gray-100">
        {icon && <FontAwesomeIcon icon={icon} className="" size="2xl" />}
        {text && <p className="pt-2 text-center">{text}</p>}
      </div>
    </a>
  )
}
