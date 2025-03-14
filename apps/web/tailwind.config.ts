import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/tailwind-config/tailwind.config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
};

export default config;
