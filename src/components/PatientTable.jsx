import { cn, getStatusColor } from '../utils/helpers'
import Badge from './Badge'



export default function PatientTable({ patients, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#EAF1F4]"> 
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Patient</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Âge</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Sexe</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Condition</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Statut</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Dernière visite</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr 
              key={patient.id} 
              onClick={() => onRowClick?.(patient)}
              className={cn(
                'border-b border-[#EAF1F4] transition-colors',
                onRowClick && 'cursor-pointer hover:bg-[#F6FAFB]'
              )}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                    patient.gender === 'F' 
                      ? 'bg-gradient-to-br from-[#D96C6C] to-[#F4B860]' 
                      : 'bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3]'
                  )}>
                    {patient.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[#1D2D35]">{patient.name}</p>
                    <p className="text-xs text-[#5E7480]">{patient.email || `${patient.gender === 'F' ? 'Femme' : 'Homme'}`}</p>
                  </div>
                </div> 
              </td> 
              <td className="py-4 px-4"> 
                <span className="text-sm text-[#1D2D35]">{patient.age} ans</span> 
              </td>
              <td className="py-4 px-4"> 
                <span className="text-sm text-[#1D2D35]">{patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : 'N/A'}</span> 
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-[#1D2D35]">{patient.condition}</span>
              </td>
              <td className="py-4 px-4">
                <Badge variant={getStatusColor(patient.status)}>
                  {patient.status === 'stable' && 'Stable'}
                  {patient.status === 'critical' && 'Critique'}
                  {patient.status === 'monitoring' && 'Surveillance'}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-[#5E7480]">{patient.lastVisit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
