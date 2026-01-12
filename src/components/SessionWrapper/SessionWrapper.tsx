"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type SessionWrapperProps = {
  children: ReactNode;
};

// なぜラッパーが必要？
// SessionProvider は "use client" が必要だが、
// layout.tsx はサーバーコンポーネントのままにしたいため
export default function SessionWrapper({ children }: SessionWrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
