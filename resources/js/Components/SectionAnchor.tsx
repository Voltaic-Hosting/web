interface SectionAnchorProps {
    id: string;
    label: string;
}

export default function SectionAnchor({ id, label }: SectionAnchorProps) {
    return (
        <a className="section__anchor" href={`#${id}`} aria-label={`${label} section link`}>
            #
        </a>
    );
}
