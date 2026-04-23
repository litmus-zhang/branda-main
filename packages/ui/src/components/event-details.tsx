"use client"

import { mockEvents } from '@branda/ui/lib/events';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@branda/ui/components/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@branda/ui/components/tabs"
import { Button } from '@branda/ui/components/button';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, BuildingIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { CheckIn } from '@branda/ui/components/check-in';



export function EventDetails({ id }: { id: string }) {
    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
        notFound();
    }

    const capacityPercentage = (event!.registered / event!.capacity) * 100;
    const spotsLeft = event!.capacity - event!.registered;
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="flex justify-between items-center">
                    <Link href="/events" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Events
                    </Link>
                    <CheckIn />
                </div>


                <Tabs defaultValue="overview" className="my-8">
                    <TabsList variant="line">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Card className="w-full mx-auto pt-0">
                            <div className="relative h-96 overflow-hidden rounded-lg mb-8">
                                <img
                                    src={event!.image || "/placeholder.svg"}
                                    alt={event!.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                        {event!.category}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-3 p-4">
                                {/* Main Content */}
                                <div className="lg:col-span-2">
                                    <h1 className="text-4xl font-bold text-foreground mb-4">{event!.title}</h1>

                                    {/* Event Details Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2 mb-8">
                                        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                                            <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Date & Time</p>
                                                <p className="font-medium text-foreground">{event!.date}</p>
                                                <p className="text-sm text-foreground">{event!.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                                            <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Location</p>
                                                <p className="font-medium text-foreground">{event!.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                                            <UsersIcon className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Attendees</p>
                                                <p className="font-medium text-foreground">{event!.registered} / {event!.capacity}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                                            <BuildingIcon className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Organizer</p>
                                                <p className="font-medium text-foreground">{event!.organizer}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
                                        <p className="text-muted-foreground leading-relaxed mb-4">{event!.details}</p>
                                    </div>

                                    {/* What to Expect */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-foreground mb-4">What to Expect</h2>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary flex-shrink-0 mt-0.5">✓</span>
                                                <span className="text-muted-foreground">Expert-led sessions and workshops</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary flex-shrink-0 mt-0.5">✓</span>
                                                <span className="text-muted-foreground">Networking opportunities with industry professionals</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary flex-shrink-0 mt-0.5">✓</span>
                                                <span className="text-muted-foreground">Certificates and credentials upon completion</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary flex-shrink-0 mt-0.5">✓</span>
                                                <span className="text-muted-foreground">Refreshments and meals included</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-4 rounded-lg border border-border bg-card p-6">
                                        {/* Capacity Info */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-foreground">Capacity</span>
                                                <span className="text-sm text-muted-foreground">{capacityPercentage.toFixed(0)}% full</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${capacityPercentage}%` }}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {spotsLeft > 0 ? (
                                                    <span className="text-green-600 font-medium">{spotsLeft} spots left</span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">Event is full</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Register Button */}
                                        <Link href={`/register?eventId=${event!.id}`} className="block mb-3">
                                            <Button className="w-full" size="lg">
                                                Register Now
                                            </Button>
                                        </Link>

                                        {/* Share Button */}
                                        <button className="w-full px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors">
                                            Share Event
                                        </button>

                                        {/* Event Status */}
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <p className="text-sm text-muted-foreground mb-2">Event Status</p>
                                            <div className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary capitalize">
                                                {event!.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>
                                    Track performance and user engagement metrics. Monitor trends and
                                    identify growth opportunities.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                                Page views are up 25% compared to last month.
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reports</CardTitle>
                                <CardDescription>
                                    Generate and download your detailed reports. Export data in
                                    multiple formats for analysis.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                                You have 5 reports ready and available to export.
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>
                                    Manage your account preferences and options. Customize your
                                    experience to fit your needs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                                Configure notifications, security, and themes.
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs >


            </div>
        </main>
    )
}
