import SectionAnchor from '@/Components/SectionAnchor';
import { sectionId } from '@/lib/sectionId';
import type { LegalSection } from '@/types';

interface ProseProps {
    intro: string;
    sections: LegalSection[];
}

export default function Prose({ intro, sections }: ProseProps) {
    return (
        <div className="prose-block">
            <p>{intro}</p>

            {sections.map((section) => {
                const id = sectionId(section.title);

                return (
                    <section key={section.title} id={id}>
                        <h2>
                            <span className="section__heading">
                                <SectionAnchor id={id} label={section.title} />
                                {section.title}
                            </span>
                        </h2>
                        {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                        {section.list.length > 0 ? (
                            <ul>
                                {section.list.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                );
            })}
        </div>
    );
}
