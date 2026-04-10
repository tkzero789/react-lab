import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlaygroundPage() {
  return (
    <div className="h-dvh py-20">
      <Container className="max-w-4xl">
        <h1>Playground</h1>
        <ul className="mt-8 grid grid-cols-3 gap-4">
          <li>
            <Button asChild variant="muted" className="w-full">
              <Link href="/playground/system-builder">System Builder</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="muted" className="w-full">
              <Link href="/playground/new-portfolio">New Portfolio</Link>
            </Button>
          </li>
        </ul>
      </Container>
    </div>
  );
}
