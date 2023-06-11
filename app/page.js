"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    /**
     * NOTE: Temporary redirect to login page.
     * FIXME: Error when using router.push("/login"); in useEffect.
     * Future implementation will use session cookie to check if user is logged in.
     */
    useEffect(() => {
        router.push("/login");
    }, [router]);

    return <div>Loading</div>;
}
