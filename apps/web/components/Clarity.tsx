"use client"

import { useEffect } from "react"
import Clarity from '@microsoft/clarity';

interface ClarityProps {
  projectId: string
}

export default function ClarityConfig({ projectId }: ClarityProps) {
  useEffect(() => {
    Clarity.init(projectId)
  }, [projectId])

  return null
}
