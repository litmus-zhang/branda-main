import { Event } from '@branda/ui/lib/events';
import { EventCard } from '@branda/ui/components/event-card';

interface EventSectionProps {
    title: string;
    description: string;
    events: Event[];
}

export function EventSection({ title, description, events }: EventSectionProps) {
    if (events.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
}
