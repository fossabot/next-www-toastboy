import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler(props: Record<string, unknown>) {
  return <StackHandler fullPage app={stackServerApp} {...props} />;
}
