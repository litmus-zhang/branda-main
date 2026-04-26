"use client"
import { Inbox } from "@novu/react";

export default function InboxComponent({ user }: any) {

    return (
        <Inbox
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID as string}
            subscriberId={user.id}
        />
    );
}