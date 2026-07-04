import LabCards from "./lab-cards"
import UserMenu from "./apps/components/user-menu"

export default function Page() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-16">
      <h1>React Lab</h1>
      <UserMenu />
      <LabCards />
    </div>
  )
}
