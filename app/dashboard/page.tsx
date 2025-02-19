'use client';
import Image from "next/image"
import { Progress } from "../../components/ui/progress"
import { Card } from "@/components/ui/card"
import Navbar from "../Navbar/page"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-background to-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <Card className="w-full md:w-64 p-6 text-center space-y-4 border-accent/20 shadow-lg">
            <div className="relative w-32 h-32 mx-auto">
              {/* <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Fitness Mascot"
                width={128}
                height={128}
                className="rounded-full border-4 border-primary"
              /> */}
            </div>
            <div>
              <h2 className="font-semibold text-primary">Your Fitness Buddy</h2>
              <p className="text-sm text-muted-foreground">Level 1</p>
            </div>
          </Card>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-primary">
                <h3 className="font-semibold">Current XP</h3>
                <span>50/100 XP</span>
              </div>
              <Progress value={60} className="h-3 bg-accent" />
            </div>

            <div className="flex gap-4">
              <Card className="p-4 flex-1 border-accent/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </Card>
              <Card className="p-4 flex-1 border-accent/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">150</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

