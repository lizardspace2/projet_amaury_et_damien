import { Property } from "@/types/property";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyDescriptionProps {
  property: Property;
}

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!property.description) {
    return null;
  }

  const maxLength = 200;
  const shouldTruncate = property.description.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? property.description 
    : property.description.substring(0, maxLength) + "...";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-estate-800 mb-4">Description</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
        <div className="prose prose-gray max-w-none">
          <p className="text-estate-neutral-700 leading-relaxed whitespace-pre-line">
            {displayText}
          </p>
        </div>
        
        {shouldTruncate && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Lire la suite
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDescription;
