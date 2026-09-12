import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

export default function ExpandableDescription({ text, maxLength = 60 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-muted-themed text-sm leading-relaxed">{text}</p>;
  }

  return (
    <div>
      <p className="text-muted-themed text-sm leading-relaxed">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
      >
        {isExpanded ? (
          <>
            <MdExpandLess size={16} />
            Tutup
          </>
        ) : (
          <>
            <MdExpandMore size={16} />
            Baca Selengkapnya
          </>
        )}
      </button>
    </div>
  );
}