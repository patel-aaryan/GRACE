import { ChatBackground } from "@/components/backgrounds";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatBackground>{children}</ChatBackground>;
}
