import Icon3D from './Icon3D'

export default function PageHeader({ icon, title, subtitle, right }) {
  return (
    <header className="flex items-center gap-3.5 mb-6">
      {icon && <Icon3D name={icon} size={44} />}
      <div className="flex-1 min-w-0">
        <h1 className="text-[1.625rem] font-bold text-slate-50 leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
