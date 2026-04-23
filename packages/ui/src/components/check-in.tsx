"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@branda/ui/components/alert-dialog"
import { Button } from "@branda/ui/components/button"
import { Camera } from "./scan"

export function CheckIn() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Check In</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Check In</AlertDialogTitle>
                    <AlertDialogDescription>
                        Scan the QR code to check in to the event.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {/* <Scanner /> */}
                <Camera />

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => console.log("Scan QR Code")}>Scan QR Code</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
