import { Loader } from "react-feather";

interface SpinningLoaderProps {
  /**
   * Informative label explaining why the loader is used, for screen readers
   */
  label: string;
}

export default function SpinningLoader({ label }: SpinningLoaderProps) {
  return <Loader aria-label="" className="mx-auto animate-spin" />;
}
