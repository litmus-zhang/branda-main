import { EventSection } from "@branda/ui/components/event-section";
import { mockEvents } from "@branda/ui/lib/events";


export default function EventsList({ children }: { children?: React.ReactNode }) {
    const upcomingEvents = mockEvents.filter((e) => e.status === 'upcoming');
    const ongoingEvents = mockEvents.filter((e) => e.status === 'ongoing');
    const pastEvents = mockEvents.filter((e) => e.status === 'past');

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
            <EventSection
                title="Upcoming Events"
                description="Register now for exciting events coming soon"
                events={upcomingEvents}
            />
            <EventSection
                title="Ongoing Programs"
                description="Join these programs happening right now"
                events={ongoingEvents}
            />
            <EventSection
                title="Past Events"
                description="Check out what we've accomplished"
                events={pastEvents}
            />
        </div>
    );
}