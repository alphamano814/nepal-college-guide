import { Badge } from '@/components/ui/badge';
import { Faculty, Affiliation } from '@/types/college';

interface FilterChipsProps {
  selectedFaculties: Faculty[];
  selectedAffiliations: Affiliation[];
  onFacultyToggle: (faculty: Faculty) => void;
  onAffiliationToggle: (affiliation: Affiliation) => void;
}

const faculties: Faculty[] = ['Engineering', 'Management', 'Medical', 'Science', 'Humanities', 'Law'];
const affiliations: Affiliation[] = ['TU', 'KU', 'PU', 'Purbanchal', 'Pokhara'];

export function FilterChips({ 
  selectedFaculties, 
  selectedAffiliations, 
  onFacultyToggle, 
  onAffiliationToggle 
}: FilterChipsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Faculty</h3>
        <div className="flex flex-wrap gap-2">
          {faculties.map((faculty) => (
            <Badge
              key={faculty}
              variant={selectedFaculties.includes(faculty) ? "default" : "secondary"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedFaculties.includes(faculty) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-primary/10'
              }`}
              onClick={() => onFacultyToggle(faculty)}
            >
              {faculty}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Affiliation</h3>
        <div className="flex flex-wrap gap-2">
          {affiliations.map((affiliation) => (
            <Badge
              key={affiliation}
              variant={selectedAffiliations.includes(affiliation) ? "default" : "secondary"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedAffiliations.includes(affiliation) 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-secondary hover:bg-accent/10'
              }`}
              onClick={() => onAffiliationToggle(affiliation)}
            >
              {affiliation}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}